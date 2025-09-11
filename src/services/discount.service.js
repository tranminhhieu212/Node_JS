"use strict";

const { BadRequestErorr } = require("../core/errror.response");
const discountModel = require("../models/discount.model");
const {
  findAllDiscountCodesUnSelect,
  checkDiscountExist,
} = require("../models/repositories/discount.repo");
const { searchAllProducts } = require("../models/repositories/product.repo");
const { convertToObjectId } = require("../utils");

/**
 * Discount service
 * Generate discount code [Shop | Admin]
 * Get discount amount [User]
 * Get all discount code [User | Shop]
 * Verify discount code [User]
 * Delete discount code [Shop | Admin]
 * Cancel discount code [User]
 */

class DiscountService {
  static async createDiscountCode(payload) {
    const {
      code,
      start_date,
      end_date,
      min_order,
      shopId,
      product_ids,
      applies_to,
      name,
      description,
      type,
      max_value,
      value,
      max_uses,
      uses_count,
      max_uses_per_user,
    } = payload;

    // check
    if (
      new Date(start_date) > new Date(end_date) ||
      new Date() > new Date(end_date)
    ) {
      throw new BadRequestErorr("Discount date is invalid");
    }

    const foundDiscount = await discountModel
      .findOne({
        discount_code: code,
        discount_shopId: convertToObjectId(shopId),
      })
      .lean();

    if (foundDiscount && foundDiscount.discount_is_active) {
      throw new BadRequestErorr("Discount code already exists");
    }

    const newDiscount = discountModel.create({
      discount_name: name,
      discount_description: description,
      discount_type: type,
      discount_value: value,
      discount_code: code,
      discount_startDate: new Date(start_date),
      discount_endDate: new Date(end_date),
      discount_min_order_value: min_order,
      discount_shop: convertToObjectId(shopId),
      discount_productIds: product_ids,
      discount_applies_to: applies_to,
      discount_maxValue: max_value,
      discount_max_uses: max_uses,
      discount_uses_count: uses_count,
      discount_max_uses_per_user: max_uses_per_user,
      discount_products: applies_to === "all" ? [] : product_ids,
    });

    return newDiscount;
  }

  static async updateDiscountCode(payload) {
    // todo
  }

  static async getAllProductsInDiscount({ code, shopId, userId, limit, page }) {
    const foundDiscount = await discountModel
      .findOne({
        discount_code: code,
        discount_shop: convertToObjectId(shopId),
      })
      .lean();

    if (!foundDiscount || foundDiscount.discount_is_active === false) {
      throw new BadRequestErorr("Discount code not found");
    }

    const { discount_applies_to, discount_products } = foundDiscount;

    let products = null;
    let select = ["product_name", "product_description", "product_price", "product_thumd", "product_type", "product_shop", "product_slug", "product_ratingAverage", "product_attributes"];
    if (discount_applies_to === "all") {
      // get all product
      products = await searchAllProducts({
        page: +page,
        limit: +limit,
        sortBy: "ctime",
        select,
        filter: {
          product_shop: convertToObjectId(shopId),
        },
      });
    } else {
      // get the product ids
      products = await searchAllProducts({
        page: +page,
        limit: +limit,
        sortBy: "ctime",
        select,
        filter: {
          product_shop: convertToObjectId(shopId),
          _id: { $in: discount_products },
        },
      });
    }

    return products;
  }

  static async getAllDiscountForShop({ shopId, limit = 50, page = 1 }) {
    const discounts = await findAllDiscountCodesUnSelect({
      limit: +limit,
      page: +page,
      filter: {
        discount_shop: convertToObjectId(shopId),
      },
      unSelect: ["__v", "discount_shop"],
      model: discountModel,
    });

    return discounts;
  }

  static async getDisCountDetails({ discountId, shopId }) {
    const discount = await discountModel
      .findOne({
        _id: discountId,
        discount_shop: convertToObjectId(shopId),
      })
      .lean();

    return discount;
  }

  static async getDiscountAmount({ products, codeId, shopId, userId }) {
    console.log({
      discount_code: codeId,
      discount_shop: convertToObjectId(shopId),
    });
    const foundDiscount = await checkDiscountExist({
      model: discountModel,
      filter: {
        discount_code: codeId,
        discount_shop: convertToObjectId(shopId),
      },
    });

    if (!foundDiscount) throw new BadRequestErorr("Discount code not found");

    const {
      discount_is_active,
      discount_users_used,
      discount_max_uses_per_user,
      discount_value,
      discount_max_uses,
      discount_type,
      discount_startDate,
      discount_endDate,
      discount_min_order_value,
    } = foundDiscount;

    if (!discount_is_active)
      throw new BadRequestErorr("Discount code is not active");
    if (!discount_max_uses)
      throw new BadRequestErorr("Discount code is out of uses");

    if (new Date() < new Date(discount_startDate))
      throw new BadRequestErorr("Discount code is not active yet");
    if (new Date() > new Date(discount_endDate))
      throw new BadRequestErorr("Discount code is expired");

    let totalOrder = 0;
    if (discount_min_order_value > 0) {
      totalOrder = products.reduce((acc, product) => {
        return acc + product.product_price * product.product_quantity;
      }, 0);

      if (totalOrder < discount_min_order_value)
        throw new BadRequestErorr("Total order is less than min order value");
    }

    if (discount_max_uses_per_user > 0) {
      const userUsedDiscountCodes = discount_users_used.find(
        (user) => user === userId
      );
      if (userUsedDiscountCodes) {
        // ....
      }
    }

    let discountAmount = 0;
    discountAmount =
      discount_type === "fixed"
        ? discount_value
        : (totalOrder * discount_value) / 100;

    return {
      discount: `${foundDiscount.discount_value}${
        foundDiscount.discount_type === "fixed" ? "$" : "%"
      }`,
      totalOrder,
      discountAmount,
      totalPrice: totalOrder - discountAmount,
    };
  }

  static async cancelDiscountCode({ shopId, codeId, userId }) {
    const foundDiscount = await checkDiscountExist({
      model: discountModel,
      filter: {
        discount_code: codeId,
        discount_shop: convertToObjectId(shopId),
      },
    });

    if (!foundDiscount) throw new BadRequestErorr("Discount code not found");

    const result = await discountModel.findByIdAndUpdate(
      foundDiscount._id,
      {
        $pull: { discount_users_used: userId },
        $inc: { discount_max_uses: 1, discount_uses_count: -1 },
      },
      { new: true }
    );

    return result;
  }

  static async deleteDiscountCode({ shopId, discountId }) {
    const deleted = await discountModel.findByIdAndDelete({
      _id: discountId,
      discount_shop: convertToObjectId(shopId),
    });
    return deleted;
  }
}

module.exports = DiscountService;
