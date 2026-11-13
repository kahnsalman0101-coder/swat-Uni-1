'use strict';

const { query } = require('../config/db');
const httpError = require('../utils/httpError');
const { mapSummary, mapDetail } = require('../utils/programMapper');
const { parsePage, parseLimit, buildMeta } = require('../utils/pagination');

const SORT_KEYS = Object.freeze([
  'relevance',
  'title',
  'title_desc',
  'degree',
  'department',
  'campus',
  'newest'
]);

const STATIC_SORTS = Object.freeze({
  title: 'p.title ASC',
  title_desc: 'p.title DESC',
  degree: 'dt.sort_order ASC, p.title ASC',
  department: 'd.name ASC, p.title ASC',
  campus: 'c.sort_order ASC, c.name ASC, p.title ASC',
  newest: 'p.id DESC'
});

const BASE_FROM = `
  FROM programs p
  JOIN degree_types dt ON dt.id = p.degree_type_id
  JOIN departments  d  ON d.id  = p.department_id
  JOIN faculties    f  ON f.id  = d.faculty_id
  JOIN campuses     c  ON c.id  = p.campus_id
`;

const KEYWORD_FROM = `
  ${BASE_FROM}
  JOIN program_keywords pk ON pk.program_id = p.id
  JOIN keywords         k  ON k.id  = pk.keyword_id
`;

const SUMMARY_COLUMNS = `
  p.id,
  p.slug,
  p.title,
  p.overview,
  p.duration,
  p.source_url            AS sourceUrl,
  dt.code                 AS degreeType,
  dt.label                AS degreeTypeLabel,
  dt.level                AS level,
  dt.badge_key            AS badgeKey,
  d.name                  AS department,
  d.slug                  AS departmentSlug,
  f.name                  AS faculty,
  f.slug                  AS facultySlug,
  f.short_name            AS facultyShortName,
  c.name                  AS campus,
  c.slug                  AS campusSlug
`;

const DETAIL_COLUMNS = `
  ${SUMMARY_COLUMNS},
  p.description,
  p.admission_note        AS admissionNote,
  p.website_url           AS websiteUrl,
  p.department_id         AS departmentId,
  p.degree_type_id        AS degreeTypeId,
  d.url                   AS departmentUrl,
  d.overview              AS departmentOverview,
  d.faculty_id            AS facultyId,
  f.url                   AS facultyUrl,
  f.overview              AS facultyOverview,
  p.campus_id             AS campusId,
  c.url                   AS campusUrl,
  c.location              AS campusLocation
`;

/**
 * Coerce a query value that may be repeated and/or comma separated into a
 * de-duplicated array of trimmed strings.
 *
 * @param {unknown} value Raw query value.
 * @returns {string[]} Normalised values.
 */
function toStringArray(value) {
  if (value === undefined) {
    return [];
  }
  const raw = Array.isArray(value) ? value : [value];
  const values = raw
    .flatMap((item) => String(item).split(','))
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
  return [...new Set(values)];
}

/**
 * Reduce the query string into a normalised, typed filter object.
 *
 * @param {Record<string, unknown>} queryString Express query object.
 * @returns {object} Normalised filters.
 */
function normaliseFilters(queryString) {
  return {
    search: typeof queryString.search === 'string' ? queryString.search.trim() : '',
    degrees: toStringArray(queryString.degree),
    levels: toStringArray(queryString.level),
    faculties: toStringArray(queryString.faculty),
    departments: toStringArray(queryString.department),
    campuses: toStringArray(queryString.campus),
    keywords: toStringArray(queryString.keyword)
  };
}

/**
 * Validate the `sort` parameter against the whitelist (prevents SQL injection).
 *
 * @param {unknown} raw Raw query value.
 * @returns {string} A valid sort key.
 */
function parseSort(raw) {
  if (raw === undefined || raw === '') {
    return 'relevance';
  }
  if (typeof raw !== 'string' || !SORT_KEYS.includes(raw)) {
    throw httpError(400, `\`sort\` must be one of: ${SORT_KEYS.join(', ')}`);
  }
  return raw;
}

function placeholders(count) {
  return new Array(count).fill('?').join(', ');
}

/**
 * Build a WHERE clause from the active filters. Pass a facet dimension name to
 * `exclude` in order to omit that dimension's own condition (facet scoping).
 *
 * @param {object} filters Normalised filters.
 * @param {'search'|'degree'|'level'|'faculty'|'department'|'campus'|'keyword'} [exclude] Dimension to omit.
 * @returns {{ sql: string, params: unknown[] }} Clause fragment and its bound params.
 */
