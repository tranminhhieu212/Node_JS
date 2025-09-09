"use strict";

const JWT = require("jsonwebtoken");
const asyncHandler = require("../utils/asyncHandler");
const {
  BadRequestErorr,
  NotFoundError,
  AuthFailureError,
} = require("../core/errror.response");
const KeyTokenService = require("../services/keyToken.service");

const HEADER = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
  REFRESH_TOKEN: "x-refresh-token",
  USERID: "x-client-id",
};

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    // accessToken
    const accessToken = await JWT.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: "1d",
    });

    // refreshToken
    const refreshToken = await JWT.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: "7d",
    });

    JWT.verify(accessToken, publicKey, (err, decoded) => {
      if (err) {
        console.log(err);
      } else {
        console.log(decoded);
      }
    });

    return { accessToken, refreshToken };
  } catch (error) {
    return error;
  }
};

// const authorization = asyncHandler(async (req, res, next) => {
//   // 1 check userId
//   // 2 get access token
//   // 3 verify token
//   // 4 check user in DB
//   // 5 check keyStore with this UserId
//   // return next()

//   const userId = req.headers[HEADER.USERID];
//   if (!userId) throw new AuthFailureError("Invalid request - userId");

//   const keyStore = await KeyTokenService.findByUserId(userId);
//   if (!keyStore) throw new NotFoundError("User not found - keyStore");

//   const accessToken = req.headers[HEADER.AUTHORIZATION];
//   if (!accessToken) throw new AuthFailureError("Invalid request - accessToken");

//   try {
//     const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
//     if (userId !== decodeUser.user)
//       throw new AuthFailureError("Invalid request - ErrorHandler");
//     req.keyStore = keyStore;
//     req.user = decodeUser;
//     next();

//   } catch (error) {
//     throw new Error("Access token invalid - ErrorHandler");
//   }
// });

const authorizationV2 = asyncHandler(async (req, res, next) => {
  const userId = req.headers[HEADER.USERID];
  if (!userId) throw new AuthFailureError("Invalid request - userId");

  const keyStore = await KeyTokenService.findByUserId(userId);
  if (!keyStore) throw new NotFoundError("User not found - keyStore");

  const refreshToken = req.headers[HEADER.REFRESH_TOKEN];
  if (refreshToken) {
    try {
      const decodeUser = JWT.verify(refreshToken, keyStore.publicKey);
      if (userId !== decodeUser.userId)
        throw new AuthFailureError("Invalid request - refreshToken");
      req.user = decodeUser;
      req.keyStore = keyStore;
      req.refreshToken = refreshToken;
      return next();
    } catch (error) {
      throw new Error("Refresh token invalid - ErrorHandler");
    }
  }

  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) throw new AuthFailureError("Invalid request - accessToken");

  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
    if (userId !== decodeUser.userId)
      throw new AuthFailureError("Invalid request - ErrorHandler");
    req.keyStore = keyStore;
    req.user = decodeUser;
    return next();
  } catch (error) {
    throw new Error("Access token invalid - ErrorHandler");
  }
});

const verifyJWT = async (token, publicKey) => {
  const decodeUser = await JWT.verify(token, publicKey);
  console.log(decodeUser);
  return decodeUser;
};

module.exports = {
  createTokenPair,
  authorizationV2,
  verifyJWT,
};
