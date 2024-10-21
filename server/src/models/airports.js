const mongoose = require('mongoose');

const airportSchema = new mongoose.Schema({
    icao: { type: String, required: true, unique: true },
    iata: { type: String, default: "" },
    name: { type: String },
    city: { type: String },
    region: { type: String },
    country: { type: String },
    elevation_ft: { type: String },
    latitude: { type: String },
    longitude: { type: String },
    timezone: { type: String },
});

const Airport = mongoose.model('Airport', airportSchema);

module.exports = Airport;