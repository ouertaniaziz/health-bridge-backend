const express = require("express");
const router = express.Router();
const controller = require('../controllers/admincpolyclinic-controller');

router.get("/polyclinic/prescription/:id", controller.getPrescriptionsForPolyclinic);

module.exports = router;