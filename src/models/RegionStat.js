const mongoose = require('mongoose');

const regionStatSchema = new mongoose.Schema({
    region: { type: String, required: true },
    city: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    ip: { type: String },
    userAgent: { type: String },
    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("RegionStat", regionStatSchema);