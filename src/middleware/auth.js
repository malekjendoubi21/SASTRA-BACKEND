const jwt = require('jsonwebtoken');

// Middleware d'authentification
const auth = (req, res, next) => {
    const token = req.headers["authorization"];
    if (!token) return res.status(401).json({ message: "Accès refusé, token manquant" });

    try {
        // On récupère le token après "Bearer "
        const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: "Token invalide" });
    }
};

// Middleware pour vérifier admin
const adminOnly = (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Utilisateur non authentifié" });

    if (req.user.typeUser !== 'admin') {
        return res.status(403).json({ message: 'Accès refusé: admin seulement' });
    }
    next();
};

module.exports = { auth, adminOnly };
