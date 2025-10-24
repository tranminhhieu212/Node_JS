'use strict';

const express = require('express');
const { apiKey, checkPermissions } = require('../auth/checkAuth');
const router = express.Router();

// eheck api key
// router.use(apiKey);
// check permissions
// router.use(checkPermissions('0000'));
// routes
router.use('/v1/api/upload', require('./upload'));
router.use('/v1/api/notification', require('./notification'));
router.use('/v1/api/comment', require('./comment'));
router.use('/v1/api/checkout', require('./checkout'));
router.use('/v1/api/cart', require('./cart'));
router.use('/v1/api/discount', require('./discount'));
router.use('/v1/api/inventory', require('./inventory'));
router.use('/v1/api/products', require('./product'));
router.use('/v1/api', require('./access'));

module.exports = router;