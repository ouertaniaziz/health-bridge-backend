const express = require("express");
const router = express.Router();
const controller = require("../controllers/doctor-contoller");

router.delete(
  "/doctors/:doctorId/patients/:patientId",
  controller.removePatientFromDoctor
);
router.post("/doctor/profile", controller.getDoctor);

module.exports = router;
