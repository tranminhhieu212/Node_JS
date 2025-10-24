"use strict";

const dev = {
  host: process.env.DEV_REDIS_HOST || "localhost",
  port: process.env.DEV_REDIS_PORT || 6380,
  password: process.env.DEV_REDIS_PASSWORD || "Password1!",
};

const prod = {
  host: process.env.PROD_REDIS_HOST || "localhost",
  port: process.env.PROD_REDIS_PORT || 6380,
  password: process.env.PORD_REDIS_PASSWORD || "Password1!",
};

const config = { dev, prod };
const env = process.env.NODE_ENV || "prod";

module.exports = config[env];
