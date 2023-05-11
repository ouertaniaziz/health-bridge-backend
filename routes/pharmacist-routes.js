
const express = require("express");
const router = express.Router();
const pharmacist = require("../controllers/pharmacist-controller");
const ocrmedicament=require("./../middleware/OCR_medicaments")

router.get("/pharmacist/getpharmacist/:id", pharmacist.getpharmacist);
router.put("/pharmacist/updatepharmacist/:id",pharmacist.updatepharmacist );
router.post("/pharmacist/profile", pharmacist.getpharmacist); 
// router.delete("/pharmacist/deletepharmacist/:id", pharmacist.deletepharmacist);
// router.post("/pharmacist/addpharmacist", pharmacist.addpharmacist);
router.post("/pharmacist/getmedicamentfromimage", ocrmedicament.getmedicament_from_image);
router.get("/pharmacist/getallprescriptions/:id",pharmacist.getPrescriptionListForPharmacistpart)
router.post("/pharmacist/addprescriptiontoPharmacist",pharmacist.addPharmacistToPrescription)
router.get("/pharmacist/getallmedicationsinstorage",pharmacist.getallmedicationsinstorage)
module.exports = router;