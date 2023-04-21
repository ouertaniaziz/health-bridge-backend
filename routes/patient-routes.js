const express = require("express");
const router = express.Router();
const patient = require("../controllers/patient-controller");

router.post("/addpatient", patient);

module.exports = router;
