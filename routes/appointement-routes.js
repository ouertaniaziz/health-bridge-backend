const express = require("express");
const router = express.Router();
const AppointmentController = require("../controllers/appointement-controller");

// GET all appointments
router.get("/appointments", AppointmentController.getAppointments);

// GET appointment by ID
router.get("/appointments/:id", AppointmentController.getAppointmentById);

// POST create new appointment
router.post("/appointments/add", AppointmentController.createAppointment);

// PUT update appointment
router.put("/appointments/:id", AppointmentController.updateAppointment);
router.get(
  "/appointments/doctor/:doctorId",
  AppointmentController.getAppointmentsByDoctorId
);

// DELETE appointment
router.delete("/appointments/:id", AppointmentController.deleteAppointment);

module.exports = router;
