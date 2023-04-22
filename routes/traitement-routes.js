const express = require("express");
const router = express.Router();
const medicationController = require("../controllers/traitement-controller");

router.post("/medications", medicationController.createMedication);

router.get("/medications", medicationController.getAllMedications);

router.get("/medications/:id", medicationController.getMedicationById);

router.put("/medications/:id", medicationController.updateMedication);

router.delete("/medications/:id", medicationController.deleteMedication);

module.exports = router;
