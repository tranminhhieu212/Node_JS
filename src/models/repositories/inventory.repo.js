'use strict';

const { convertToObjectId } = require("../../utils");
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

const reservationInventory = async ({
  productId, quantity, cartId
}) => {
  const query = {
    inven_productId: convertToObjectId(productId),
    inven_stock: { $gte: quantity }
  }, updateSet = {
    $inc: { inven_stock: -quantity }, 
    $push: { inven_reservations: {
      quantity,
      cartId, 
      createdOn: new Date()
    } }
  }, option = { new: true , upsert: true };

  return await Inventories.updateOne(query, updateSet, option);
}

module.exports = {
  insertInventory, reservationInventory
}