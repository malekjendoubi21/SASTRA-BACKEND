const mongoose = require('mongoose');

const regionStatSchema = new mongoose.Schema({
    region: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    vpnDetected: { type: Boolean, default: false },
    postalCode: { type: String, unique: true, sparse: true },
    referrer: { type: String },
    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("RegionStat", regionStatSchema);