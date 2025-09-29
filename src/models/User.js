const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true,
        trim: true
    },
    prenom: {
        type: String,
        required: true,
        trim: true
    },
    mail: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Email non valide']
    },
    motDePasse: {
        type: String,
        required: true,
        minlength: 6
    },
    age: {
        type: Number,
        min: 0
    },
    numeroTelephone: {
        type: String,
        match: [/^\d{8,15}$/, 'Numéro de téléphone invalide']
    },
    adresse: {
        type: String,
        trim: true
    },
    region: {
        type: String,
        trim: true
    },
    ville: {
        type: String,
        trim: true
    },
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    },
    resetPasswordCode: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    },
    typeUser: {
        type: String,
        enum: ['user', 'admin'], // valeurs possibles
        default: 'user' // par défaut
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);