const express = require("express");
const router = express.Router();
const patient = require("../controllers/patient-controller");
const ocr = require("./../middleware/mindee");
const uploadfile = require("./../middleware/uploadfilespatient");
const chat = require("./../middleware/chatgpt");
const controller=require('./../controllers/user-controller')
router.post("/addpatient", patient.addPatient);
router.post("/patient/getpatient", patient.get_patient_by_username);
router.put("/patient/updatepatient", patient.update_patient);
router.post("/patient/cin", ocr.getcin_from_image);
router.post("/patient/addfiles", uploadfile.uploadfilepatient);
router.post("/patient/chat", chat.chatgpt);
router.get("/patient/facelogin", controller.login_face);

router.post("/patient/", (req, res) => {
  console.log("triggered");
  res.send("hello world!");
});
module.exports = router;
