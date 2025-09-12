"use strict";

const { NotFoundError } = require("../core/errror.response");
const { findProductById } = require("../models/repositories/product.repo");
const cartModel = require("../models/cart.model");

class CartService {
  static async createUserCart({ userId , product = {} }) {
    const query = {
        cart_userId: userId,
        cart_state: "active",
      },
      updateOrInsert = {
        $addToSet: {
          cart_products: product,
        },
        $inc: {
          cart_count_products: 1,
        },
      },
      options = {
        upsert: true,
        new: true,
      };
    return cartModel.findOneAndUpdate(query, updateOrInsert, options);
  }

  static async updateUserCartQuantity({ userId, product = {} }) {
    const { productId, quantity } = product;
    const query = {
        "cart_products.productId": productId,
        cart_userId: userId,
        cart_state: "active",
      },
      updateSet = {
        $inc: { "cart_products.$.quantity": quantity },
      },
      options = { new: true };

    return cartModel.findOneAndUpdate(query, updateSet, options);
  }

  // add new product in langing page
  static async addToCart({ userId, product = {} }) {
    const userCart = await cartModel.findOne({ cart_userId: userId });
    if(!userCart) return await CartService.createUserCart({ userId, product });

    if(!userCart.cart_products.length) {
      userCart.cart_products = [product];
      return await userCart.save();
    }

    const productIsExist = userCart.cart_products.find(
      (item) => item.productId === product.productId
    );
    if(productIsExist)
      return await CartService.updateUserCartQuantity({ userId, product });

    userCart.cart_products.push(product);
    return await userCart.save();
  }

  // update quantity in user cart (increase or decrease existed product quantity)
  static async updateExistedProductQuantity({ userId, cart_order_ids = [] }) {
    const { productId, quantity, old_quantity, shopId } = cart_order_ids[0].products[0];

    const foundProduct = await findProductById(productId);
    if(!foundProduct) throw new NotFoundError("Product not found");

    if(foundProduct.product_shop.toString() !== shopId) throw new NotFoundError("Product not found");

    if(quantity === 0) return await CartService.deleteCartItem({ userId, productId });

    return await CartService.updateUserCartQuantity({
      userId,
      product: { productId, quantity: quantity - old_quantity },
    });
  }

  static async deleteCartItem({ userId, productId }) {
    const query = {
      cart_userId: userId,
      "cart_products.productId": productId,
      cart_state: "active",
    };
    const updateSet = {
      $pull: {
        cart_products: {
          productId,
        },
      },
    };
    
    return cartModel.findOneAndUpdate(query, updateSet, { new: true });
  }

  static async getUserCart({ userId }) {
    return await cartModel.findOne({ cart_userId: userId }).lean();
  }
}

module.exports = CartService;

/**
 *   userId: String,
 * cart_order_ids: [String], [
 * {
 *    shopId: String
 *   products: [
 *     {
 *       productId: String,
 *       quantity: Number,
 *       old_quantity: Number
 *        shopId: String
 *     }
 *   ]
 * }
 * ]
 */