function buildWhere(filters, exclude) {
  const clauses = ['p.is_active = 1'];
  const params = [];

  if (exclude !== 'search' && filters.search) {
    const like = `%${filters.search}%`;
    clauses.push(`(
      p.title LIKE ? OR p.overview LIKE ? OR p.description LIKE ?
      OR d.name LIKE ? OR f.name LIKE ?
      OR EXISTS (
        SELECT 1
        FROM program_keywords pks
        JOIN keywords ks ON ks.id = pks.keyword_id
        WHERE pks.program_id = p.id AND ks.name LIKE ?
      )
    )`);
    params.push(like, like, like, like, like, like);
  }

  if (exclude !== 'degree' && filters.degrees.length > 0) {
    clauses.push(`dt.code IN (${placeholders(filters.degrees.length)})`);
    params.push(...filters.degrees);
  }

  if (exclude !== 'level' && filters.levels.length > 0) {
    clauses.push(`dt.level IN (${placeholders(filters.levels.length)})`);
    params.push(...filters.levels);
  }

  if (exclude !== 'faculty' && filters.faculties.length > 0) {
    clauses.push(`f.slug IN (${placeholders(filters.faculties.length)})`);
    params.push(...filters.faculties);
  }

  if (exclude !== 'department' && filters.departments.length > 0) {
    clauses.push(`d.slug IN (${placeholders(filters.departments.length)})`);
    params.push(...filters.departments);
  }

  if (exclude !== 'campus' && filters.campuses.length > 0) {
    clauses.push(`c.slug IN (${placeholders(filters.campuses.length)})`);
    params.push(...filters.campuses);
  }

  if (exclude !== 'keyword' && filters.keywords.length > 0) {
    clauses.push(`EXISTS (
      SELECT 1
      FROM program_keywords pkf
      JOIN keywords kf ON kf.id = pkf.keyword_id
      WHERE pkf.program_id = p.id AND kf.slug IN (${placeholders(filters.keywords.length)})
    )`);
    params.push(...filters.keywords);
  }

  return { sql: `WHERE ${clauses.join(' AND ')}`, params };
}

/**
 * Resolve the ORDER BY fragment for a sort key.
 *
 * @param {string} sort Validated sort key.
 * @param {string} search Active search term (empty when none).
 * @returns {{ sql: string, params: unknown[] }} Order fragment and its params.
 */
function buildOrder(sort, search) {
  if (sort === 'relevance') {
    if (search) {
      return {
        sql: 'CASE WHEN p.title = ? THEN 0 WHEN p.title LIKE ? THEN 1 ELSE 2 END ASC, p.title ASC',
        params: [search, `${search}%`]
      };
    }
    return { sql: 'p.title ASC', params: [] };
  }
  return { sql: STATIC_SORTS[sort], params: [] };
}

/**
 * Fetch keyword names for many programmes in a single round trip.
 *
 * @param {number[]} programIds Programme ids on the current page.
 * @returns {Promise<Map<number, string[]>>} Programme id -> keyword names.
 */
async function fetchKeywordNames(programIds) {
  const map = new Map();
  if (programIds.length === 0) {
    return map;
  }
  const rows = await query(
    `SELECT pk.program_id AS programId, k.name
     FROM program_keywords pk
     JOIN keywords k ON k.id = pk.keyword_id
     WHERE pk.program_id IN (${placeholders(programIds.length)})
     ORDER BY k.name ASC`,
    programIds
  );
  for (const row of rows) {
    if (!map.has(row.programId)) {
      map.set(row.programId, []);
    }
    map.get(row.programId).push(row.name);
  }
  return map;
}

async function fetchDegreeTypesFacet(filters) {
  const where = buildWhere(filters, 'degree');
  return query(
    `SELECT dt.code AS value, dt.code, dt.label, dt.level, dt.badge_key AS badgeKey,
            COUNT(DISTINCT p.id) AS count
     ${BASE_FROM}
     ${where.sql}
     GROUP BY dt.id, dt.code, dt.label, dt.level, dt.badge_key, dt.sort_order
     ORDER BY dt.sort_order ASC, dt.code ASC`,
    where.params
  );
}

async function fetchLevelsFacet(filters) {
  const where = buildWhere(filters, 'level');
  return query(
    `SELECT dt.level AS value, COUNT(DISTINCT p.id) AS count
     ${BASE_FROM}
     ${where.sql}
     GROUP BY dt.level
     ORDER BY FIELD(dt.level, 'Undergraduate', 'MS/MPhil', 'Doctorate')`,
    where.params
  );
}

async function fetchFacultiesFacet(filters) {
  const where = buildWhere(filters, 'faculty');
  return query(
    `SELECT f.name, f.slug, f.short_name AS shortName, COUNT(DISTINCT p.id) AS count
     ${BASE_FROM}
     ${where.sql}
     GROUP BY f.id, f.name, f.slug, f.short_name, f.sort_order
     ORDER BY f.sort_order ASC, f.name ASC`,
    where.params
  );
}

