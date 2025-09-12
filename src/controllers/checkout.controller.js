"use strict";

const checkoutService = require("../services/checkout.service");
const { SuccessResponse } = require("../core/success.response");

class CheckoutController {
    checkoutReview = async (req, res, next) =>  {
        return new SuccessResponse({
            message: "Checkout review successfully",
            metadata: await checkoutService.checkoutReview(req.body),
        }).send(res);
    }
    checkoutConfirm() {}
}

module.exports = new CheckoutController();