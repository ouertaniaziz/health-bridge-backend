const controller = require("../controllers/medication-controller");
const express = require("express");
const router = express.Router();

router.post(
  "/medications/addmedication",
  controller.addMedication
);
router.get("/medications", controller.getAllMedications);
router.get("/medications/:id", controller.getMedicationById);
router.put("/medications/:id", controller.updateMedication);
router.delete("/medications/:id", controller.deleteMedication);

module.exports = router;  