async function fetchDepartmentsFacet(filters) {
  const where = buildWhere(filters, 'department');
  return query(
    `SELECT d.name, d.slug, f.slug AS facultySlug, COUNT(DISTINCT p.id) AS count
     ${BASE_FROM}
     ${where.sql}
     GROUP BY d.id, d.name, d.slug, f.slug
     ORDER BY d.name ASC`,
    where.params
  );
}

async function fetchCampusesFacet(filters) {
  const where = buildWhere(filters, 'campus');
  return query(
    `SELECT c.name, c.slug, COUNT(DISTINCT p.id) AS count
     ${BASE_FROM}
     ${where.sql}
     GROUP BY c.id, c.name, c.slug, c.sort_order
     ORDER BY c.sort_order ASC, c.name ASC`,
    where.params
  );
}

async function fetchKeywordsFacet(filters) {
  const where = buildWhere(filters, 'keyword');
  return query(
    `SELECT k.name, k.slug, COUNT(DISTINCT p.id) AS count
     ${KEYWORD_FROM}
     ${where.sql}
     GROUP BY k.id, k.name, k.slug
     ORDER BY k.name ASC`,
    where.params
  );
}

/**
 * Compute the six facet collections against the current filters, each scoped
 * to omit its own dimension so a selected value does not collapse its facet.
 *
 * @param {object} filters Normalised filters.
 * @returns {Promise<object>} Facet payload.
 */
async function buildFacets(filters) {
  const [degreeTypes, levels, faculties, departments, campuses, keywords] = await Promise.all([
    fetchDegreeTypesFacet(filters),
    fetchLevelsFacet(filters),
    fetchFacultiesFacet(filters),
    fetchDepartmentsFacet(filters),
    fetchCampusesFacet(filters),
    fetchKeywordsFacet(filters)
  ]);
  return { degreeTypes, levels, faculties, departments, campuses, keywords };
}

/**
 * Directory listing with pagination, sorting and faceted navigation.
 *
 * @param {Record<string, unknown>} queryString Express query object.
 * @returns {Promise<{ data: object[], meta: object, facets: object }>} Listing payload.
 */
async function listPrograms(queryString) {
  const filters = normaliseFilters(queryString);
  const page = parsePage(queryString.page);
  const limit = parseLimit(queryString.limit);
  const sort = parseSort(queryString.sort);
  const offset = (page - 1) * limit;

  const where = buildWhere(filters);
  const order = buildOrder(sort, filters.search);

  const [rows, countRows, facets] = await Promise.all([
    query(
      `SELECT ${SUMMARY_COLUMNS} ${BASE_FROM} ${where.sql} ORDER BY ${order.sql} LIMIT ? OFFSET ?`,
      [...where.params, ...order.params, limit, offset]
    ),
    query(`SELECT COUNT(*) AS total ${BASE_FROM} ${where.sql}`, where.params),
    buildFacets(filters)
  ]);

  const keywordMap = await fetchKeywordNames(rows.map((row) => row.id));
  const data = rows.map((row) => mapSummary(row, keywordMap.get(row.id) || []));

  return {
    data,
    meta: buildMeta({ page, limit, total: countRows[0].total }),
    facets
  };
}

/**
 * Fetch a single programme (with keywords and related programmes) by slug.
 *
 * @param {string} slug Programme slug.
 * @returns {Promise<object>} Programme detail.
 * @throws {Error} 404 when no active programme matches.
 */
async function getProgramBySlug(slug) {
  const rows = await query(
    `SELECT ${DETAIL_COLUMNS} ${BASE_FROM} WHERE p.slug = ? AND p.is_active = 1 LIMIT 1`,
    [slug]
  );
  if (rows.length === 0) {
    throw httpError(404, 'Programme not found');
  }
  const row = rows[0];

  const [keywords, relatedRows] = await Promise.all([
    query(
      `SELECT k.name, k.slug
       FROM program_keywords pk
       JOIN keywords k ON k.id = pk.keyword_id
       WHERE pk.program_id = ?
       ORDER BY k.name ASC`,
      [row.id]
    ),
    query(
      `SELECT ${SUMMARY_COLUMNS} ${BASE_FROM}
       WHERE p.is_active = 1 AND p.id <> ?
         AND (p.department_id = ? OR p.degree_type_id = ?)
       ORDER BY (p.department_id = ?) DESC, p.title ASC
       LIMIT 3`,
      [row.id, row.departmentId, row.degreeTypeId, row.departmentId]
    )
  ]);

  const relatedKeywordMap = await fetchKeywordNames(relatedRows.map((item) => item.id));
  const related = relatedRows.map((item) => mapSummary(item, relatedKeywordMap.get(item.id) || []));

  return mapDetail(row, { keywords, related });
}

