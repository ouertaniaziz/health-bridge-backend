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
router.post("/ForgetPassword", controller.ForgetPassword);
router.get("/ResetPassword/:token", controller.ResetPassword);
router.put('/resetpassword', controller.updatePassword)
// logout router
router.get("/logout", controller.logout);
module.exports = router;
