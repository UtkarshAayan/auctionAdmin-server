const mongoose = require('mongoose');

const sequenceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    value: { type: Number, required: true }
});

module.exports = mongoose.model('Sequence', sequenceSchema);
