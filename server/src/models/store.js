const mongoose = require('mongoose');

const storeSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: false
    },
    phone: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: true
    },
    paymentMethods: {
        type: [String],
        required: true
    },
    freeDelivery: {
        type: [String],
        required: false
    },
    countryShipping: {
        type: Boolean,
        required: true
    },
    slogan: {
        type: String,
        required: true
    },
    categories: {
        type: [Object],
        required: false
    }
});

module.exports = mongoose.model("Store", storeSchema)