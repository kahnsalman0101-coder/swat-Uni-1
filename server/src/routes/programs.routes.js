'use strict';

const express = require('express');
const programsController = require('../controllers/programs.controller');

const router = express.Router();

router.get('/', programsController.list);
router.get('/filters', programsController.filters);
router.get('/:slug', programsController.detail);

module.exports = router;
