const express = require("express");
const router = express.Router();
const {
    createContact,
    getAllContacts,
    deleteContact,
    updateContactResponse
} = require("../controllers/contactController");
const { auth, adminOnly } = require('../middleware/auth');


// 📩 POST contact (support anonyme → pas besoin d’auth)
router.post("/", createContact);

// 📊 GET all contacts (admin only)
router.get("/", auth, adminOnly, getAllContacts);

// ❌ DELETE contact (admin only)
router.delete("/:id", auth, adminOnly, deleteContact);

router.put("/:id/reponse", auth, adminOnly, updateContactResponse); // admin seulement

module.exports = router;
