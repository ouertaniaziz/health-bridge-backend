const express = require("express");
const router = express.Router();
const polyclinicController = require("../controllers/adminpolyclinic-controller");

router.delete(
  "/polyclinics/:id/patients/:patientId",
  polyclinicController.removePatientFromPolyclinic
);

router.delete(
  "/polyclinics/:id/doctors/:doctorId",
  polyclinicController.removeDoctorFromPolyclinic
);

router.get(
  "/polyclinics/location/:location",
  polyclinicController.getPolyclinicByLocation
);

router.get("/polyclinics", polyclinicController.getAllPolyclinics);

router.get(
  "/polyclinics/:id/prescriptions/:prescriptionId",
  polyclinicController.getPrescriptionsForPolyclinic
);

router.get(
  "/polyclinics/:id/dashboard",
  polyclinicController.getPolyclinicDashboardStats
);
router.get(
  "/polyclinics/prescriptions",
  polyclinicController.getAllPrescriptionsPolyclinic
);
router.post(
  "/polyclinics/approveprescription",
  polyclinicController.approvePrescription
);
router.post(
  "/polyclinics/declineprescription",
  polyclinicController.declinePrescription
);

module.exports = router;
