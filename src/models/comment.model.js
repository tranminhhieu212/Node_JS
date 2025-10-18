// models/comment.model.js
'use strict';

const { Schema, model } = require('mongoose');

const DOCUMENT_NAME = 'Comment';
const COLLECTION_NAME = 'Comments';

const commentSchema = new Schema(
    {
        comment_productId: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        comment_userId: {
            type: Number,
            ref: 'User',
            required: true
        },
        comment_content: {
            type: String,
            required: true
        },
        comment_left: {
            type: Number,
            default: 0
        },
        comment_right: {
            type: Number,
            default: 0
        },
        comment_parentId: {
            type: Schema.Types.ObjectId,
            ref: DOCUMENT_NAME,
            default: null
        },
        isDeleted: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME
    }
);

// Indexes for performance
commentSchema.index({ comment_productId: 1, comment_left: 1 });
commentSchema.index({ comment_productId: 1, comment_right: 1 });

// ✅ CRITICAL: Export model directly as constructor
module.exports = model(DOCUMENT_NAME, commentSchema);