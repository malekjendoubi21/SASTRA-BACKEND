const express = require("express");
const router = express.Router();
const { auth, adminOnly } = require("../middleware/auth");
const {
    getPartners,
    createPartner,
    updatePartner,
    deletePartner,
} = require("../controllers/partnerController");

// 📌 Accessible à tous (pas besoin de connexion)
router.get("/", getPartners);

// 📌 Admin uniquement
router.post("/", auth, adminOnly, createPartner);
router.put("/:id", auth, adminOnly, updatePartner);
router.delete("/:id", auth, adminOnly, deletePartner);

module.exports = router;
