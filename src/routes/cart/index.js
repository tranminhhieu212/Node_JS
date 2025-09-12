'use strict';

const express = require('express');
const router = express.Router();
const cartController = require('../../controllers/cart.controller');
const asyncHandler = require('../../utils/asyncHandler');
const { authorizationV2 } = require('../../auth/authUtils');

router.use(authorizationV2)

router.post('', asyncHandler(cartController.addToCart));
router.post('/update', asyncHandler(cartController.updateExistedProductQuantity));
router.get('', asyncHandler(cartController.getUserCart));
router.delete('', asyncHandler(cartController.deleteCartItem));
 
module.exports = router;
