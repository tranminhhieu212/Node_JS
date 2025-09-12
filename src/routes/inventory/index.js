'use strict';

const express = require('express');
const router = express.Router();
const inventoryController = require('../../controllers/inventory.controller');
const asyncHandler = require('../../utils/asyncHandler');
const { authorizationV2 } = require('../../auth/authUtils');

router.use(authorizationV2)
router.post('', asyncHandler(inventoryController.addStockToInventory));

module.exports = router;
