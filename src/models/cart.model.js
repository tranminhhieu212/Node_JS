'use strict';

const {model, Shema, default: mongoose} = require("mongoose");

const DOCUMENT_NAME = "Cart";
const COLLECTION_NAME = "Carts";

const cartSchema = new mongoose.Schema(
    {
        cart_state: {
            type: String, 
            required: true,
            enum: ["active", "inactive", "completed", "pending", "failed"], 
            default: 'active'
        },
        cart_products: {
            type: Array, 
            required: true,
            default: [],
        },
        cart_count_products: {
            type: Number, 
            default: 0
        },
        cart_userId: {
            type: Number, 
            required: true
        },
    },
    {
        collection: COLLECTION_NAME,
        timestamps: {
            createAt: "createOn", 
            updateAt: "modifyOn"
        }
    }
);

cartSchema.pre("save", function (next) {
    this.cart_count_products = this.cart_products.length
    next()
})

module.exports = model(DOCUMENT_NAME, cartSchema);