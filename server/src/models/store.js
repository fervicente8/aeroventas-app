const mongoose = require('mongoose');

const storeSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true
    },
    phone: {
        type: String,
        trim: true,
        required: true
    },
    whatsapp_phone: {
        type: String,
        trim: true,
    }
});

module.exports = mongoose.model("Store", storeSchema);