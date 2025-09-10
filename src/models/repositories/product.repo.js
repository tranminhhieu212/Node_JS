"use strict";

const { Types } = require("mongoose");
const { productModel } = require("../product.model");
const { getSelectData, getUnSelectData } = require("../../utils");

const queryProduct = async ({ query, limit = 60, skip = 0 }) => {
  return await productModel
    .find(query)
    .populate("product_shop", "name email -_id")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
};

const searchProductForUser = async ({ keySearch }) => {
  const regexSearch = new RegExp(keySearch);
  const results = await productModel
    .find(
      {
        $text: { $search: regexSearch },
        isPublished: true,
      },
      { score: { $meta: "textScore" } }
    )
    .sort({ score: { $meta: "textScore" } })
    .lean();

  return results;
};

const searchAllProducts = async ({ page, limit, sortBy, select, filter }) => {
  const skip = (page - 1) * limit;
  const sort = (sortBy = "ctime" ? { _id: -1 } : { _id: 1 });

  const products = await productModel
    .find(filter)
    .sort(sort)
    .select(getSelectData(select))
    .skip(skip)
    .limit(limit)
    .lean();

  return products;
};

const getProductDetail = async ({ product_id, unSelect }) => {
  const products = await productModel
    .findById(product_id)
    .select(getUnSelectData(unSelect))
    .lean();

  return products;
};

const findAllDraftsForShop = async ({ query, limit = 60, skip = 0 }) => {
  return await queryProduct({ query, limit, skip });
};

const findAllPublishedsForShop = async ({ query, limit = 60, skip = 0 }) => {
  return await queryProduct({ query, limit, skip });
};

const publishProduct = async ({
  product_shop,
  product_id,
  isPublishAction = true,
}) => {
  const foundProduct = await productModel.findOne({
    _id: product_id,
    product_shop: new Types.ObjectId(product_shop),
  });
  if (!foundProduct) return null;

  foundProduct.isDraft = !isPublishAction;
  foundProduct.isPublished = isPublishAction;
  return await foundProduct.save();
};

module.exports = {
  findAllDraftsForShop,
  publishProduct,
  findAllPublishedsForShop,
  searchProductForUser,
  searchAllProducts,
  getProductDetail,
};
