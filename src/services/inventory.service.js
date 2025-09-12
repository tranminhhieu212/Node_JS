"use strict";

const { findProductById } = require("../models/repositories/product.repo");

class InventoryService {
  static async addStockToInventory({
    stock,
    productId,
    shopId,
    location = "unKnown",
  }) {
    const product = await findProductById(productId);
    if (!product) throw new BadRequestErorr("Product not found");
    if (product.product_shop.toString() !== shopId)
      throw new BadRequestErorr("Not have permission");

    const query = {
        inven_shopId: shopId,
        inven_productId: productId,
      },
      updateSet = {
        $inc: {
          inven_stock: stock,
        },
      },
      option = {
        new: true,
        upsert: true,
      };
    const inventory = await Inventories.findOneAndUpdate(
      query,
      updateSet,
      option
    );
    return inventory;
  }
}

module.export = InventoryService;
