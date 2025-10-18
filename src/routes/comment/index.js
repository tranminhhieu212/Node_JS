'use strict';

const express = require('express');
const router = express.Router();
const commentController = require('../../controllers/comment.controller');
const asyncHandler = require('../../utils/asyncHandler');
const { authorizationV2 } = require('../../auth/authUtils');
 
router.use(authorizationV2)

router.post('/:commentId', asyncHandler(commentController.getCommentsByParentId)); 
router.delete('', asyncHandler(commentController.deleteComment)); 
router.post('', asyncHandler(commentController.createComment)); 

module.exports = router;
