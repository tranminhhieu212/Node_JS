'use strict';

const express = require('express');
const router = express.Router();
const productController = require('../../controllers/product.controller');
const asyncHandler = require('../../utils/asyncHandler');
const { authorizationV2 } = require('../../auth/authUtils');

router.use(authorizationV2);
router.post('', asyncHandler(productController.createProduct));

module.exports = router;
