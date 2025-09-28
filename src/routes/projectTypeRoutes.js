const express = require("express");
const router = express.Router();
const {
    createProjectType,
    getProjectTypes, deleteProjectType
} = require("../controllers/projectTypeController");

const { auth, adminOnly } = require('../middleware/auth');

// ➕ Créer un type de projet (admin only)
router.post("/", auth, adminOnly, createProjectType);



// ➕ delete un type de projet (admin only)
router.delete("/:id", auth, adminOnly, deleteProjectType);

// 📋 Lister tous les types de projets (accessible à tous)
router.get("/", getProjectTypes);

module.exports = router;

