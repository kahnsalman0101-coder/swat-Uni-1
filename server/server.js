'use strict';

const config = require('./src/config/env');
const app = require('./src/app');
const { testConnection } = require('./src/config/db');

async function start() {
  try {
    await testConnection();
    console.log(`[db] Connected to ${config.db.host}:${config.db.port}/${config.db.name}`);
  } catch (err) {
    console.error(`[db] Connection failed: ${err.message}`);
    console.error('[db] The API will start, but database-backed endpoints will fail until the database is reachable.');
  }

  app.listen(config.port, () => {
    console.log(`[api] Graduate Programs API listening on http://localhost:${config.port} (${config.nodeEnv})`);
  });
}

start();
