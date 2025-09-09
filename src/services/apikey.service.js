'use strict';

const apikeyModel = require("../models/apikey.model");

const findById = async (key) => {
  try {
    return await apikeyModel.findOne({key, status: true}).lean();
  } catch (error) {
    return error;
  }
};

module.exports = {
  findById
}