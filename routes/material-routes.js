const express = require("express");
const router = express.Router();
const controller=require('../controllers/material-controller')


// create a material
//  router.post('/donation/postmaterial',controller.createMaterial)
//get material
router.get('/donation/getmaterials',controller.getAllMaterials)
// get material by name
router.get('/donation/getmaterialbyname',controller.getByNameMaterial)