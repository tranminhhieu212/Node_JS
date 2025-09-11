"use strict";

const mongoose = require("mongoose");
const DOCUMENT_NAME = "ApiKey"; // name used in code
const COLLECTION_NAME = "ApiKeys"; // name used in database

var apikeySchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    permissions: {
      type: [String],
      required: true,
      enum: ["0000", "1111", "2222"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, apikeySchema);
