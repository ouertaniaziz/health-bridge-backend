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
router.post("/send_recovery_email", (req, res) => {
  controller.sendRecoveryEmail(req.body)
    .then((response) => res.send(response.message))
    .catch((error) => res.status(500).send(error.message));
});
// logout router
router.post("/logout", controller.logout, verifyToken);

module.exports = router;
