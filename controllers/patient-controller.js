const mongoose = require("mongoose");
const express = require("express");
const Patient = require("../model/Patient");
const Doctor = require("../model/Doctor");
const User = require("../model/User");
const formData = require("form-data");
const Prescription = require("../model/Prescription");

const Mailgun = require("mailgun.js");
const Record = require("../model/Record");
const Appointment = require("../model/Appointment");
const mailgun = new Mailgun(formData);

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
    const records = await Record.find({ patient: user._id });
    console.log(patient);
    res.status(200).json({ user, patient, records });
    console.log("user", user, "patient", patient);
    //console.log(user);
  } catch (error) {
    res.status(400).json({ status: "failed", message: error.message });
  }
};
const update_patient = async (req, res) => {
  try {
    console.log(req.body.usera);
    console.log(req.body);

    const val = await email_real_time(req, res);
    console.log(val.result);
    if (val.result === "deliverable") {
      const {
        firstname,
        lastname,
        phone,
        email,
        city,
        postal_code,
        gender,
        state,
      } = req.body.usera;

      const updated = await User.findOneAndUpdate(
        { _id: req.body.usera._id },
        {
          $set: {
            firstname,
            lastname,
            phone,
            email,
            city,
            postal_code,
            gender,
            state,
          },
        },

        {
          new: true,
        }
      );
      res.status(200).send();
    } else {
      res.status(400).send();
    }
  } catch (error) {
    res.status(404).json({ status: "failed", message: error.message });
  }
};

const client = mailgun.client({
  username: "api",
  key: "5c207d5bd8e7882951176d1558e4477a-b36d2969-c41d7190" || "",
});
const email_real_time = async (req, res) => {
  try {
    const validationRes = await client.validate.get(req.body.usera.email);
    console.log(req.body);

    console.log("validationRes", validationRes);
    return validationRes;
    res.send(validationRes);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: error.message });
  }
};

const getmedicalrecordsnames = async (req, res) => {
  try {
    const user = await User.findById(req.body._id);
    const patient = await Patient.find({ user: user._id });

    console.log(patient);
  } catch (error) {}
};

const getnumberpharmacist = async (req, res) => {
  try {
    const patient = await Patient.findOne({ user: req.params.id });
    const prescriptions = await Prescription.find({
      patient: patient._id,
    });
    console.log(prescriptions.length);
    res.status(200).json({ number: prescriptions.length });
  } catch (error) {
    res.send(error.message);
  }
};
const getstats = async (req, res) => {
  try {
    const patient = await Patient.findOne({ user: req.params.id });
    //number total of prescriptions

    const prescriptionstotal = await Prescription.find({
      patient: patient._id,
    });
    //prescriptions approved

    const prescriptions = await Prescription.find({
      patient: patient._id,
      Polyclinicstatus: "Approved",
    });
    //appointments
    const appointments = await Appointment.find({
      patient: patient._id,
      status: "Scheduled",
    });
    //medical records
    const records = await Record.find({ patient: req.params.id });
    //result
    let totalofprescription = prescriptionstotal.length;
    let approvedprescriptions = prescriptions ? prescriptions.length : 0;
    let appointmentsnumber = appointments.length;
    let medicalnumber = records.length;
    //res.status(200).json({ approvedprescriptions });
    res.status(200).json({
      totalofprescription,
      approvedprescriptions,
      appointmentsnumber,
      medicalnumber,
    });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};
const numberofappointments = async (req, res) => {
  try {
    const patient = await Patient.findOne({ user: req.params.id });

    const appointments = await Appointment.find({
      patient: patient._id,
      status: "Scheduled",
    });
    //const x = appointments ? appointments.length : 0;

    res.status(200).json({ number: appointments.length });
  } catch (error) {
    res.send(error.message);
  }
};
const numberofmedicalrecords = async (req, res) => {
  try {
    const records = await Record.find({ patient: req.params.id });
    res.status(200).json({ number: records.length });
  } catch (error) {
    res.status(400).send();
  }
};
module.exports = {
  addPatient,
  get_patient_by_username,
  update_patient,
  email_real_time,
  getmedicalrecordsnames,
  getnumberpharmacist,
  numberofappointments,
  numberofmedicalrecords,
  getstats,
};
