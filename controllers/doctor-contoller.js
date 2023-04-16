const express = require("express");
const Patient = require("../model/Patient");
const Doctor = require("../model/Doctor");

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

module.exports = removePatientFromDoctor;
