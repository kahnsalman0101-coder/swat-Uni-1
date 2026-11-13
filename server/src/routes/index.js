'use strict';

const express = require('express');
const metaRoutes = require('./meta.routes');
const programsRoutes = require('./programs.routes');
const contentRoutes = require('./content.routes');
const { pagesRouter, campusesRouter, facultiesRouter } = require('./site.routes');

const router = express.Router();

router.use(metaRoutes);
router.use('/programs', programsRoutes);
router.use('/content', contentRoutes);
router.use('/pages', pagesRouter);
router.use('/campuses', campusesRouter);
router.use('/faculties', facultiesRouter);

module.exports = router;
