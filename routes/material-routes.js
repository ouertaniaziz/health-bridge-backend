const controller = require("../controllers/material-controller");
const express = require("express");
const router = express.Router();

router.post(
  "/materials/addMaterial",
  controller.addMaterial
);
router.get("/materials", controller.getAllMaterials);
router.get("/materials/:id", controller.getMaterialById);
router.put("/materials/:id", controller.updateMaterial);
router.delete("/materials/:id", controller.deleteMaterial);

module.exports = router;  


