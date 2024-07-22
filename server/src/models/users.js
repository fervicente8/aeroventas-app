const mongoose = require('mongoose');

const usersSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: true
    },
    idGoogle: {
        type: String,
        required: true
    },
    cart: {
        type: Array,
        default: []
    },
    type: {
        type: String,
        default: "user"
    }
});

module.exports = mongoose.model("User", usersSchema)