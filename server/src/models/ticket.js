const mongoose = require('mongoose');

const scaleSchema = mongoose.Schema({
    place: {
        type: String,
        trim: true,
        required: true
    },
    waiting_time: {
        type: String,
        trim: true,
        required: true
    },
    new_plane: {
        type: Boolean,
        required: true
    },
    new_plane_id: {
        type: String,
        trim: true,
    }
});

const ticketSchema = mongoose.Schema({
    airline_id: {
        type: String,
        trim: true,
        required: true
    },
    plane_id: {
        type: String,
        trim: true,
        required: true
    },
    origin: {
        type: String,
        trim: true,
        required: true
    },
    destination: {
        type: String,
        trim: true,
        required: true
    },
    scales: [scaleSchema],
    date: {
        type: Date,
        trim: true,
        required: true
    },
    departure_time: {
        type: String,
        trim: true,
        required: true
    },
    arriving_time: {
        type: String,
        trim: true,
        required: true
    },
    flight_number: {
        type: String,
        trim: true,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Ticket", ticketSchema);