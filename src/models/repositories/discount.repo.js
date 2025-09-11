"use strict";

const { getSelectData, getUnSelectData } = require("../../utils");

const findAllDiscountCodesUnSelect = async ({
  limit = 50,
  page = 1,
  sort = "ctime",
  filter = {},
  unSelect,
  model,
}) => {
  return await model
    .find(filter)
    .sort({ [sort]: -1 })
    .select(getUnSelectData(unSelect))
    .skip((page - 1) * limit)
    .limit(limit)
    .lean()
    .exec();
};

const findAllDiscountCodesSelect = async ({
  limit = 50,
  page = 1,
  sort = "ctime",
  filter = {},
  select,
  model,
}) => {
  return await model
    .find(filter)
    .sort({ [sort]: -1 })
    .select(getSelectData(select))
    .skip((page - 1) * limit)
    .limit(limit)
    .lean()
    .exec();
};

const checkDiscountExist = async ({ model, filter }) => {
  return await model.findOne(filter).lean();
};

module.exports = {
  findAllDiscountCodesUnSelect,
  findAllDiscountCodesSelect,
  checkDiscountExist
};
