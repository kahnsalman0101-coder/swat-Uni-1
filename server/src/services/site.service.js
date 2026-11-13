'use strict';

const { query } = require('../config/db');
const httpError = require('../utils/httpError');

/**
 * Lightweight index of the long-form pages, used to build navigation and to
 * resolve the featured page on the homepage.
 *
 * @returns {Promise<object[]>} Page summaries.
 */
async function listPages() {
  return query(
    `SELECT slug, title, subtitle, source_url AS sourceUrl, updated_at AS updatedAt
     FROM pages
     ORDER BY id ASC`
  );
}

/**
 * Fetch one long-form page with its body.
 *
 * @param {string} slug Page slug.
 * @returns {Promise<object>} Page record.
 * @throws {Error} 404 when the page does not exist.
 */
async function getPageBySlug(slug) {
  const rows = await query(
    `SELECT slug, title, subtitle, body, source_url AS sourceUrl, updated_at AS updatedAt
     FROM pages WHERE slug = ? LIMIT 1`,
    [slug]
  );
  if (rows.length === 0) {
    throw httpError(404, 'Page not found');
  }
  return rows[0];
}

/**
 * Campuses with their department and programme counts.
 *
 * @returns {Promise<object[]>} Campus records.
 */
async function listCampuses() {
  return query(
    `SELECT c.id, c.name, c.slug, c.location, c.overview, c.url,
            COUNT(DISTINCT d.id) AS departmentCount,
            COUNT(DISTINCT p.id) AS programCount
     FROM campuses c
     LEFT JOIN departments d ON d.campus_id = c.id
     LEFT JOIN programs   p ON p.campus_id = c.id AND p.is_active = 1
     GROUP BY c.id, c.name, c.slug, c.location, c.overview, c.url, c.sort_order
     ORDER BY c.sort_order ASC, c.name ASC`
  );
}

/**
 * Faculties with their departments nested, plus programme counts. This single
 * payload drives the "Faculty" mega-menu and the faculties index.
 *
 * @returns {Promise<object[]>} Faculty records with a `departments` array.
 */
async function listFaculties() {
  const [facultyRows, departmentRows] = await Promise.all([
    query(
      `SELECT f.id, f.name, f.slug, f.short_name AS shortName, f.overview, f.url,
              COUNT(DISTINCT p.id) AS programCount
       FROM faculties f
       LEFT JOIN departments d ON d.faculty_id = f.id
       LEFT JOIN programs   p ON p.department_id = d.id AND p.is_active = 1
       GROUP BY f.id, f.name, f.slug, f.short_name, f.overview, f.url, f.sort_order
       ORDER BY f.sort_order ASC, f.name ASC`
    ),
    query(
      `SELECT d.id, d.name, d.slug, d.faculty_id AS facultyId, d.campus_id AS campusId,
              d.overview, d.url,
              c.name AS campus, c.slug AS campusSlug,
              COUNT(p.id) AS programCount
       FROM departments d
       JOIN campuses c ON c.id = d.campus_id
       LEFT JOIN programs p ON p.department_id = d.id AND p.is_active = 1
       GROUP BY d.id, d.name, d.slug, d.faculty_id, d.campus_id, d.overview, d.url,
                c.name, c.slug, d.sort_order
       ORDER BY d.sort_order ASC, d.name ASC`
    )
  ]);

  return facultyRows.map((faculty) => ({
    ...faculty,
    departments: departmentRows.filter((department) => department.facultyId === faculty.id)
  }));
}

module.exports = {
  listPages,
  getPageBySlug,
  listCampuses,
  listFaculties
};
