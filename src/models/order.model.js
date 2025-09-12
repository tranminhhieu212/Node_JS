"use strict";

const mongoose = require("mongoose");
const DOCUMENT_NAME = "Order"; // name used in code
const COLLECTION_NAME = "Orders"; // name used in database

var orderSchema = new mongoose.Schema(
  {
    order_userId: {
      type: Number,
      required: true,
      ref: "Shop",
    },
    order_checkout: {
      type: Object,
      default: {},
    },
    order_shipping: {
      type: Object,
      default: {},
    },
    order_payment: {
      type: Object,
      default: {},
    },
    order_status: {
      type: String,
      required: true,
      enum: ["pending", "confirmed", "shipped", "cancelled", "delivered"],
      default: "pending",
    },
    order_products: {
      type: Array,
      required: true,
      default: [],
    },
    order_trackingNumber: {
      type: String,
      default: "#1234567890",
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, orderSchema);
