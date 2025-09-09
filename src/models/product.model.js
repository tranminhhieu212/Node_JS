"use strict";

const { model, Schema, Types } = require("mongoose");
const DOCUMENT_NAME = "Product";
const COLLECTION_NAME = "Products";

const productSchema = new Schema(
  {
    product_name: { type: String, required: true },
    product_thumd: { type: String, required: true },
    product_description: { type: String, required: true },
    product_price: { type: Number, required: true },
    product_quantity: { type: Number, required: true },
    product_type: {
      type: String,
      required: true,
      enum: ["electronic", "furniture", "clothing"],
    },
    product_shop: {type: Schema.Types.ObjectId, ref: "Shops"},
    product_attributes: { type: Schema.Types.Mixed, required: true },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

const clothingSchema = new Schema(
  {
    brand: { type: String, required: true },
    size: String,
    material: String,
    product_shop: {type: Schema.Types.ObjectId, ref: "Shops"},
  },
  {
    collection: "Clothes",
    timestamps: true,
  }
);

const electronicSchema = new Schema(
  {
    manufacturer: { type: String, required: true },
    model: String,
    color: String,
    product_shop: {type: Schema.Types.ObjectId, ref: "Shops"},
  },
  {
    collection: "Electronics",
    timestamps: true,
  }
);

const furnitureSchema = new Schema(
  {
    brand: { type: String, required: true },
    size: String,
    material: String,
    product_shop: {type: Schema.Types.ObjectId, ref: "Shops"},
  },
  {
    collection: "Furnitures",
    timestamps: true,
  }
)

module.exports = {
  productModel: model(DOCUMENT_NAME, productSchema),
  clothingModel: model("Clothe", clothingSchema),
  electronicModel: model("Electronic", electronicSchema),
  furnitureModel: model("Furniture", furnitureSchema),
};
