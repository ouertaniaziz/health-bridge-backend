var express = require("express");
const appointmentcontroller = require("../controllers/appointement-controller");

var router = express.Router();

router.get("/appointement/getAll/:id", appointmentcontroller.get_appointment);
router.get("/appointement/:id", appointmentcontroller.get_one_appointment);
router.post("/appointement/:id", appointmentcontroller.appointment_create_post);
router.delete("/appointement/delete/:id", appointmentcontroller.appointment_delete);
router.put("/:appointement/id", appointmentcontroller.UpdateAppointement);


module.exports = router;
