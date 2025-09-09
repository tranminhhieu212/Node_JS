"use strict";

const HEADER = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
};

const apikeyModel = require("../models/apikey.model");
const { findById } = require("../services/apikey.service");

const apiKey = async (req, res, next) => {
  try {
    const key = req.headers[HEADER.API_KEY];
    console.log(key);
    
    if (!key) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const objKey = await findById(key);
    if (!objKey) {
      return res.status(403).json({ message: "Forbidden" });
    }

    req.objKey = objKey;
    next();
    
  } catch (error) {
    next(error);
  }
};

const checkPermissions = (permission) => {
    return async (req, res, next) => {
        try {
            const { permissions } = req.objKey;
            if(!permissions) {
                return res.status(403).json({ message: "Permissions denied" });
            }
            if (!permissions.includes(permission)) {
                return res.status(403).json({ message: "Permissions denied" });
            }
            
            return next();
        } catch (error) {
            next(error);
        }
    };
}

module.exports = {
  apiKey,
  checkPermissions
};
