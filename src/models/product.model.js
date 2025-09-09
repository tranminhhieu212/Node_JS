"use strict";

const { model, Schema, Types } = require("mongoose");
const DOCUMENT_NAME = "Product";
const COLLECTION_NAME = "Products";
const slugify = require("slugify")

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
    product_shop: {type: Schema.Types.ObjectId, ref: "Shop"},
    product_attributes: { type: Schema.Types.Mixed, required: true },

    // more 
    product_slug: String,
    product_variants: { type: Array, default: [], required: true },
    product_ratingAverage: {
      type: Number, 
      default: 4.5, 
      min: [1, 'Rating must be at least 1'], 
      max: [5, 'Rating must be at most 5'], 
      set: val => Math.round(val * 10) / 10
    }, 
    isDraft: {
      type: Boolean,
      default: true,
      index: true,
      select: false
    },
    isPublished: {
      type: Boolean,
      default: false,
      index: true,
      select: false
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: true,
  }
);

// Document middleware
productSchema.pre("save", function (next) {
  this.product_slug = slugify(this.product_name, { lower: true })
  next()
})

// create index for search product
productSchema.index({ product_name: 'text', product_description: 'text' });

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
