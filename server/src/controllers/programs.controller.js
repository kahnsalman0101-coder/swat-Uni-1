'use strict';

const asyncHandler = require('../middleware/asyncHandler');
const programsService = require('../services/programs.service');

/**
 * GET /api/programs
 */
const list = asyncHandler(async (req, res) => {
  const result = await programsService.listPrograms(req.query);
  res.status(200).json(result);
});

/**
 * GET /api/programs/filters
 */
const filters = asyncHandler(async (req, res) => {
  const data = await programsService.getFilterOptions();
  res.status(200).json({ data });
});

/**
 * GET /api/programs/:slug
 */
const detail = asyncHandler(async (req, res) => {
  const data = await programsService.getProgramBySlug(req.params.slug);
  res.status(200).json({ data });
});

module.exports = { list, filters, detail };
