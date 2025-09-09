'use strict';

const express = require('express');
const router = express.Router();
const accessController = require('../../controllers/access.controller');
const asyncHandler = require('../../utils/asyncHandler');
const { authorizationV2 } = require('../../auth/authUtils');

router.post('/shop/signup', asyncHandler(accessController.signUp));
router.post('/shop/login', asyncHandler(accessController.login));

router.use(authorizationV2);
router.post('/shop/logout', asyncHandler(accessController.logout));
router.post('/shop/refreshtoken', asyncHandler(accessController.refreshToken));


module.exports = router;
