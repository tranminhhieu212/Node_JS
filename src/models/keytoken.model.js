'use strict';

const mongoose = require('mongoose'); 
const DOCUMENT_NAME = 'Key'; // name used in code
const COLLECTION_NAME = 'Keys'; // name used in database

var keytokenSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Shop",
    },
    email: {
        type: String,
    },
    publicKey:{
        type: String, required: true
    },
    privateKey:{
        type: String, required: true
    },
    refreshTokensUsed:{
        type: Array,
        default: []
    },
    refreshToken: {
        type: String,
        required: true
    }
}, {
    collection: COLLECTION_NAME,
    timestamps: true
});

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, keytokenSchema);
