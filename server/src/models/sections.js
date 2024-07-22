const mongoose = require('mongoose');

const sectionsSchema = mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    images: {
        type: [{
            public_id: String,
            secure_url: String
        }]
    },
    redirectUrl: {
        type: String,
        required: false
    }
});

module.exports = mongoose.model("Section", sectionsSchema)