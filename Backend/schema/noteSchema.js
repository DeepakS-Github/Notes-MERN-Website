const mongoose = require('mongoose');
const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    tagline: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    pinned: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        default: Date.now,
        required: true
    }
});

module.exports = mongoose.model('notes',noteSchema);