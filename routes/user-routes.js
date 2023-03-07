const verifysignup = require("../middleware/verifysignup");
const controller = require("../controllers/user-controller");
const express = require("express");

const router = express.Router();

router.post(
  "/signup",
  [verifysignup.checkDuplicateUsernameOrEmail],
  controller.signup
);

router.post("/login", controller.login);

module.exports = router;
