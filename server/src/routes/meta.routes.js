'use strict';

const express = require('express');
const metaController = require('../controllers/meta.controller');

const router = express.Router();

router.get('/health', metaController.health);
router.get('/stats', metaController.stats);

module.exports = router;
