'use strict';

const claudinary = require('cloudinary').v2;
const { CLOUD_NAME, API_KEY, API_SECRET } = process.env;

claudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: API_KEY,
    api_secret: API_SECRET
});

console.log("Connect to Cloudinary")

module.exports = {
    claudinary
};
