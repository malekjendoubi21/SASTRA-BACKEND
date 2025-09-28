const express = require("express");
const router = express.Router();
const locationController = require("../controllers/locationController");
const { auth, adminOnly } = require("../middleware/auth");

// 📌 Accessible à tous
router.get("/", locationController.getLocations);

// 📌 Admin seulement
router.post("/", auth, adminOnly, locationController.createLocation);
router.put("/:id", auth, adminOnly, locationController.updateLocation);
router.delete("/:id", auth, adminOnly, locationController.deleteLocation);

module.exports = router;
