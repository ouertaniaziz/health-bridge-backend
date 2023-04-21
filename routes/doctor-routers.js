const express = require("express");
const router = express.Router();
const doctor = require("../controllers/doctor-contoller");

router.delete("/doctors/:doctorId/patients/:patientId", doctor);

module.exports = router;
