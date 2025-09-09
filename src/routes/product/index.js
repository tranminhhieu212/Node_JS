'use strict';

const express = require('express');
const router = express.Router();
const productController = require('../../controllers/product.controller');
const asyncHandler = require('../../utils/asyncHandler');
const { authorizationV2 } = require('../../auth/authUtils');

// SEARCH
/**     
 * @description Get all drafts for shop
 * @route POST /v1/api/product/drafts/all
 * @param {Number} limit
 * @param {Number} skip
 * @return {JSON}
 */
router.get('/search/:keySearch', asyncHandler(productController.searchProductForUser));

router.use(authorizationV2);
//CREATE
/**
 * @description Create product
 * @route POST /v1/api/product
 * @param {String} product_type
 * @body {Object} 
 * @return {JSON}
 */
router.post('', asyncHandler(productController.createProduct));
// QUERY
/**     
 * @description Get all drafts for shop
 * @route POST /v1/api/product/drafts/all
 * @param {Number} limit
 * @param {Number} skip
 * @return {JSON}
 */
router.get('/drafts/all', asyncHandler(productController.findAllDraftsForShop));
router.get('/published/all', asyncHandler(productController.findAllPublishedsForShop));
// PUBLISH
/**     
 * @description Get all drafts for shop
 * @route POST /v1/api/product/drafts/all
 * @param {Number} limit
 * @param {Number} skip
 * @return {JSON}
 */
router.post('/drafts/:product_id/publish', asyncHandler(productController.publishProduct));
router.post('/drafts/:product_id/unPublish', asyncHandler(productController.unPublishProduct));

module.exports = router;
