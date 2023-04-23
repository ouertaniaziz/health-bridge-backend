const mongoose = require("mongoose");
const express = require("express");
const Patient = require("../model/Patient");
const Doctor = require("../model/Doctor");
const User = require("../model/User");

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
const get_patient_by_username = async (req, res) => {
  const username = req.body.username;
  console.log(req.body.username);

  try {
    const user = await User.findOne({ username: username });
    const patient = await Patient.findOne({ user: user._id });
    // console.log(patient);
    res.status(200).json({ user, patient });
    //console.log(user);
  } catch (error) {
    res.status(400).json({ status: "failed", message: error.message });
  }
};
const update_patient = async (req, res) => {
  try {
    const user = new User(req.body.user);
    
    const updated = await User.findOneAndUpdate(
      { _id: req.body.user._id },
      user,
      {
        new: true,
      }
    );
    
    console.log(updated);
    res.status(200).send('done');
  } catch (error) {
    res.status(400).json({ status: "failed", message: error.message });
  }
};

module.exports = { addPatient, get_patient_by_username, update_patient };
