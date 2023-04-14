const controller = require("../controllers/user-controller");
const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authjwt");

router.get("/profile", controller.logout);
module.exports = router;
