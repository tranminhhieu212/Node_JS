'use strict';

const { NotFoundError } = require('../core/errror.response');
const Comment = require('../models/comment.model');
const { convertToObjectId } = require('../utils');

class CommentService {
    static async createComment({
        productId, userId, content, parentCommentId = null
    }) {
        const comment = new Comment({
            comment_userId: userId,
            comment_productId: productId,
            comment_content: content,
            comment_parentId: parentCommentId
        });

        let rightVal = 0;

        if (parentCommentId) {
            // Find parent comment
            const parentComment = await Comment.findById(parentCommentId);
            if (!parentComment) {
                throw new NotFoundError('Parent comment not found');
            }
            
            rightVal = parentComment.comment_right;
            console.log(parentComment, rightVal);

            // Update right values for affected comments
            await Comment.updateMany(
                {
                    comment_productId: convertToObjectId(productId),
                    comment_right: { $gte: rightVal }
                },
                {
                    $inc: { comment_right: 2 }
                }
            );

            // Update left values for affected comments
            await Comment.updateMany(
                {
                    comment_productId: convertToObjectId(productId),
                    comment_left: { $gte: rightVal }
                },
                {
                    $inc: { comment_left: 2 }
                }
            );

            comment.comment_left = rightVal;
            comment.comment_right = rightVal + 1;
        } else {
            // Root comment - find max right value for this product
            const maxRightComment = await Comment.findOne(
                {
                    comment_productId: convertToObjectId(productId)
                },
                'comment_right',
                { sort: { comment_right: -1 } }
            ).lean();

            if (maxRightComment) {
                rightVal = maxRightComment.comment_right;
            } else {
                rightVal = 0;
            }
            // Set left and right values for new comment
            comment.comment_left = rightVal + 1;
            comment.comment_right = rightVal + 2;
        }

        

        return await comment.save();
    }

    static async getCommentsByParentId({
        productId,
        parentCommentId = null,
        limit = 50,
        offset = 0
    }) {
        if (parentCommentId) {
            const parent = await Comment.findById(parentCommentId);
            if (!parent) {
                throw new NotFoundError('Parent comment not found');
            }

            const comments = await Comment.find({
                comment_productId: convertToObjectId(productId),
                comment_left: { $gt: parent.comment_left },
                comment_right: { $lte: parent.comment_right }
            })
                .select({
                    comment_left: 1,
                    comment_right: 1,
                    comment_content: 1,
                    comment_parentId: 1
                })
                .sort({ comment_left: 1 })
                .limit(limit)
                .skip(offset)
                .lean();

            return comments;
        }

        const comments = await Comment.find({
            comment_productId: convertToObjectId(productId),
            comment_parentId: parentCommentId
        })
            .select({
                comment_left: 1,
                comment_right: 1,
                comment_content: 1,
                comment_parentId: 1
            })
            .sort({ comment_left: 1 })
            .limit(limit)
            .skip(offset)
            .lean();

        return comments;
    }

    static async deleteComment({ commentId, productId }) {
        const foundComment = await Comment.findById(commentId);
        if (!foundComment) {
            throw new NotFoundError('Comment not found');
        }

        const leftVal = foundComment.comment_left;
        const rightVal = foundComment.comment_right;
        const width = rightVal - leftVal + 1;

        // Delete comment and all children
        await Comment.deleteMany({
            comment_productId: convertToObjectId(productId),
            comment_left: { $gte: leftVal },
            comment_right: { $lte: rightVal }
        });

        // Update left values
        await Comment.updateMany(
            {
                comment_productId: convertToObjectId(productId),
                comment_left: { $gt: rightVal }
            },
            {
                $inc: { comment_left: -width }
            }
        );

        // Update right values
        await Comment.updateMany(
            {
                comment_productId: convertToObjectId(productId),
                comment_right: { $gt: rightVal }
            },
            {
                $inc: { comment_right: -width }
            }
        );

        return true;
    }
}

module.exports = CommentService;