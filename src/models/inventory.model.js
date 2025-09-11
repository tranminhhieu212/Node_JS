"use strict";

const mongoose = require("mongoose");
const DOCUMENT_NAME = "Inventory"; // name used in code
const COLLECTION_NAME = "Inventories"; // name used in database

var apikeySchema = new mongoose.Schema(
  {
    inven_productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Products",
    },
    inven_shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shops",
    },
    inven_location: {
      type: String,
      required: true,
    },
    inven_stock: {
      type: Number,
      required: true,
    },
    inven_reservations: {
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
module.exports = mongoose.model(DOCUMENT_NAME, apikeySchema);
