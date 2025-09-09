'use strict'

const mongoose = require('mongoose');

const connectString = "mongodb://localhost:27017/ecommerce";

mongoose.connect(connectString).then(() => {
    console.log("Connected to database");
}).catch((err) => {
    console.log(err);
});

module.exports = mongoose;