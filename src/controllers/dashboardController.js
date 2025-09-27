// ❌ pas besoin de node-fetch car Node 22 a fetch intégré
// const fetch = require("node-fetch");
const RegionStat = require('../models/RegionStat');

const trackLocation = async (req, res) => {
    try {
        const { latitude, longitude } = req.body;

        if (!latitude || !longitude) {
            return res.status(400).json({ message: "Coordonnées manquantes" });
        }

        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
        );
        const data = await response.json();

        const region =
            data?.address?.state ||
            data?.address?.county ||
            data?.address?.region ||
            "Inconnue";

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
        res.status(500).json({ message: "Erreur lors de la récupération", error });
    }
};


// ✅ Export façon CommonJS
module.exports = {
    trackLocation,
    getRegionStats
};
