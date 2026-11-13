'use strict';

const mysql = require('mysql2/promise');
const config = require('./env');

const pool = mysql.createPool({
  host: config.db.host,
  port: config.db.port,
  user: config.db.user,
  password: config.db.password,
  database: config.db.name,
  charset: 'utf8mb4',
  waitForConnections: true,
  connectionLimit: config.db.connectionLimit,
  queueLimit: 0,
  dateStrings: true
});

/**
 * Run a parameterised statement and return the resulting rows.
 *
 * @param {string} sql SQL text with `?` placeholders.
 * @param {Array<unknown>} [params] Bound parameters.
 * @returns {Promise<Array<object>>} Result rows.
 */
async function query(sql, params = []) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}

/**
 * Verify that a connection can be acquired and a trivial statement runs.
 *
 * @returns {Promise<void>} Resolves on success, rejects on failure.
 */
async function testConnection() {
  const connection = await pool.getConnection();
  try {
    await connection.query('SELECT 1');
  } finally {
    connection.release();
  }
}

module.exports = { pool, query, testConnection };
