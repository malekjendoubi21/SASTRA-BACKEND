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

        console.log('Nominatim data:', JSON.stringify(data, null, 2)); // Debug log

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

        // Récupération du code postal avec plusieurs possibilités
        const postalCode = data && data.address && (
            data.address.postcode ||
            data.address.postal_code ||
            data.address.zipcode ||
            data.address['postal-code']
        );

        console.log('Extracted postal code:', postalCode); // Debug log

        // Nettoyer les doublons existants pour ce code postal avant d'enregistrer
        if (postalCode) {
            try {
                // Supprimer tous les documents avec ce code postal sauf le plus récent
                const duplicates = await RegionStat.find({ postalCode }).sort({ date: -1 });
                if (duplicates.length > 0) {
                    // Garder seulement le plus récent, supprimer les autres
                    const toDelete = duplicates.slice(1).map(doc => doc._id);
                    if (toDelete.length > 0) {
                        await RegionStat.deleteMany({ _id: { $in: toDelete } });
                        console.log(`Supprimé ${toDelete.length} doublons pour le code postal ${postalCode}`);
                    }
                    // Si un document existe déjà, ne pas en créer un nouveau
                    console.log('Code postal déjà enregistré, skipping:', postalCode);
                    return res.json({ success: true, message: "Localisation déjà enregistrée pour ce code postal" });
                }
            } catch (cleanupError) {
                console.error('Erreur lors du nettoyage des doublons:', cleanupError);
            }
        }

        // Sauvegarde en DB
        const stat = new RegionStat({
            region,
            city,
            country,
            latitude,
            longitude,
            vpnDetected: false, // TODO: Implémenter la détection VPN
            postalCode: postalCode || null,
            referrer: req.headers.referer || req.get('Referer') || 'Direct'
        });

        try {
            await stat.save();
        } catch (error) {
            if (error.code === 11000) { // Erreur de duplicata MongoDB
                console.log('Code postal déjà enregistré, skipping:', postalCode);
                return res.json({ success: true, message: "Localisation déjà enregistrée pour ce code postal" });
            }
            throw error; // Relancer l'erreur si ce n'est pas un duplicata
        }
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