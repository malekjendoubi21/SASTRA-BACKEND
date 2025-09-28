const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
        },
        phone: {
            type: String,
            required: true,
            trim: true
        },
        subject: {
            type: String,
            required: true,
            trim: true
        },
        message: {
            type: String,
            required: true,
            trim: true
        },
        projectType: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ProjectType",
            required: true
        },
        reponse: {
            type: String,
            trim: true,
            default: ""
        }

    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Contact", contactSchema);
