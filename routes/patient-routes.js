const express = require("express");
const router = express.Router();
const patient = require("../controllers/patient-controller");
const ocr = require("./../middleware/mindee");
const uploadfile = require("./../middleware/uploadfilespatient");
router.post("/addpatient", patient.addPatient);
router.post("/patient/getpatient", patient.get_patient_by_username);
router.put("/patient/updatepatient", patient.update_patient);
router.post("/patient/cin", ocr.getcin_from_image);
router.post("/patient/addfiles",uploadfile.uploadfilepatient);
router.get("")
module.exports = router;
