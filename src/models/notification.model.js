// models/comment.model.js
"use strict";

const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = "Notification";
const COLLECTION_NAME = "Notifications";

// ORDER 001: order sucecss
// ORDER 002: order failed
// PROMOTION 001:  new promotion
// SHOP 001: new product
// USER 001: new user

const notificationShema = new Schema(
  {
    noti_type: {
      required: true,
      type: String,
      enum: ["ORDER-001", "ORDER-002", "PROMOTION-001", "SHOP-001", "USER-001"],
    },
    noti_senderId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Shop",
    },
    noti_receiverId: {
      type: Number,
      required: true,
    },
    noti_content: {
      type: String,
      required: true,
    },
    noti_options: {
      type: Object,
      default: {}
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

// ✅ CRITICAL: Export model directly as constructor
module.exports = model(DOCUMENT_NAME, notificationShema);
