"use strict";

const { SuccessResponse } = require("../core/success.response");
const productService = require("../services/product.service");

class ProductController {
  createProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Product created successfully - Success Response",
      metadata: await productService.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.user || req.user.userId,
      }),
    }).send(res);
  };

  searchProductForUser = async (req, res, next) => {
    new SuccessResponse({
      message: "Search product for user successfully",
      metadata: await productService.searchProductForUser(req.params),
    }).send(res);
  };

  findAllDraftsForShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Get all drafts for shop successfully",
      metadata: await productService.findAllDraftsForShop({
        product_shop: req.user.userId || req.user.user,
      }),
    }).send(res);
  };

  findAllPublishedsForShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Get all drafts for shop successfully",
      metadata: await productService.findAllPublishedsForShop({
        product_shop: req.user.userId || req.user.user,
      }),
    }).send(res);
  };

  publishProduct = async (req, res, next) => {
    const { product_id } = req.params;

    new SuccessResponse({
      message: "Product published successfully",
      metadata: await productService.publishProduct({
        product_shop: req.user.userId || req.user.user,
        product_id,
      }),
    }).send(res);
  };

  unPublishProduct = async (req, res, next) => {
    const { product_id } = req.params;

    new SuccessResponse({
      message: "Product published successfully",
      metadata: await productService.unPublishProduct({
        product_shop: req.user.userId || req.user.user,
        product_id,
      }),
    }).send(res);
  };
}

module.exports = new ProductController();
