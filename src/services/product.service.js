"use strict";

const { isDate } = require("lodash");
const { BadRequestErorr } = require("../core/errror.response");
const {
  productModel,
  clothingModel,
  electronicModel,
  furnitureModel,
} = require("../models/product.model");
const {
  findAllDraftsForShop,
  publishProduct,
  findAllPublishedsForShop,
  searchProductForUser,
} = require("../models/repositories/product.repo");

class ProductFactory {
  static productRegistry = {};

  static registerProductType(type, classRef) {
    ProductFactory.productRegistry[type] = classRef;
  }

  static async createProduct(type, payload) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass) throw new BadRequestErorr("Invalid product type");

    return await new productClass(payload).createProduct();
  }

  static async findAllDraftsForShop({ product_shop, limit = 60, skip = 0 }) {
    const query = { product_shop, isDraft: true };
    return await findAllDraftsForShop({ query, limit, skip });
  }

  static async findAllPublishedsForShop({ product_shop, limit = 60, skip = 0 }) {
    const query = { product_shop, isDraft: false };
    return await findAllPublishedsForShop({ query, limit, skip });
  }

  static async publishProduct({ product_shop, product_id }) {
    console.log(product_shop, product_id);
    return await publishProduct({ product_shop, product_id });
  }

  static async unPublishProduct({ product_shop, product_id }) {
    return await publishProduct({ product_shop, product_id, isPublishAction: false });
  }
  
  static async searchProductForUser({ keySearch }) {
    return await searchProductForUser({ keySearch });
  }
}

class Product {
  constructor({
    product_name,
    product_thumd,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_shop,
    product_attributes,
    product_variants,
  }) {
    this.product_name = product_name;
    this.product_thumd = product_thumd;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
    this.product_variants = product_variants;
  }

  async createProduct(id) {
    return await productModel.create({ ...this, _id: id });
  }
}

class ClotheProduct extends Product {
  async createProduct() {
    const newItem = await clothingModel.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newItem)
      throw new BadRequestErorr("Create clothing error - ErrorHandler");

    const newProduct = await super.createProduct(newItem._id);
    if (!newProduct)
      throw new BadRequestErorr("Create product error - ErrorHandler");
    return newProduct;
  }
}

class ElectronicProduct extends Product {
  async createProduct() {
    const newItem = await electronicModel.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newItem)
      throw new BadRequestErorr("Create electronic error - ErrorHandler");

    const newProduct = await super.createProduct(newItem._id);
    if (!newProduct)
      throw new BadRequestErorr("Create product error - ErrorHandler");
    return newProduct;
  }
}

class FurnitureProduct extends Product {
  async createProduct() {
    const newItem = await furnitureModel.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newItem)
      throw new BadRequestErorr("Create furniture error - ErrorHandler");

    const newProduct = await super.createProduct(newItem._id);
    if (!newProduct)
      throw new BadRequestErorr("Create furniture error - ErrorHandler");
    return newProduct;
  }
}

ProductFactory.registerProductType("clothing", ClotheProduct);
ProductFactory.registerProductType("electronic", ElectronicProduct);
ProductFactory.registerProductType("furniture", FurnitureProduct);

// module.exports = ProductFactory;
module.exports = ProductFactory;
