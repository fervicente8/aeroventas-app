const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema({
    reviewer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        trim: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

const documentSchema = mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ['dni', 'license', 'cma']
    },
    files_url: {
        type: [String],
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        default: "pending",
        enum: ["pending", "accepted", "rejected"]
    },
    license_type: {
        type: String,
        enum: ["private", "comercial"]
    },
    expiration_date: {
        type: Date,
    },
});

const userSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    last_name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profile_picture: {
        public_id: String,
        secure_url: String
    },
    flight_hours: {
        type: Number,
        required: true,
        default: 0
    },
    buyed_planes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BuyPlane'
    }],
    reviews_given: [reviewSchema],
    reviews_received: [reviewSchema],
    documents: [documentSchema],
    created_at: {
        type: Date,
        default: Date.now
    },
    type: {
        type: String,
        default: "user",
        enum: ["user", "admin", "airline", "hangar"]
    },
    status: {
        type: String,
        default: "active",
        enum: ["active", "inactive", "suspended"]
    }
});

module.exports = mongoose.model('User', userSchema);