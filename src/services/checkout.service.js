"use strict";

const { NotFoundError, BadRequestErorr } = require("../core/errror.response");
const orderModel = require("../models/order.model");
const { findCartById } = require("../models/repositories/cart.repo");
const { checkProductsServer } = require("../models/repositories/product.repo");
const { getDiscountAmount } = require("./discount.service");
const { acquireLock, releaseLock } = require("./redis.service");

class CheckoutService {
  /*
    {  
        cartId,
        userId,
        shop_order_ids: [
            {
                shopId, 
                shop_discount: [],
                prducts: [{
                    productId,
                    quantity,
                    price
                }]
            }
        ],
    }
*/
  static async checkoutReview({ cartId, userId, shop_order_ids = [] }) {
    // todo
    const foundCart = await findCartById(cartId);
    if (!foundCart) throw new NotFoundError("Cart not found");

    const orderCheckout = {
        feeShip: 0,
        totalPrice: 0,
        totalDiscount: 0,
        totalCheckout: 0,
      },
      shop_order_ids_new = [];

    for (let i = 0; i < shop_order_ids.length; i++) {
      const { shopId, shop_discount, products } = shop_order_ids[i];
      const checkedProducts = await checkProductsServer(products);

      if (!checkedProducts[0])
        throw new BadRequestErorr("Some product not found");

      const checkoutPrice = checkedProducts.reduce(
        (total, item) => total + item.product_price * item.product_quantity,
        0
      );
      orderCheckout.totalPrice += checkoutPrice;

      const itemCheckout = {
        shop_id: shopId,
        shop_discount,
        raw_price: checkoutPrice,
        price_applied_discount: checkoutPrice,
        checked_products: checkedProducts,
      };

      if (shop_discount.length > 0) {
        const { discountAmount = 0 } = await getDiscountAmount({
          products: checkedProducts,
          code: shop_discount[0].discount_code,
          shopId,
          userId,
        });

        if (discountAmount > 0) {
          itemCheckout.price_applied_discount = checkoutPrice - discountAmount;
        }

        orderCheckout.totalDiscount += discountAmount;
      }

      orderCheckout.totalCheckout += itemCheckout.price_applied_discount;
      shop_order_ids_new.push(itemCheckout);
    }

    return {
      shop_order_ids,
      shop_order_ids_new,
      checkout_order: orderCheckout,
    };
  }

  static async checkoutConfirm({
    shop_order_ids,
    cartId,
    userId,
    user_address = {},
    user_payment = {},
  }) {
    // todo
    const { shop_order_ids_new, checkout_order } =
      await CheckoutService.checkoutReview({ cartId, userId, shop_order_ids });

    const products = shop_order_ids_new.flatmap(
      (item) => item.checked_products
    );

    const acquireLocks = [];
    for (let i = 0; i < products.length; i++) {
      const { productId, product_quantity } = products[i];
      const keyLock = await acquireLock(productId, product_quantity, cartId);
      acquireLocks.push(keyLock ? true : false);
      if (keyLock) {
        await releaseLock(keyLock);
      }
    }

    if (acquireLocks.includes(false)) {
      throw new BadRequestErorr(
        "Some product not found, please back to cart and try again"
      );
    }

    const newOrder = await orderModel.create({
      order_userId: userId,
      order_products: products,
      order_checkout: checkout_order,
      order_shipping: user_address,
      order_payment: user_payment,
    });

    // creaet order success -> remvoe product in cart
    if (!newOrder) throw new BadRequestErorr("Create order failed");
    else {
      // remove cart
    }

    return newOrder;
  }

  static async getOrdersByUser() {}

  static async getOneOrderByUser() {}

  static async cancelOrderByUser() {}

  static async updateOrderStatusByShop() {}
}

module.exports = CheckoutService;
