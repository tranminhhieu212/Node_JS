"use strict";
const inventory = require("../services/inventory.service");
const { SuccessResponse } = require("../core/success.response");

class InventoryController {
  addStockToInventory = async (req, res, next) => {
    new SuccessResponse({
      metadata: await inventory.addStockToInventory(req.body),
    }).send(res);
  };
}

module.exports = new InventoryController();
