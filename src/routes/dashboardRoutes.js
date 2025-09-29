const express = require('express');

const {
    trackLocation,
    getRegionStats,
    getRegionPoints
} = require('../controllers/dashboardController');
const router = express.Router();

router.post("/track-location", trackLocation);   // côté user (frontend)
router.get("/region-stats", getRegionStats);     // côté admin (backoffice)
router.get("/region-points/:region", getRegionPoints); // côté admin (backoffice)

module.exports = router;
