'use strict';

const express = require('express');
const { apiKey, checkPermissions } = require('../auth/checkAuth');
const router = express.Router();

// eheck api key
// router.use(apiKey);
// check permissions
// router.use(checkPermissions('0000'));
// routes
router.use('/v1/api', require('./access'));
router.use('/v1/api/product', require('./product'));

module.exports = router;