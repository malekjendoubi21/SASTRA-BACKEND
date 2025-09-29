const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// Register
exports.register = async(req, res) => {
    try {
        const { nom, prenom, mail, motDePasse, age, numeroTelephone, adresse, region, ville, latitude, longitude } = req.body;

        // Vérifier si l'email existe déjà
        const existingUser = await User.findOne({ mail });
        if (existingUser) return res.status(400).json({ message: "Email déjà utilisé" });

        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hash(motDePasse, 10);

        const newUser = new User({
            nom,
            prenom,
            mail,
            motDePasse: hashedPassword,
            age,
            numeroTelephone,
            adresse,
            region,
            ville,
            latitude,
            longitude
        });

        await newUser.save();

        res.status(201).json({ message: "Utilisateur créé avec succès" });
    } catch (err) {
        res.status(500).json({ message: "Erreur serveur", error: err.message });
    }
};

// Login
exports.login = async(req, res) => {
    try {
        const { mail, motDePasse } = req.body;

        const user = await User.findOne({ mail });
        if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

        const isPasswordValid = await bcrypt.compare(motDePasse, user.motDePasse);
        if (!isPasswordValid) return res.status(400).json({ message: "Mot de passe incorrect" });

        // Générer un token
        const token = jwt.sign({ id: user._id, mail: user.mail, typeUser: user.typeUser }, // <-- ici
            process.env.JWT_SECRET, { expiresIn: "1h" }
        );

        res.json({ message: "Connexion réussie", token, typeUser: user.typeUser });
    } catch (err) {
        res.status(500).json({ message: "Erreur serveur", error: err.message });
    }
};

// Profile (protégé par JWT)
exports.profile = async(req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-motDePasse");
        if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Erreur serveur", error: err.message });
    }
};
// Mot de passe oublié (envoie un code)
exports.forgotPasswordCode = async(req, res) => {
    try {
        const { mail } = req.body;
        const user = await User.findOne({ mail });
        if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

        // Générer un code à 6 chiffres
        const code = Math.floor(100000 + Math.random() * 900000).toString();

        user.resetPasswordCode = code;
        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
        await user.save();

        // Envoyer email avec le code
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.mail,
            subject: 'Code de réinitialisation du mot de passe',
            text: `Ton code de réinitialisation est : ${code}. Il expire dans 15 minutes.`
        };

        await transporter.sendMail(mailOptions);

        res.json({ message: "Code de réinitialisation envoyé par email" });
    } catch (err) {
        res.status(500).json({ message: "Erreur serveur", error: err.message });
    }
};

// Réinitialiser mot de passe avec code
exports.resetPasswordWithCode = async(req, res) => {
    try {
        const { mail, code, nouveauMotDePasse } = req.body;

        const user = await User.findOne({
            mail,
            resetPasswordCode: code,
            resetPasswordExpires: { $gt: Date.now() }
        });
        if (!user) return res.status(400).json({ message: "Code invalide ou expiré" });

        // Hasher le nouveau mot de passe
        user.motDePasse = await bcrypt.hash(nouveauMotDePasse, 10);
        user.resetPasswordCode = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.json({ message: "Mot de passe réinitialisé avec succès" });
    } catch (err) {
        res.status(500).json({ message: "Erreur serveur", error: err.message });
    }
};
// Middleware pour récupérer l'utilisateur depuis le JWT
// Assurez-vous d'avoir un middleware authMiddleware.js avec verifyToken

// Update mot de passe (user connecté)
exports.updatePassword = async(req, res) => {
    try {
        const { ancienMotDePasse, nouveauMotDePasse } = req.body;

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

        const isOldPasswordValid = await bcrypt.compare(ancienMotDePasse, user.motDePasse);
        if (!isOldPasswordValid) return res.status(400).json({ message: "Ancien mot de passe incorrect" });

        user.motDePasse = await bcrypt.hash(nouveauMotDePasse, 10);
        await user.save();

        res.json({ message: "Mot de passe mis à jour avec succès" });
    } catch (err) {
        res.status(500).json({ message: "Erreur serveur", error: err.message });
    }
};

// Update profil (user connecté, sans mot de passe)
exports.updateProfile = async(req, res) => {
    try {
        const { nom, prenom, age, numeroTelephone, adresse, region, ville } = req.body;

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

        // Mettre à jour uniquement les champs fournis
        if (nom) user.nom = nom;
        if (prenom) user.prenom = prenom;
        if (age) user.age = age;
        if (numeroTelephone) user.numeroTelephone = numeroTelephone;
        if (adresse) user.adresse = adresse;
        if (region) user.region = region;
        if (ville) user.ville = ville;

        await user.save();

        res.json({ message: "Profil mis à jour avec succès", user: user });
    } catch (err) {
        res.status(500).json({ message: "Erreur serveur", error: err.message });
    }
};