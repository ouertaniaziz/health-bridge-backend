const express = require("express");
const router = express.Router();
const prescriptionController = require("../controllers/prescription-controller");
// const authorize = require("../middleware/authorize");

// create prescription endpoint with authorization for doctor role
router.post(
  "/prescription",
  // authorize(["doctor"]),
  prescriptionController.createPrescription
);

// get all prescriptions endpoint with authorization for multiple roles
router.get(
  "/prescription",
  // authorize(["doctor", "patient", "pharmacist", "adminpolyclinic", "admin"]),
  prescriptionController.getAllPrescriptions
);

// get prescription by ID endpoint with authorization for multiple roles
router.get(
  "/prescription/:id",
  // authorize(["doctor", "patient", "pharmacist", "adminpolyclinic", "admin"]),
  prescriptionController.getPrescriptionById
);

// update prescription endpoint with authorization for doctor role
router.put(
  "/prescription/:id",
  // authorize(["doctor"]),
  prescriptionController.updatePrescription
);

// delete prescription endpoint with authorization for doctor role
router.delete(
  "/prescription/:id",
  // authorize(["doctor"]),
  prescriptionController.deletePrescription
);
router.get(
  "/prescription/:id/patients",
  prescriptionController.getPrescriptionsByPatientId
);

module.exports = router;
