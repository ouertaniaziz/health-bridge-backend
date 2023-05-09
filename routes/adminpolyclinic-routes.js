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

router.get(
  "/polyclinics/patients/count",
  polyclinicController.getTotalPatients
);

router.get(
  "/polyclinics/doctors/count",
  polyclinicController.getTotalDoctors
);

router.get(
  "/polyclinics/prescriptions/declined/count",
  polyclinicController.getTotalDeclinedPrescriptions
);

router.get(
  "/polyclinics/prescriptions/approved/count",
  polyclinicController.getTotalApprovedPrescriptions
);

module.exports = router;