/**
 * Static-ish filter options with counts, used to render the sidebar before any
 * search has been performed.
 *
 * @returns {Promise<object>} Filter option payload.
 */
async function getFilterOptions() {
  const [degreeTypes, levels, faculties, departments, campuses, keywords] = await Promise.all([
    query(
      `SELECT dt.code AS value, dt.code, dt.label, dt.level, dt.badge_key AS badgeKey,
              dt.sort_order AS sortOrder, COUNT(p.id) AS count
       FROM degree_types dt
       LEFT JOIN programs p ON p.degree_type_id = dt.id AND p.is_active = 1
       GROUP BY dt.id, dt.code, dt.label, dt.level, dt.badge_key, dt.sort_order
       ORDER BY dt.sort_order ASC, dt.code ASC`
    ),
    query(
      `SELECT dt.level AS value, COUNT(p.id) AS count
       FROM degree_types dt
       LEFT JOIN programs p ON p.degree_type_id = dt.id AND p.is_active = 1
       GROUP BY dt.level
       ORDER BY FIELD(dt.level, 'Undergraduate', 'MS/MPhil', 'Doctorate')`
    ),
    query(
      `SELECT f.name, f.slug, f.short_name AS shortName, COUNT(p.id) AS count
       FROM faculties f
       LEFT JOIN departments d ON d.faculty_id = f.id
       LEFT JOIN programs p ON p.department_id = d.id AND p.is_active = 1
       GROUP BY f.id, f.name, f.slug, f.short_name, f.sort_order
       ORDER BY f.sort_order ASC, f.name ASC`
    ),
    query(
      `SELECT d.name, d.slug, f.slug AS facultySlug, COUNT(p.id) AS count
       FROM departments d
       JOIN faculties f ON f.id = d.faculty_id
       LEFT JOIN programs p ON p.department_id = d.id AND p.is_active = 1
       GROUP BY d.id, d.name, d.slug, f.slug, f.sort_order
       ORDER BY d.name ASC`
    ),
    query(
      `SELECT c.name, c.slug, COUNT(p.id) AS count
       FROM campuses c
       LEFT JOIN programs p ON p.campus_id = c.id AND p.is_active = 1
       GROUP BY c.id, c.name, c.slug, c.sort_order
       ORDER BY c.sort_order ASC, c.name ASC`
    ),
    query(
      `SELECT k.name, k.slug, COUNT(p.id) AS count
       FROM keywords k
       LEFT JOIN program_keywords pk ON pk.keyword_id = k.id
       LEFT JOIN programs p ON p.id = pk.program_id AND p.is_active = 1
       GROUP BY k.id, k.name, k.slug
       ORDER BY k.name ASC`
    )
  ]);

  return { degreeTypes, levels, faculties, departments, campuses, keywords };
}

/**
 * The homepage figures: the six published counters plus live directory totals.
 *
 * @returns {Promise<object>} Stats payload.
 */
async function getStats() {
  const [counterRows, totalsRows, levelRows] = await Promise.all([
    query(
      `SELECT stat_key AS statKey, label, stat_value AS value
       FROM stats
       ORDER BY sort_order ASC, id ASC`
    ),
    query(
      `SELECT
         (SELECT COUNT(*) FROM programs WHERE is_active = 1) AS programs,
         (SELECT COUNT(*) FROM faculties)  AS faculties,
         (SELECT COUNT(*) FROM departments) AS departments,
         (SELECT COUNT(*) FROM campuses)   AS campuses,
         (SELECT COUNT(*) FROM degree_types) AS degreeTypes,
         (SELECT COUNT(*) FROM keywords)   AS keywords`
    ),
    query(
      `SELECT dt.level AS level, COUNT(p.id) AS count
       FROM degree_types dt
       LEFT JOIN programs p ON p.degree_type_id = dt.id AND p.is_active = 1
       GROUP BY dt.level
       ORDER BY FIELD(dt.level, 'Undergraduate', 'MS/MPhil', 'Doctorate')`
    )
  ]);

  const totals = totalsRows[0];

  return {
    counters: counterRows.map((row) => ({
      key: row.statKey,
      label: row.label,
      value: Number(row.value)
    })),
    totals: {
      programs: Number(totals.programs),
      faculties: Number(totals.faculties),
      departments: Number(totals.departments),
      campuses: Number(totals.campuses),
      degreeTypes: Number(totals.degreeTypes),
      keywords: Number(totals.keywords)
    },
    programsByLevel: levelRows.map((row) => ({
      level: row.level,
      count: Number(row.count)
    }))
  };
}

module.exports = {
  listPrograms,
  getProgramBySlug,
  getFilterOptions,
  getStats,
  SORT_KEYS
};
