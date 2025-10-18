"use strict";

const { BadRequestErorr } = require("../core/errror.response");
const {
  productModel,
  clothingModel,
  electronicModel,
  furnitureModel,
} = require("../models/product.model");
const { insertInventory } = require("../models/repositories/inventory.repo");
const {
  findAllDraftsForShop,
  publishProduct,
  findAllPublishedsForShop,
  searchProductForUser,
  searchAllProducts,
  getProductDetail,
  findAndUpdateById,
  findProductById,
} = require("../models/repositories/product.repo");
const {
  removeUndefinedValue,
  removeNestedUndefinedObject,
} = require("../utils");
const { pushNotiToSystem } = require("./notification.service");

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

  static async updateProduct(type, product_id, payload) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass) throw new BadRequestErorr("Invalid product type");

    return await new productClass(payload).updateProduct(product_id);
  }

  static async findAllDraftsForShop({ product_shop, limit = 60, skip = 0 }) {
    const query = { product_shop, isDraft: true };
    return await findAllDraftsForShop({ query, limit, skip });
  }

  static async findAllPublishedsForShop({
    product_shop,
    limit = 50,
    skip = 0,
  }) {
    const query = { product_shop, isDraft: false };
    return await findAllPublishedsForShop({ query, limit, skip });
  }

  static async publishProduct({ product_shop, product_id }) {
    const foundProduct = await findProductById(product_id);
    if (!foundProduct) throw new BadRequestErorr("Product not found");
    if (foundProduct.product_shop.toString() !== product_shop)
      throw new BadRequestErorr("Not have permission");
    return await publishProduct({ product_shop, product_id });
  }

  static async unPublishProduct({ product_shop, product_id }) {
    const foundProduct = await findProductById(product_id);
    if (!foundProduct) throw new BadRequestErorr("Product not found");
    if (foundProduct.product_shop.toString() !== product_shop)
      throw new BadRequestErorr("Not have permission");
    return await publishProduct({
      product_shop,
      product_id,
      isPublishAction: false,
    })
  }

  static async searchProductForUser({ keySearch }) {
    return await searchProductForUser({ keySearch });
  }

  static async searchAllProducts({
    filter = {},
    page = 1,
    limit = 50,
    sortBy = "ctime",
  }) {
    return await searchAllProducts({
      filter,
      page,
      limit,
      sortBy,
      select: [
        "product_name",
        "product_description",
        "product_price",
        "product_thumd",
        "product_type",
        "product_shop",
        "product_slug",
        "product_ratingAverage",
        "product_attributes",
      ],
    });
  }

  static async getProductDetail({ product_id }) {
    const unSelect = ["__v", "product_variants"];
    return await getProductDetail({ product_id, unSelect });
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
    const newProduct = await productModel.create({ ...this, _id: id });
    if (newProduct) {
      await insertInventory({
        productId: newProduct._id,
        stock: this.product_quantity,
        shopId: this.product_shop,
      });
    }
    // push noti to system 
    pushNotiToSystem({
      type: "SHOP-001",
      senderId: this.product_shop,
      receiverId: 1,
      option: {
        product_name: this.product_name, 
        shop_name: this.product_shop
      },
    });
    return newProduct;
  }

  async updateProduct(product_id, body_update) {
    return await findAndUpdateById({
      product_id,
      body_update,
      model: productModel,
    });
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

  async updateProduct(product_id) {
    const objectParams = this;
    if (objectParams.product_attributes) {
      await findAndUpdateById({
        product_id,
        body_update: removeUndefinedValue(objectParams.product_attributes),
        model: clothingModel,
      });
    }

    return await super.updateProduct(
      product_id,
      removeNestedUndefinedObject(objectParams)
    );
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

  async updateProduct(product_id) {
    const objectParams = this;
    if (objectParams.product_attributes) {
      await findAndUpdateById({
        product_id,
        body_update: removeUndefinedValue(objectParams.product_attributes),
        model: electronicModel,
      });
    }

    return await super.updateProduct(
      product_id,
      removeNestedUndefinedObject(objectParams)
    );
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

  async updateProduct(product_id) {
    const objectParams = this;
    if (objectParams.product_attributes) {
      await findAndUpdateById({
        product_id,
        body_update: removeUndefinedValue(objectParams.product_attributes),
        model: furnitureModel,
      });
    }

    return await super.updateProduct(
      product_id,
      removeNestedUndefinedObject(objectParams)
    );
  }
}

ProductFactory.registerProductType("clothing", ClotheProduct);
ProductFactory.registerProductType("electronic", ElectronicProduct);
ProductFactory.registerProductType("furniture", FurnitureProduct);

// module.exports = ProductFactory;
module.exports = ProductFactory;
