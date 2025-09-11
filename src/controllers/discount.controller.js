"use strict";

const discountService = require("../services/discount.service");
const { SuccessResponse } = require("../core/success.response");

class DiscountController {
  createDiscount = async (req, res, next) => {
    new SuccessResponse({
      metadata: await discountService.createDiscountCode({
        ...req.body,
        shopId: req.user.userId,
      }),
    }).send(res);
  };

  getAllProductsInDiscount = async (req, res, next) => {
    new SuccessResponse({
      metadata: await discountService.getAllProductsInDiscount({
        code: req.body.code,
        shopId: req.body.shopId,
        limit: req.query.limit,
        page: req.query.page,
      }),
    }).send(res);
  };

  getAllDiscountForShop = async  (req, res, next) => {
    new SuccessResponse({
      metadata: await discountService.getAllDiscountForShop({
        shopId: req.body.shopId,
        limit: req.query.limit,
        page: req.query.page,
      }),
    }).send(res);
  }

  getDisCountDetails = async  (req, res, next) => {
    new SuccessResponse({
      metadata: await discountService.getDisCountDetails({
        discountId: req.params.discountId,
        shopId: req.params.shopId
      }),
    }).send(res);
  }

  getDiscountAmount = async (req, res, next) => {
    console.log(req.body, req.user);
    new SuccessResponse({
      metadata: await discountService.getDiscountAmount({
        ...req.body,
        userId: req.user.userId || req.user.user
      }),
    }).send(res); 
  }

  cancelDiscountCode = async (req, res, next) => {
    new SuccessResponse({
      metadata: await discountService.cancelDiscountCode({
        codeId: req.body.codeId,
        shopId: req.body.shopId,
        userId: req.user.userId
      }),
    }).send(res);
  }

  deleteDiscountCode = async (req, res, next) => {
    new SuccessResponse({
      metadata: await discountService.deleteDiscountCode({
        discountId: req.params.discountId,
        shopId: req.user.userId
      }),
    }).send(res);
  }
}

module.exports = new DiscountController();
