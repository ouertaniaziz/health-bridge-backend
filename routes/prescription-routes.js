const express = require("express");
const router = express.Router();
const prescriptionController = require("../controllers/prescription-controller");
// const authorize = require("../middleware/authorize");


router.post(
  "/",
  // authorize(["doctor"]),
  prescriptionController.createPrescription
);

router.get(
  "/",
  // authorize(["doctor", "patient", "pharmacist", "adminpolyclinic", "admin"]),
  prescriptionController.getAllPrescriptions
);


router.get(
  "/:id",
  // authorize(["doctor", "patient", "pharmacist", "adminpolyclinic", "admin"]),
  prescriptionController.getPrescriptionById
);


router.put(
  "/:id",
  // authorize(["doctor"]),
  prescriptionController.updatePrescription
);


router.delete(
  "/:id",
  // authorize(["doctor"]),
  prescriptionController.deletePrescription
);

module.exports = router;
