const Location = require("../models/Location");

// 📌 Accessible à tous
exports.getLocations = async (req, res) => {
    try {
        const locations = await Location.find();
        res.json(locations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 📌 Admin seulement
exports.createLocation = async (req, res) => {
    try {
        const { city, address, contact, isPrimary } = req.body;

        if (isPrimary) {
            // mettre à jour les autres locations pour qu’elles ne soient pas primary
            await Location.updateMany({}, { isPrimary: false });
        }

        const location = new Location({ city, address, contact, isPrimary });
        await location.save();

        res.status(201).json(location);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateLocation = async (req, res) => {
    try {
        const { id } = req.params;
        const { city, address, contact, isPrimary } = req.body;

        if (isPrimary) {
            await Location.updateMany({}, { isPrimary: false });
        }

        const updated = await Location.findByIdAndUpdate(
            id,
            { city, address, contact, isPrimary },
            { new: true }
        );

        if (!updated) return res.status(404).json({ message: "Location non trouvée" });

        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteLocation = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Location.findByIdAndDelete(id);

        if (!deleted) return res.status(404).json({ message: "Location non trouvée" });

        res.json({ message: "Location supprimée avec succès" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
