const express = require("express");
const router = express.Router();
const controller = require("../controllers/donor-controller");



// Create a new donor
router.post('/donation/addMedication', controller.addMedication);

// Get all donors
router.post('/donation/addMaterial', controller.addMaterial);

router.get('/donation', controller.getAllDonors);
router.get('/donation/totaldonors',controller.getTotalDonors);
router.get('/donation/MostDonatedMaterial',controller.mostDonatedMaterial)

module.exports = router;