const express = require('express');
const router = express.Router();
const controller = require('../controllers/donation-controller');

router.post('/donation/addDonation', controller.addDonationToUser);
router.get('/donation/analytics', controller.getDonationAnalytics);

module.exports = router;
