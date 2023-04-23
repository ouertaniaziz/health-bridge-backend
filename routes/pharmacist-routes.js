
const express = require("express");
const router = express.Router();
const pharmacist = require("../controllers/pharmacist-controller");


router.get("/pharmacist/getpharmacist/:id", pharmacist.getpharmacist);
router.put("/pharmacist/updatepharmacist/:id",pharmacist.updatepharmacist );
router.post("/pharmacist/profile", pharmacist.getpharmacist); 
// router.delete("/pharmacist/deletepharmacist/:id", pharmacist.deletepharmacist);
// router.post("/pharmacist/addpharmacist", pharmacist.addpharmacist);

module.exports = router;