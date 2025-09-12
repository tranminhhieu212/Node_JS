"use strict";
const cartService = require("../services/cart.service");
const { SuccessResponse } = require("../core/success.response");

class CartController {
  addToCart = async (req, res, next) => {
    new SuccessResponse({
      metadata: await cartService.addToCart(req.body),
    }).send(res);
  };

  updateExistedProductQuantity = async (req, res, next) => {
    new SuccessResponse({
      metadata: await cartService.updateExistedProductQuantity(req.body),
    }).send(res);
  };

  deleteCartItem = async (req, res, next) => {
    new SuccessResponse({
      metadata: await cartService.deleteCartItem(req.body),
    }).send(res);
  };

  getUserCart = async (req, res, next) => {
    new SuccessResponse({
      metadata: await cartService.getUserCart(req.query),
    }).send(res);
  };
}

module.exports = new CartController();
