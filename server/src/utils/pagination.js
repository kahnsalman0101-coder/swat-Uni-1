'use strict';

const httpError = require('./httpError');

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 9;
const MAX_LIMIT = 48;

/**
 * Parse and validate the `page` query parameter.
 *
 * @param {unknown} raw Raw query value.
 * @returns {number} A page number >= 1.
 */
function parsePage(raw) {
  if (raw === undefined || raw === '') {
    return DEFAULT_PAGE;
  }
  const value = Number(raw);
  if (!Number.isInteger(value) || value < 1) {
    throw httpError(400, '`page` must be an integer greater than or equal to 1');
  }
  return value;
}

/**
 * Parse and validate the `limit` query parameter.
 *
 * @param {unknown} raw Raw query value.
 * @returns {number} A limit between 1 and MAX_LIMIT.
 */
function parseLimit(raw) {
  if (raw === undefined || raw === '') {
    return DEFAULT_LIMIT;
  }
  const value = Number(raw);
  if (!Number.isInteger(value) || value < 1 || value > MAX_LIMIT) {
    throw httpError(400, `\`limit\` must be an integer between 1 and ${MAX_LIMIT}`);
  }
  return value;
}

/**
 * Build the pagination metadata block for a listing response.
 *
 * @param {{ page: number, limit: number, total: number }} input Pagination inputs.
 * @returns {{ page: number, limit: number, total: number, totalPages: number, hasNext: boolean, hasPrev: boolean }}
 */
function buildMeta({ page, limit, total }) {
  const totalPages = Math.ceil(total / limit);
  return {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1
  };
}

module.exports = {
  DEFAULT_PAGE,
  DEFAULT_LIMIT,
  MAX_LIMIT,
  parsePage,
  parseLimit,
  buildMeta
};
