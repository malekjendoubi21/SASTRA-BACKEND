const express = require('express');

const {
    trackLocation,
    getRegionStats
} = require('../controllers/dashboardController');
const router = express.Router();

router.post("/track-location", trackLocation);   // côté user (frontend)
router.get("/region-stats", getRegionStats);     // côté admin (backoffice)

module.exports = router;
