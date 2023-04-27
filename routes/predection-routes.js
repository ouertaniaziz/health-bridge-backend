const predectionControllerr = require("../controllers/predection-controller");
const express = require("express");
const router = express.Router();

router.post(
  "/predict",

  predectionControllerr.prediction
);

module.exports = router;
