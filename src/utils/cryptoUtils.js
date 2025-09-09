"use strict";

const crypto = require("crypto");

const generateKeyPairSync = () => crypto.generateKeyPairSync("rsa", {
  modulusLength: 4096,
  publicKeyEncoding: {
    type: "pkcs1",
    format: "pem",
  },
  privateKeyEncoding: {
    type: "pkcs1",
    format: "pem",
  },
});

module.exports = {
  generateKeyPairSync,
};
