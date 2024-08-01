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
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const documentSchema = mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ['Documento Nacional de Identidad (DNI)', 'Pasaporte', 'Licencia de Piloto Privado (PPL)', 'Licencia de Piloto Comercial (CPL)', 'Certificación Médica Aeronautica (CMA)', 'Otro']
    },
    document_id: {
        type: String,
        required: true
    },
    expiration_date: {
        type: Date,
        required: true
    },
    file_url: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        default: "pending",
        enum: ["pending", "accepted", "rejected"]
    }
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
    rented_planes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RentPlane'
    }],
    reviews_given: [reviewSchema],
    reviews_received: [reviewSchema],
    documents: [documentSchema],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', userSchema);