const mongoose = require('mongoose');

const regionStatSchema = new mongoose.Schema({
    region: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("RegionStat", regionStatSchema);
