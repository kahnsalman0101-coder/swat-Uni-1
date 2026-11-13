'use strict';

/**
 * Create an Error carrying an HTTP status code so the error handler can
 * serialise it directly.
 *
 * @param {number} status HTTP status code.
 * @param {string} message Human readable message.
 * @returns {Error & { status: number }} The decorated error.
 */
function httpError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

module.exports = httpError;
