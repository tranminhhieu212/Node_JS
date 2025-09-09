"use strict";

const { SuccessResponse } = require("../core/success.response");
const productService = require("../services/product.service");

class ProductController {
  createProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Product created successfully - Success Response",
      metadata: await productService.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.user,
      }),
    }).send(res);
  };
}

module.exports = new ProductController();
