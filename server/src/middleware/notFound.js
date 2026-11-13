'use strict';

const httpError = require('../utils/httpError');

/**
 * Terminal middleware that turns any unmatched request into a 404 error.
 *
 * @type {import('express').RequestHandler}
 */
function notFound(req, res, next) {
  next(httpError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

module.exports = notFound;
