const express = require("express");
const Patient = require("../model/Patient");
const Doctor = require("../model/Doctor");
const User = require("../model/User");

const removePatientFromDoctor = async (req, res) => {
  const { doctorId, patientId } = req.params;

  try {
    // Find the doctor and patient
    const doctor = await Doctor.findById(doctorId);
    const patient = await Patient.findById(patientId);

    if (!doctor || !patient) {
      return res.status(404).json({ message: "Doctor or patient not found" });
    }

    // Remove the patient from the doctor's list
    doctor.patients = doctor.patients.filter((p) => p.toString() !== patientId);

    // Save the updated doctor object
    await doctor.save();

    res.json({ message: "Patient removed from doctor's list" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getDoctor = async (req, res) => {
  try {
    console.log("hey i m here");
    console.log(req.body);
    const doctor = await Doctor.findOne({ user: req.body.userId }).populate(
      "user"
    );
    console.log(doctor);
    if (!doctor) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ doctor, user: doctor.user });
  } catch (error) {}
};
const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find().populate("user");
    res.status(200).json(doctors);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};

module.exports = { removePatientFromDoctor, getDoctor, getAllDoctors };
