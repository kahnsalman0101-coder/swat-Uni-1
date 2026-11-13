'use strict';

const { query } = require('../config/db');
const httpError = require('../utils/httpError');
const { parsePage, parseLimit, buildMeta } = require('../utils/pagination');

/** The five editorial sections the university publishes. */
const CATEGORIES = Object.freeze(['news', 'announcement', 'event', 'tender', 'job']);

const CATEGORY_LABELS = Object.freeze({
  news: 'Latest News',
  announcement: 'Announcements',
  event: 'Events',
  tender: 'Tender',
  job: 'Jobs'
});

const COLUMNS = `
  id,
  slug,
  title,
  category,
  published_date         AS publishedDate,
  excerpt,
  url,
  image_url              AS imageUrl,
  attachment_url         AS attachmentUrl
`;

function placeholders(count) {
  return new Array(count).fill('?').join(', ');
}

/**
 * Coerce the `category` query value into a validated array of category keys.
 *
 * @param {unknown} raw Raw query value (single, repeated, or comma separated).
 * @returns {string[]} Validated categories.
 * @throws {Error} 400 when an unknown category is supplied.
 */
function parseCategories(raw) {
  if (raw === undefined || raw === '') {
    return [];
  }
  const list = (Array.isArray(raw) ? raw : [raw])
    .flatMap((item) => String(item).split(','))
    .map((item) => item.trim().toLowerCase())
    .filter((item) => item.length > 0);
  const unique = [...new Set(list)];
  const invalid = unique.filter((item) => !CATEGORIES.includes(item));
  if (invalid.length > 0) {
    throw httpError(400, `\`category\` must be one of: ${CATEGORIES.join(', ')}`);
  }
  return unique;
}

/**
 * Per-category totals for the active search term, used for tab badges and for
 * the homepage section counts.
 *
 * @param {string} search Active search term (empty when none).
 * @returns {Promise<object>} Map of category -> count.
 */
async function countByCategory(search) {
  const params = [];
  let where = 'WHERE is_active = 1';
  if (search) {
    where += ' AND (title LIKE ? OR excerpt LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }
  const rows = await query(
    `SELECT category, COUNT(*) AS count FROM content_items ${where} GROUP BY category`,
    params
  );
  const counts = Object.fromEntries(CATEGORIES.map((key) => [key, 0]));
  for (const row of rows) {
    counts[row.category] = Number(row.count);
  }
  counts.all = Object.values(counts).reduce((total, value) => total + value, 0);
  return counts;
}

/**
 * List editorial items, newest first, optionally narrowed to one or more
 * categories and to a search term.
 *
 * @param {Record<string, unknown>} queryString Express query object.
 * @returns {Promise<{ data: object[], meta: object, counts: object, categories: object[] }>} Listing payload.
 */
async function listContent(queryString) {
  const categories = parseCategories(queryString.category);
  const search = typeof queryString.q === 'string' ? queryString.q.trim() : '';
  const page = parsePage(queryString.page);
  const limit = parseLimit(queryString.limit);
  const offset = (page - 1) * limit;

  const clauses = ['is_active = 1'];
  const params = [];

  if (categories.length > 0) {
    clauses.push(`category IN (${placeholders(categories.length)})`);
    params.push(...categories);
  }
  if (search) {
    clauses.push('(title LIKE ? OR excerpt LIKE ?)');
    params.push(`%${search}%`, `%${search}%`);
  }

  const where = `WHERE ${clauses.join(' AND ')}`;

  const [rows, countRows, counts] = await Promise.all([
    query(
      `SELECT ${COLUMNS} FROM content_items ${where}
       ORDER BY published_date DESC, id DESC
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    ),
    query(`SELECT COUNT(*) AS total FROM content_items ${where}`, params),
    countByCategory(search)
  ]);

  return {
    data: rows,
    meta: buildMeta({ page, limit, total: countRows[0].total }),
    counts,
    categories: CATEGORIES.map((key) => ({ key, label: CATEGORY_LABELS[key], count: counts[key] }))
  };
}

/**
 * Fetch a single editorial item by slug.
 *
 * @param {string} slug Content slug.
 * @returns {Promise<object>} Content item.
 * @throws {Error} 404 when no active item matches.
 */
async function getContentBySlug(slug) {
  const rows = await query(
    `SELECT ${COLUMNS} FROM content_items WHERE slug = ? AND is_active = 1 LIMIT 1`,
    [slug]
  );
  if (rows.length === 0) {
    throw httpError(404, 'Item not found');
  }
  return rows[0];
}

module.exports = {
  listContent,
  getContentBySlug,
  CATEGORIES,
  CATEGORY_LABELS
};
