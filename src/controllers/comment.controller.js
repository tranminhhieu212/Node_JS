"use strict";

const commentService = require("../services/comment.service");
const { SuccessResponse } = require("../core/success.response");

class CommentController {
  createComment = async (req, res, next) => {
    return new SuccessResponse({
      message: "Create comment successfully",
      metadata: await commentService.createComment(req.body),
    }).send(res);
  };

  getCommentsByParentId = async (req, res, next) => {
    return new SuccessResponse({
      message: "Get comments by parent id successfully",
      metadata: await commentService.getCommentsByParentId({
          ...req.body,
          parentCommentId: req.params.commentId,
      }),
    }).send(res);
  };

  deleteComment = async (req, res, next) => {
    return new SuccessResponse({
      message: "Delete comment successfully",
      metadata: await commentService.deleteComment(req.body),
    }).send(res);
  };
}

module.exports = new CommentController();
