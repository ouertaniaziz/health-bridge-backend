const verifysignup = require("../middleware/verifysignup");
const donorcontroller = require("../controllers/donor-controller");
const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authjwt");

router.post(
  "/donor/signup",
 
  donorcontroller.signup
);

router.post("/donor/login", donorcontroller.login, verifyToken);
router.post("/donor/logout", donorcontroller.logout);
router.get(
  "/donor/materials/:donationtype",
  donorcontroller.getMaterialsByDonationType
);
router.get(
  "/donor/medications/:donationtype",
  donorcontroller.getMedicationsByDonationType
);

module.exports = router;
