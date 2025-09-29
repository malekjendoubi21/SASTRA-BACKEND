const express = require('express');

const {
    trackLocation,
    getRegionStats,
    getCountryStats,
    getRegionsByCountry,
    getRegionPoints
} = require('../controllers/dashboardController');
const router = express.Router();

router.post("/track-location", trackLocation); // côté user (frontend)
router.get("/country-stats", getCountryStats); // côté admin (backoffice)
router.get("/regions-by-country/:country", getRegionsByCountry); // côté admin (backoffice)
router.get("/region-stats", getRegionStats); // côté admin (backoffice)
router.get("/region-points/:region", getRegionPoints); // côté admin (backoffice)

module.exports = router;