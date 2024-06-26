const verifysignup = require("../middleware/verifysignup");
const controller = require("../controllers/user-controller");
const express = require("express");
const { verifyToken } = require("../middleware/authjwt");
const router = express.Router();

router.post(
  "/signup",
  [verifysignup.checkDuplicateUsernameOrEmail],
  controller.signup
);

router.post("/login", controller.login);
router.post("/verify-email", controller.verifyEmail, verifyToken);
router.post("/forgot-password", controller.forgotPassword, verifyToken);
router.get("/reset-password/:token", controller.verifyLink, verifyToken);
router.get("/reset-password/:token", controller.updatePassword, verifyToken);
// logout router
router.post("/logout", controller.logout, verifyToken);

module.exports = router;
