'use strict';

const express = require('express');
const router = express.Router();
const discountController = require('../../controllers/discount.controller');
const asyncHandler = require('../../utils/asyncHandler');
const { authorizationV2 } = require('../../auth/authUtils');
 

router.use(authorizationV2)

router.post('', asyncHandler(discountController.createDiscount));
router.get('', asyncHandler(discountController.getAllProductsInDiscount));
router.get('/shop/:shopId', asyncHandler(discountController.getAllDiscountForShop));
router.get('/shop/:shopId/:discountId', asyncHandler(discountController.getDisCountDetails));
router.post('/amount', asyncHandler(discountController.getDiscountAmount));
router.post('/cancel', asyncHandler(discountController.cancelDiscountCode));
router.delete('/:discountId', asyncHandler(discountController.deleteDiscountCode));

module.exports = router;
