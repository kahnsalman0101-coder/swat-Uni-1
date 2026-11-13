'use strict';

const express = require('express');
const contentController = require('../controllers/content.controller');

const router = express.Router();

router.get('/', contentController.list);
router.get('/:slug', contentController.detail);

module.exports = router;
