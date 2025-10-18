"use strict";

const { Type } = require("avsc");
const keytokenModel = require("../models/keytoken.model");
const { Types } = require("mongoose");

class   KeyTokenService {
  static createKeyToken = async ({
    userId,
    email,
    publicKey,
    privateKey,
    refreshToken = null,
  }) => {
    try {
      // level 0
      // const publicKeyString = publicKey.toString();
      // const token = await keytokenModel.create({user: userId, publicKey: publicKeyString});
      // return token ? token.publicKey : null;

      // Level 1
      const filters = { user: userId },
        options = { new: true, upsert: true },
        update = { publicKey, privateKey, refreshToken, refreshTokensUsed: [], email };

      const tokens = await keytokenModel
        .findOneAndUpdate(filters, update, options)
        .lean();

      return tokens ? tokens.publicKey : null;
    } catch (error) {
      return error;
    }
  };

  static verifyRefreshToken = async (userId, refreshToken) => {
    try {
      return await keytokenModel.findOne({ user: userId, refreshToken }).lean();
    } catch (error) {
      return error;
    }
  };

  static findByUserId = async (userId) => {
    return await keytokenModel.findOne({ user: new Types.ObjectId(userId) });
  };

  static deleteKeyToken = async (id) => {
    return await keytokenModel.deleteOne({ _id: new Types.ObjectId(id) });
  };

  static findByRefreshTokenUsed = async (refreshToken) => {
    return await keytokenModel.findOne({ refreshTokensUsed: refreshToken }).lean();
  };

  static findByRefreshToken = async (refreshToken) => {
    return await keytokenModel.findOne({ refreshToken });
  };

  static deleteKeyById = async (userId) => {
    return await keytokenModel.deleteOne({ user: new Types.ObjectId(userId) });
  };
}

module.exports = KeyTokenService;
