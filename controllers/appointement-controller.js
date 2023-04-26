const Appointment = require("../model/Appointment");
const express = require("express");
const Patient = require("../model/Patient");
const Doctor = require("../model/Doctor");
const User = require("../model/User");

// CREATE
const createAppointment = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.body.doctorId);
    const patient = await Patient.findOne({ user: req.body.patientId });
   
    const { date, time, reason } = req.body;
    const appointment = new Appointment({
      patient,
      doctor,
      date,
      time,
      reason,
    });
    await appointment.save();
    res
      .status(201)
      .json({ message: "Appointment created successfully!", appointment });
  } catch (error) {
    res.status(500).json({ error: "Appointment creation failed!" });
  }
};
const getAppointmentsByDoctorId = async (req, res) => {
  try {
    const doctorId = req.params.doctorId;
    const user = await User.findById(doctorId);

    const doctor = await Doctor.findOne({ user: user._id });
    const appointments = await Appointment.find({ doctor: doctor });
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ error: "Error getting appointments!" });
  }
};
// READ
const getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find().populate("patient doctor");
    res.status(200).json({ appointments });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch appointments!" });
  }
};

const getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findById(id).populate(
      "patient doctor"
    );
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found!" });
    }
    res.status(200).json({ appointment });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch appointment!" });
  }
};

// UPDATE
const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { patient, doctor, date, time, reason } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { patient, doctor, date, time, reason },
      { new: true }
    );
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found!" });
    }
    res
      .status(200)
      .json({ message: "Appointment updated successfully!", appointment });
  } catch (error) {
    res.status(500).json({ error: "Failed to update appointment!" });
  }
};

// DELETE
const deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findByIdAndDelete(id);
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found!" });
    }
    res.status(200).json({ message: "Appointment deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete appointment!" });
  }
};

module.exports = {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
  getAppointmentsByDoctorId,
};
