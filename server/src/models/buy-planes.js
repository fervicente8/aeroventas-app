const mongoose = require('mongoose');

const buyplanesSchema = mongoose.Schema({
    model: {
        type: String,
        trim: true,
        required: true
    },
    category: {
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
        type: Number,
        required: true
    },
    total_hours: {
        type: Number,
        required: true
    },
    remainder_motor_hours: {
        type: Number,
        required: true
    },
    remainder_propeller_hours: {
        type: Number,
        required: true
    },
    engine_model: {
        type: String,
        trim: true,
        required: true
    },
    manufacture_year: {
        type: Number,
        required: true
    },
    documentation_status: {
        type: String,
        trim: true,
        required: true,
        enum: ["under_revision", "ready_to_transfer", "ready_to_fly"]
    },
    description: {
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
    status: {
        type: String,
        trim: true,
        default: "active",
        enum: ["active", "sold", "deleted", "negotiation"]
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("BuyPlane", buyplanesSchema);