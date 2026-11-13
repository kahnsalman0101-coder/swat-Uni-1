'use strict';

/**
 * Map a joined programme row into the summary shape used by list responses
 * and `related` collections.
 *
 * Every field mirrors a column the university publishes; nothing is derived
 * or embellished except the `keywords` join, which is intentionally split into
 * its own query so the listing stays a single round trip per collection.
 *
 * @param {object} row Database row produced by the summary projection.
 * @param {string[]} [keywords] Keyword names attached to the programme.
 * @returns {object} Programme summary.
 */
function mapSummary(row, keywords = []) {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    level: row.level,
    degreeType: row.degreeType,
    degreeTypeLabel: row.degreeTypeLabel,
    badgeKey: row.badgeKey,
    department: row.department,
    departmentSlug: row.departmentSlug,
    faculty: row.faculty,
    facultySlug: row.facultySlug,
    facultyShortName: row.facultyShortName,
    campus: row.campus,
    campusSlug: row.campusSlug,
    overview: row.overview,
    duration: row.duration,
    sourceUrl: row.sourceUrl,
    keywords
  };
}

/**
 * Map a joined programme row plus its relations into the detail shape.
 *
 * @param {object} row Database row produced by the detail projection.
 * @param {{ keywords?: object[], related?: object[] }} [relations] Child collections.
 * @returns {object} Programme detail.
 */
function mapDetail(row, relations = {}) {
  const { keywords = [], related = [] } = relations;

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    level: row.level,
    degreeType: row.degreeType,
    degreeTypeLabel: row.degreeTypeLabel,
    badgeKey: row.badgeKey,
    department: row.department,
    departmentSlug: row.departmentSlug,
    departmentUrl: row.departmentUrl,
    departmentOverview: row.departmentOverview,
    faculty: row.faculty,
    facultySlug: row.facultySlug,
    facultyUrl: row.facultyUrl,
    facultyOverview: row.facultyOverview,
    campus: row.campus,
    campusSlug: row.campusSlug,
    campusUrl: row.campusUrl,
    campusLocation: row.campusLocation,
    overview: row.overview,
    description: row.description,
    duration: row.duration,
    admissionNote: row.admissionNote,
    websiteUrl: row.websiteUrl,
    sourceUrl: row.sourceUrl,
    departmentId: row.departmentId,
    facultyId: row.facultyId,
    campusId: row.campusId,
    keywords,
    related
  };
}

module.exports = { mapSummary, mapDetail };
