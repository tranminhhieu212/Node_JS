require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const app = express();

// init middlewares
app.use(morgan("dev")); // http request logger to be used in development
app.use(helmet()); // security headers to protect against common vulnerabilities
app.use(compression()); // compress response data to reduce bandwidth
app.use(express.json()); // parse json request body
app.use(
  express.urlencoded({
    // parse urlencoded request body
    extended: true,
  })
);

// init database
require("./dbs/init.mongodb");
// const { countConnect, checkOverload } = require('./helpers/check.connect');
// console.log("Number of Database Connections : ", countConnect());
// checkOverload();

// init routes
app.use("/", require("./routes"));

// handling error
app.use((req, res, next) => {
  const err = new Error("Endpoint Not Found");
  err.status = 404;
  next(err);
});

app.use((error, req, res, next) => {
  const status = error.status || 500;
  return res
    .status(status)
    .json({
      status: "error",
      code: status,
      stack: error.stack,
      message: error.message || "Internal Server Error",
    });
});

module.exports = app;
