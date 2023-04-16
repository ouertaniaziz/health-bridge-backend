const express = require("express");
const router = express.Router();
const controller = require("../controllers/doctor-controller");
const { verifyToken } = require("../middleware/authjwt");

router.get("/profile", controller.getDoctor);
module.exports = router;
