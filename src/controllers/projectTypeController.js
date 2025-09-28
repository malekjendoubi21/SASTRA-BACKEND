const ProjectType = require("../models/ProjectType");

// Ajouter un type de projet
const createProjectType = async (req, res) => {
    try {
        const { label } = req.body;
        if (!label) return res.status(400).json({ message: "Label requis" });

        const exists = await ProjectType.findOne({ label });
        if (exists) return res.status(400).json({ message: "Type de projet existe déjà" });

        const projectType = new ProjectType({ label });
        await projectType.save();

        res.status(201).json({ success: true, data: projectType });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur serveur", error: error.message });
    }
};

// Lister les types de projet (accessible à tout le monde)
const getProjectTypes = async (req, res) => {
    try {
        const types = await ProjectType.find().sort({ createdAt: -1 });
        res.json({ success: true, data: types });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erreur serveur", error: error.message });
    }
};




const  deleteProjectType = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await ProjectType.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ message: "ProjectType non trouvé" });
        }
        res.json({ message: "ProjectType supprimé avec succès" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createProjectType, getProjectTypes , deleteProjectType};
