const verifysignup = require("../middleware/verifysignup");
const controller = require("../controllers/user-controller");
const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authjwt");

router.post(
  "/signup",
  [verifysignup.checkDuplicateUsernameOrEmail],
  controller.signup
);

router.post("/login", controller.login);
router.post("/verify-email", controller.verifyEmail, verifyToken);
// router.post("/real_time", controller.email_real_time);
router.post("/ResetPassword", controller.ResetPassword);
router.put("/UpdatePassword/:email", controller.UpdatePassword);
router.post("/facelogin", controller.login_face);
// logout router
router.post("/logout", controller.logout);
module.exports = router;
