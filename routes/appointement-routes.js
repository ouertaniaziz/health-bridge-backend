
const express = require("express");
const router = express.Router();
const appointmentcontroller = require("../controllers/appointement-controller");


router.get("/appointement/getAll/:id", appointmentcontroller.get_appointment);
router.get("/appointement/:id", appointmentcontroller.get_one_appointment);
router.post("/appointement/:id", appointmentcontroller.appointment_create_post);
router.delete(
  "/appointement/delete/:id",
  appointmentcontroller.appointment_delete
);
router.put("/:appointement/id", appointmentcontroller.UpdateAppointement);

module.exports = router;
