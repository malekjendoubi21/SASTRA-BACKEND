const mongoose = require("mongoose");

const partnerSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        logo: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            trim: true,
        },
        website: {
            type: String,
            trim: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Partner", partnerSchema);
