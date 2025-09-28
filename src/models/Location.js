const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema(
    {
        city: {
            type: String,
            required: true,
            trim: true,
        },
        address: {
            type: String,
            required: true,
            trim: true,
        },
        contact: {
            type: String,
            required: true,
            trim: true,
        },
        isPrimary: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Location", locationSchema);
