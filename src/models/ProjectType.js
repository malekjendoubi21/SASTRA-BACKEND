// models/ProjectType.js
const mongoose = require("mongoose");

const projectTypeSchema = new mongoose.Schema(
    {
        label: { type: String, required: true, unique: true, trim: true }
    },
    { timestamps: true }
);

module.exports = mongoose.model("ProjectType", projectTypeSchema);
