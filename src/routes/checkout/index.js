'use strict';

const express = require('express');
const router = express.Router();
const checkoutController = require('../../controllers/checkout.controller');
const asyncHandler = require('../../utils/asyncHandler');
const { authorizationV2 } = require('../../auth/authUtils');
 
router.use(authorizationV2)

router.post('/review', asyncHandler(checkoutController.checkoutReview)); 

module.exports = router;
