const express = require("express");
const router = express.Router();
const controller =require('../controllers/medication-controller')


// create medication
//  router.post('/donation/postmedication',controller.createmedication)
// get medication
router.get('/donation/getallmedications',controller.getAllmedications);
// get medication by name
router.get('/donation/getmedbyname/:name',controller.getByNameMedication);
router.put('/donation/medication/:id', controller.updateMedication);
router.delete(
    "/donation/medication/:id",
   controller.deleteMedication
  );
module.exports = router;