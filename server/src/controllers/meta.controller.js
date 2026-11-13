'use strict';

const asyncHandler = require('../middleware/asyncHandler');
const { query } = require('../config/db');
const programsService = require('../services/programs.service');

/**
 * GET /api/health
 * Always answers 200; the `database` field reports connectivity.
 */
const health = asyncHandler(async (req, res) => {
  let database = 'connected';
  try {
    await query('SELECT 1');
  } catch (err) {
    database = 'disconnected';
  }
  res.status(200).json({
    status: 'ok',
    database,
    timestamp: new Date().toISOString()
  });
});

/**
 * GET /api/stats
 */
const stats = asyncHandler(async (req, res) => {
  const data = await programsService.getStats();
  res.status(200).json({ data });
});

module.exports = { health, stats };
