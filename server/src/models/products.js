const mongoose = require('mongoose');

const productsSchema = mongoose.Schema({
    productName: {
        type: String,
        trim: true,
        required: true
    },
    productStatus: {
        type: String,
        trim: true,
        required: true
    },
    images: {
        type: [{
            public_id: String,
            secure_url: String
        }],
        required: true
    },
    description: {
        type: String,
        trim: true,
        required: true
    },
    brand: {
        type: String,
        trim: true,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    category: {
        type: Array,
        required: true
    },
    LWH: {
        type: String,
        required: false
    },
    weight: {
        type: String,
        required: false
    },
    sku: {
        type: String,
        required: false
    },
    offerStatus: {
        type: Boolean,
        required: false
    },
    offerPrice: {
        type: String,
        required: false
    },
    offerDuration: {
        type: {},
        required: false
    },
    stock: {
        type: Number,
        required: true
    },
    sold: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Product", productsSchema)