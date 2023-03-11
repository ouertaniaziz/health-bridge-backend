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
router.post("/verify-email", controller.verifyEmail);
router.post("/forgot-password", controller.forgotPassword);
router.get("/reset-password/:id/:token ", controller.resetP);
router.post("/reset-password/:id/:token", controller.resetPassword);



module.exports = router;
