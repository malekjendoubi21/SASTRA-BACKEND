const RegionStat = require('../models/RegionStat');

// 📍 Enregistrer la région de l'utilisateur
const trackLocation = async (req, res) => {
    try {
        const { latitude, longitude } = req.body;

        if (!latitude || !longitude) {
            return res.status(400).json({ message: "Coordonnées manquantes" });
        }

        // Appel API OpenStreetMap avec User-Agent pour éviter blocage
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
            {
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
            data?.address?.state ||
            data?.address?.county ||
            data?.address?.region ||
            "Inconnue";

        // Sauvegarde en DB
        const stat = new RegionStat({ region, latitude, longitude });
        await stat.save();

        res.json({ success: true, region });
    } catch (error) {
        console.error("Erreur localisation:", error);
        res.status(500).json({ message: "Erreur lors de l'enregistrement" });
    }
};

// 📊 Récupérer les statistiques (pour le backoffice admin)
const getRegionStats = async (req, res) => {
    try {
        const stats = await RegionStat.aggregate([
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
        console.error("Erreur récupération stats:", error);
        res.status(500).json({ message: "Erreur lors de la récupération", error });
    }
};

// ✅ Export façon CommonJS
module.exports = {
    trackLocation,
    getRegionStats
};
