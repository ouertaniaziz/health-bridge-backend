const express = require("express");
const router = express.Router();
const prescriptionController = require("../controllers/prescription-controller");
// const authorize = require("../middleware/authorize");


router.post(
  "/prescription/addPrescription",
  // authorize(["doctor"]),
  prescriptionController.createPrescription
);

router.get(
  "/prescription",
  // authorize(["doctor", "patient", "pharmacist", "adminpolyclinic", "admin"]),
  prescriptionController.getAllPrescriptions
);


router.get(
  "/prescription/:id",
  // authorize(["doctor", "patient", "pharmacist", "adminpolyclinic", "admin"]),
  prescriptionController.getPrescriptionById
);


router.put(
  "/prescription/:id",
  // authorize(["doctor"]),
  prescriptionController.updatePrescription
);


router.delete(
  "/prescription/:id",
  // authorize(["doctor"]),
  prescriptionController.deletePrescription
);

module.exports = router;
