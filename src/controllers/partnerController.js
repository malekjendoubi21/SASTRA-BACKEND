const Partner = require("../models/Partner");

// 📌 Accessible à tous
const getPartners = async (req, res) => {
    try {
        const partners = await Partner.find();
        res.json(partners);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 📌 Admin uniquement
const createPartner = async (req, res) => {
    try {
        const { name, logo, description, website } = req.body;

        const partner = new Partner({ name, logo, description, website });
        await partner.save();

        res.status(201).json(partner);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updatePartner = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, logo, description, website } = req.body;

        const updated = await Partner.findByIdAndUpdate(
            id,
            { name, logo, description, website },
            { new: true }
        );

        if (!updated) return res.status(404).json({ message: "Partenaire non trouvé" });

        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deletePartner = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Partner.findByIdAndDelete(id);

        if (!deleted) return res.status(404).json({ message: "Partenaire non trouvé" });

        res.json({ message: "Partenaire supprimé avec succès" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getPartners,
    createPartner,
    updatePartner,
    deletePartner,
};
