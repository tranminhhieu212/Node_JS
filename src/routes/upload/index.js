'use strict';

const express = require('express');
const router = express.Router();
const asyncHandler = require('../../utils/asyncHandler');
const { authorizationV2 } = require('../../auth/authUtils');
const uploadController = require('../../controllers/upload.controller');
const { uploadDisk  , uploadMemory} = require('../../configs/multer.config');
 
// router.use(authorizationV2)
router.post('', asyncHandler(uploadController.uploadImageFromUrl)); 
router.post('/thumd', uploadDisk.single('file'), asyncHandler(uploadController.uploadImageFromLocal)); 
router.post('/multiple', uploadDisk.array('files', 5), asyncHandler(uploadController.uploadMultipleImageFromLocal)); 
router.post('/bucket', uploadMemory.single('file') , asyncHandler(uploadController.uploadMultipleImageFromLocalWithS3)); 

module.exports = router;
