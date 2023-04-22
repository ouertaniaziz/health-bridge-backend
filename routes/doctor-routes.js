const express = require("express");
const router = express.Router();
const controller = require("../controllers/doctor-contoller");
const { verifyToken } = require("../middleware/authjwt");

router.get("/profile", controller.getDoctor);
router.delete(
  "/doctors/:doctorId/patients/:patientId",
  controller.removePatientFromDoctor
);
module.exports = router;
