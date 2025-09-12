'use strict';

const { convertToObjectId } = require("../../utils");
const cartModel = require("../cart.model");

const findCartById = async (cartId) => {
    const cart = await cartModel.findOne({
        _id: convertToObjectId(cartId),
        cart_state: "active",
    }).lean();

    return cart;
}

module.exports = {
    findCartById
}