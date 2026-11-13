'use strict';

const express = require('express');
const siteController = require('../controllers/site.controller');

const pagesRouter = express.Router();
pagesRouter.get('/', siteController.pages);
pagesRouter.get('/:slug', siteController.page);

const campusesRouter = express.Router();
campusesRouter.get('/', siteController.campuses);

const facultiesRouter = express.Router();
facultiesRouter.get('/', siteController.faculties);

module.exports = { pagesRouter, campusesRouter, facultiesRouter };
