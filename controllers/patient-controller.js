const mongoose = require("mongoose");
const express = require("express");
const Patient = require("../model/Patient");
const Doctor = require("../model/Doctor");

const addPatient = async (req, res) => {
  const patientData = req.body;

  try {
    // Create new patient in database
    const newPatient = new Patient(patientData);

    if (!mongoose.Types.ObjectId.isValid(patientData.user)) {
      throw new Error("Invalid user ID");
    }

    if (!mongoose.Types.ObjectId.isValid(patientData.doctor)) {
      throw new Error("Invalid doctor ID");
    }

    newPatient.user = mongoose.Types.ObjectId(patientData.user);
    newPatient.doctor = mongoose.Types.ObjectId(patientData.doctor);
    await newPatient.save();

    // Find doctor with matching speciality
    const doctor = await Doctor.findOne({
      speciality: patientData.speciality,
    });

    if (doctor) {
      // Add patient to doctor's list of patients
      doctor.patients.push(newPatient);
      await doctor.save();

      res.status(201).json({ message: "Patient added and assigned to doctor" });
    } else {
      res
        .status(400)
        .json({ message: "No doctor found with matching speciality" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = addPatient;
