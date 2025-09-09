"use strict";

const bscrypt = require("bcrypt");
const shopModel = require("../models/shop.model");
const { createTokenPair, verifyJWT } = require("../auth/authUtils");
const KeyTokenService = require("./keyToken.service");
const { getDataInfo } = require("../utils");
const {
  ConflictRequestErorr,
  ServerError,
  BadRequestErorr,
  AuthFailureError,
  ForbiddenError,
} = require("../core/errror.response");
const { findByEmail } = require("./shop.service");
const { generateKeyPairSync } = require("../utils/cryptoUtils");

const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

class AccessService {
  static handlerRefreshToken = async ({ refreshToken, keyStore, user }) => {
    const {userId, email} = user;

    if (!refreshToken)
      throw new AuthFailureError("Invalid request - refreshToken");

    if (keyStore.refreshTokensUsed.includes(refreshToken)) {
      await KeyTokenService.deleteKeyById(userId);
      throw new ForbiddenError("Something went wrong - ErrorHandler");
    }

    if (keyStore.refreshToken !== refreshToken)
      throw new AuthFailureError("Invalid request - ErrorHandler");

    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new AuthFailureError("Shop not found - ErrorHandler");

    const { publicKey, privateKey } = keyStore;
    const tokens = await createTokenPair(
      {
        userId: userId,
        role: RoleShop.SHOP,
        email,
      },
      publicKey,
      privateKey
    );

    await keyStore.updateOne({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        refreshTokensUsed: refreshToken,
      },
    });

    return {
      user,
      tokens,
    };
  };

  static logout = async (keyStore) => {
    return await KeyTokenService.deleteKeyToken(keyStore?._id);
  };

  static login = async ({ email, password, refreshToken = null }) => {
    // 1 check email in DBs
    // 2 Match Password
    // 3 Create access token and refresh token and Save
    // 4 Generate token pair
    // 5 return data

    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new BadRequestErorr("Shop not found - ErrorHandler");

    const match = await await bscrypt.compare(password, foundShop.password);
    if (!match) {
      throw new AuthFailureError("Authentication fail - ErrorHandler");
    }

    const { _id: userId } = foundShop;
    const { privateKey, publicKey } = generateKeyPairSync();
    const tokens = await createTokenPair(
      {
        userId: userId,
        role: RoleShop.SHOP,
        email,
      },
      publicKey,
      privateKey
    );

    await KeyTokenService.createKeyToken({
      userId: userId,
      email,
      publicKey,
      privateKey,
      refreshToken: tokens.refreshToken,
    });

    return {
      metadata: {
        ...getDataInfo({
          fields: ["_id", "name", "email", "roles"],
          Object: foundShop,
        }),
        ...tokens,
      },
    };
  };

  static signUp = async ({ name, email, password }) => {
    // 1 Check email in DB
    // 2 Hash password and create new Shop
    // 3 Create access token and refresh token

    const hodelShop = await shopModel.findOne({ email }).lean();
    if (hodelShop)
      throw new ConflictRequestErorr("Email already exists - ErrorHandler");

    const passwordHash = await bscrypt.hash(password, 10);
    const newShop = await shopModel.create({
      name,
      email,
      password: passwordHash,
      roles: [RoleShop.SHOP],
    });

    if (newShop) {
      const { privateKey, publicKey } = generateKeyPairSync();
      const { _id: shopId } = newShop;

      const tokens = await createTokenPair(
        { userId: shopId, role: RoleShop.SHOP, email },
        publicKey,
        privateKey
      );

      const keyStore = await KeyTokenService.createKeyToken({
        userId: shopId,
        email,
        publicKey,
        privateKey, // why we need to store private key ???
        refreshToken: tokens.refreshToken,
      });

      if (!keyStore) throw new ServerError("Failed to create key token");

      return {
        code: 201,
        message: "User signup successfully",
        metaData: {
          shop: getDataInfo({
            fields: ["_id", "name", "email"],
            Object: newShop,
          }),
          status: "active",
          ...tokens,
        },
      };
    } else {
      return {
        code: 200,
        metaData: null,
      };
    }
  };
}

module.exports = AccessService;
