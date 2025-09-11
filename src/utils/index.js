"use strict";

const _ = require("lodash");
const { default: mongoose } = require("mongoose");

const getDataInfo = ({ fields = [], Object = {} }) => {
  return _.pick(Object, fields);
};

const getSelectData = (select) => {
  return Object.fromEntries(select.map((item) => [item, 1]));
};

const getUnSelectData = (select) => {
  return Object.fromEntries(select.map((item) => [item, 0]));
};

const removeUndefinedValue = (object) => {
  Object.keys(object).forEach((k) => {
    if (object[k] == null) {
      delete object[k];
    }
  });

  return object;
};

const removeNestedUndefinedObject = (object) => {
  const final = {};

  Object.keys(object).forEach((k) => {
    const value = object[k];

    if (value === undefined) {
      return;
    }

    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      const response = removeNestedUndefinedObject(value);
      Object.keys(response).forEach((a) => {
        final[`${k}.${a}`] = response[a];
      });
    } else {
      final[k] = value;
    }
  });


  return removeUndefinedValue(final);
};

const convertToObjectId = (id) => new mongoose.Types.ObjectId(id);

module.exports = {
  getDataInfo,
  getSelectData,
  getUnSelectData,
  removeUndefinedValue,
  removeNestedUndefinedObject,
  convertToObjectId
};
