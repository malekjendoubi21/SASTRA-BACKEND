const RegionStat = require('../models/RegionStat');

// 📍 Enregistrer la région de l'utilisateur
const trackLocation = async(req, res) => {
    try {
        const { latitude, longitude } = req.body;

        if (!latitude || !longitude) {
            return res.status(400).json({ message: "Coordonnées manquantes" });
        }

        // Appel API OpenStreetMap avec User-Agent pour éviter blocage
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`, {
                headers: {
                    'User-Agent': 'SastraBackend/1.0 (contact@tonemail.com)',
                    'Accept-Language': 'fr'
                }
            }
        );

        // Vérifie que la réponse est OK
        if (!response.ok) {
            console.error("Erreur API Nominatim :", response.status, response.statusText);
            return res.status(500).json({ message: "Erreur API localisation" });
        }

        const data = await response.json();

        const region =
            (data && data.address && data.address.state) ||
            (data && data.address && data.address.county) ||
            (data && data.address && data.address.region) ||
            "Inconnue";

        const city =
            (data && data.address && data.address.city) ||
            (data && data.address && data.address.town) ||
            (data && data.address && data.address.village) ||
            (data && data.address && data.address.hamlet) ||
            region; // fallback to region if no city

        const country =
            (data && data.address && data.address.country) ||
            "Inconnue";

        // Sauvegarde en DB
        const stat = new RegionStat({
            region,
            city,
            country,
            latitude,
            longitude,
            ip: req.ip || req.connection.remoteAddress,
            userAgent: req.get('User-Agent')
        });
        await stat.save();

        res.json({ success: true, region });
    } catch (error) {
        console.error("Erreur localisation:", error);
        res.status(500).json({ message: "Erreur lors de l'enregistrement" });
    }
};

// 📊 Récupérer les statistiques (pour le backoffice admin)
const getRegionStats = async(req, res) => {
    try {
        const stats = await RegionStat.aggregate([{
                $group: {
                    _id: "$region",
                    count: { $sum: 1 },
                    latitude: { $first: "$latitude" },
                    longitude: { $first: "$longitude" }
                }
            },
            { $sort: { count: -1 } },
        ]);

        res.json(stats);
    } catch (error) {
        console.error("Erreur récupération stats:", error);
        res.status(500).json({ message: "Erreur lors de la récupération", error });
    }
};

// 📊 Récupérer les statistiques par pays
const getCountryStats = async(req, res) => {
    try {
        const stats = await RegionStat.aggregate([{
                $group: {
                    _id: "$country",
                    count: { $sum: 1 },
                    latitude: { $first: "$latitude" },
                    longitude: { $first: "$longitude" }
                }
            },
            { $sort: { count: -1 } },
        ]);

        res.json(stats);
    } catch (error) {
        console.error("Erreur récupération stats pays:", error);
        res.status(500).json({ message: "Erreur lors de la récupération", error });
    }
};

// 📊 Récupérer les régions d'un pays spécifique
const getRegionsByCountry = async(req, res) => {
    try {
        const { country } = req.params;
        const stats = await RegionStat.aggregate([
            { $match: { country } },
            {
                $group: {
                    _id: "$region",
                    count: { $sum: 1 },
                    latitude: { $first: "$latitude" },
                    longitude: { $first: "$longitude" }
                }
            },
            { $sort: { count: -1 } },
        ]);

        res.json(stats);
    } catch (error) {
        console.error("Erreur récupération régions pays:", error);
        res.status(500).json({ message: "Erreur lors de la récupération", error });
    }
};

// 📍 Récupérer tous les points d'une région spécifique
const getRegionPoints = async(req, res) => {
    try {
        const { region } = req.params;
        const points = await RegionStat.find({ region }).select('-_id');
        res.json(points);
    } catch (error) {
        console.error("Erreur récupération points région:", error);
        res.status(500).json({ message: "Erreur lors de la récupération des points", error });
    }
};

// ✅ Export façon CommonJS
module.exports = {
    trackLocation,
    getRegionStats,
    getCountryStats,
    getRegionsByCountry,
    getRegionPoints
};