'use strict';

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const config = require('./config/env');
const routes = require('./routes');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(morgan('dev'));
app.use(cors({ origin: config.clientOrigin, credentials: true }));
app.use(express.json());

app.use('/api', routes);

// Terminal middleware: keep these last.
app.use(notFound);
app.use(errorHandler);

module.exports = app;
