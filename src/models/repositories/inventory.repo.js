'use strict';

const Inventories = require("../inventory.model");

const insertInventory = async ({
  productId, shopId, stock, location = "unKnown"
}) => {
  return await Inventories.create({
    inven_productId: productId,
    inven_location: location,
    inven_shopId: shopId,
    inven_stock: stock
  });
};

module.exports = {
  insertInventory
}