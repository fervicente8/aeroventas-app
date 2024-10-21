const mongoose = require('mongoose');

const pilotSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    document_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Document',
        required: true
    },
    commissioning_date: {
        type: Date,
        required: true
    },
    experience_years: {
        type: Number,
        default: 0
    },
    aircraft_types: [String],
    active: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('Pilot', pilotSchema);