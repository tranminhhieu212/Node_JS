"use strict";

const mongoose = require("mongoose");
const DOCUMENT_NAME = "Discount"; // name used in code
const COLLECTION_NAME = "Discounts"; // name used in database

var discountShema = new mongoose.Schema(
  {
    discount_name: {
      type: String,
      require: true,
    },
    discount_description: {
      type: String,
      require: true,
    },
    discount_type: {
      type: String,
      default: "fixed",
      enum: ["fixed", "percentage"],
    },
    discount_value: {
      type: Number,
      require: true,
    },
    discount_code: {
      type: String,
      require: true,
    },
    discount_startDate: {
      type: Date,
      require: true,
    },
    discount_endDate: {
      type: Date,
      require: true,
    },
    discount_max_uses: {
      type: Number,
      require: true,
    },
    discount_uses_count: {
      type: Number,
      require: true,
    },
    discount_users_used: {
      type: Array,
      default: [],
    },
    discount_max_uses_per_user: {
      type: Number,
      require: true,
    },
    discount_min_order_value: {
      type: Number,
      require: true,
    },
    discount_shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shops",
    },
    discount_is_active: {
      type: Boolean,
      default: true,
    },
    discount_applies_to: {
      type: String,
      default: "all",
      enum: ["all", "specific"],
    }, 
    discount_products: {
      type: Array,
      default: [],
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, discountShema);
