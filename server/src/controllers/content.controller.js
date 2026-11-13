'use strict';

const asyncHandler = require('../middleware/asyncHandler');
const contentService = require('../services/content.service');

/**
 * GET /api/content
 * Optional `category` (repeatable / comma separated), `q`, `page`, `limit`.
 */
const list = asyncHandler(async (req, res) => {
  const result = await contentService.listContent(req.query);
  res.status(200).json(result);
});

/**
 * GET /api/content/:slug
 */
const detail = asyncHandler(async (req, res) => {
  const data = await contentService.getContentBySlug(req.params.slug);
  res.status(200).json({ data });
});

module.exports = { list, detail };
