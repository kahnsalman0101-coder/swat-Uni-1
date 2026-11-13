'use strict';

const asyncHandler = require('../middleware/asyncHandler');
const siteService = require('../services/site.service');

/**
 * GET /api/pages
 */
const pages = asyncHandler(async (req, res) => {
  const data = await siteService.listPages();
  res.status(200).json({ data });
});

/**
 * GET /api/pages/:slug
 */
const page = asyncHandler(async (req, res) => {
  const data = await siteService.getPageBySlug(req.params.slug);
  res.status(200).json({ data });
});

/**
 * GET /api/campuses
 */
const campuses = asyncHandler(async (req, res) => {
  const data = await siteService.listCampuses();
  res.status(200).json({ data });
});

/**
 * GET /api/faculties
 */
const faculties = asyncHandler(async (req, res) => {
  const data = await siteService.listFaculties();
  res.status(200).json({ data });
});

module.exports = { pages, page, campuses, faculties };
