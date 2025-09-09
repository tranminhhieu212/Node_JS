"use strict";

const accessService = require("../services/access.service");
const { CREATED, SuccessResponse } = require("../core/success.response");

class AccessController {
  refreshToken = async (req, res, next) => {
    new SuccessResponse({
      metadata: await accessService.handlerRefreshToken({
        refreshToken: req.refreshToken,
        keyStore: req.keyStore,
        user: req.user,
      })
    }).send(res);
  }

  logout = async (req, res, next) => {
    new SuccessResponse({
      metadata: await accessService.logout(req.keyStore)
    }).send(res);
  }

  login = async (req, res, next) => {
    new SuccessResponse({
      metadata: await accessService.login(req.body)
    }).send(res);
  }

  signUp = async (req, res, next) => {
    new CREATED({
      message: "User created successfully - Success Response",
      metadata: await accessService.signUp(req.body),
      options: {
        limits: 10,
        page: 1
      }
    }).send(res);
  };
}

module.exports = new AccessController();
