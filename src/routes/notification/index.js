'use strict';

const express = require('express');
const router = express.Router();
const asyncHandler = require('../../utils/asyncHandler');
const { authorizationV2 } = require('../../auth/authUtils');
const notificationController = require('../../controllers/notification.controller');
 
router.use(authorizationV2)

router.get('', asyncHandler(notificationController.listNotiByUser)); 
 

module.exports = router;
