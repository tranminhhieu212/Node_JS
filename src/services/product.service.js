"use strict";

const { BadRequestErorr } = require("../core/errror.response");
const {
  productModel,
  clothingModel,
  electronicModel,
  furnitureModel
} = require("../models/product.model");

// class ProductFactory {
//   static async createProduct(type, payload) {
//     switch (type) {
//       case "electronic":
//         return await new ElectronicProduct(payload).createProduct();
//       case "clothing":
//         return await new ClotheProduct(payload).createProduct();
//       default:
//         throw new BadRequestErorr("Create product error - ErrorHandler");
//     }
//   }
// }

class ProductStrategy {
    static productRegistry = {};

    static registerProductType(type, classRef) {
        ProductStrategy.productRegistry[type] = classRef;
    }

    static async createProduct(type, payload) {
        const productClass = ProductStrategy.productRegistry[type];
        if (!productClass) throw new BadRequestErorr("Invalid product type");

        return await new productClass(payload).createProduct();
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
  }) {
    this.product_name = product_name;
    this.product_thumd = product_thumd;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
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

ProductStrategy.registerProductType("clothing", ClotheProduct);
ProductStrategy.registerProductType("electronic", ElectronicProduct);
ProductStrategy.registerProductType("furniture", FurnitureProduct);

// module.exports = ProductFactory;
module.exports = ProductStrategy;
