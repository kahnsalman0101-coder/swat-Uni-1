'use strict';

const path = require('path');
const dotenv = require('dotenv');

// Load `.env` from the server root regardless of the current working directory.
dotenv.config({ path: path.resolve(__dirname, '..', '..', '.env') });

const DEFAULTS = {
  PORT: '5000',
  NODE_ENV: 'development',
  CLIENT_ORIGIN: 'http://localhost:5173',
  DB_HOST: '127.0.0.1',
  DB_PORT: '3306',
  DB_USER: 'root',
  DB_PASSWORD: '',
  DB_NAME: 'uswat',
  DB_CONNECTION_LIMIT: '10'
};

const missing = Object.keys(DEFAULTS).filter((key) => process.env[key] === undefined);
if (missing.length > 0) {
  console.warn(`[env] Missing environment variables, using defaults: ${missing.join(', ')}`);
}

function read(key) {
  const value = process.env[key];
  return value === undefined || value === '' ? DEFAULTS[key] : value;
}

function toInt(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) ? parsed : fallback;
}

const nodeEnv = read('NODE_ENV');

const config = Object.freeze({
  nodeEnv,
  isProduction: nodeEnv === 'production',
  port: toInt(read('PORT'), 5000),
  clientOrigin: read('CLIENT_ORIGIN'),
  db: Object.freeze({
    host: read('DB_HOST'),
    port: toInt(read('DB_PORT'), 3306),
    user: read('DB_USER'),
    password: read('DB_PASSWORD'),
    name: read('DB_NAME'),
    connectionLimit: toInt(read('DB_CONNECTION_LIMIT'), 10)
  })
});

module.exports = config;
