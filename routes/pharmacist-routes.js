import Pharmacist from "../model/Pharmacist";
import User from "../model/User";
import Medication from "../model/Medication";

const express = require("express");
const router = express.Router();
const controller = require("../controllers/pharmacist-contoller");

router.delete(
  "/pharmacist/:pharmacistId/medication/:medicationId",
  controller.removeMedicationFromPharmacist
);
router.post("/pharmacist/profile", controller.getPharmacist);
router.post("/addpharmacist", pharmacist);

module.exports = router;
