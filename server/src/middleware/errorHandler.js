'use strict';

const config = require('../config/env');

/**
 * Centralised error middleware. Every failure is rendered using the uniform
 * `{ error: { status, message } }` envelope. Server-side stack traces are
 * logged in development and suppressed in production.
 *
 * @type {import('express').ErrorRequestHandler}
 */
function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  const status = Number.isInteger(err.status) ? err.status : 500;
  const isServerError = status >= 500;

  if (config.isProduction) {
    if (isServerError) {
      console.error(`[error] ${status} ${req.method} ${req.originalUrl} - ${err.message}`);
    }
  } else {
    console.error(err.stack || err);
  }

  const message = isServerError && config.isProduction
    ? 'Internal server error'
    : err.message || 'Internal server error';

  res.status(status).json({ error: { status, message } });
}

module.exports = errorHandler;
