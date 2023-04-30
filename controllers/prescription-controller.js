const express = require("express");
const Prescription = require("../model/Prescription");
const Patient = require("../model/Patient");
const Doctor = require("../model/Doctor");
const User = require("../model/User");
const Traitement = require("../model/Traitement");

const QRCode = require("qrcode-svg");

const createPrescription = async (req, res) => {
  const doctor = await Doctor.findOne({ user: req.body.doctor });
  const patient = await Patient.findById(req.body.patient);
  const userPatient = await User.findById(patient.user);
  console.log(doctor);
  try {
    const prescription = new Prescription({
      patient: patient,
      doctor: doctor,
      // instructions: req.body.instructions,
      traitement: req.body.traitement,
    });

    const doctorName = doctor.name;
    const doctorSpeciality = doctor.speciality;
    let traitementNames = "";
    for (let i = 0; i < req.body.traitement.length; i++) {
      const traitement = await Traitement.findById(req.body.traitement[i]);

      traitementNames += traitement.medicationName + ", ";
    }
    traitementNames = traitementNames.slice(0, -2);

    const content = `Doctor: ${doctorName}\n Speciality: ${doctorSpeciality}\nPatient: ${userPatient.lastname} ${userPatient.firstname}\nTraitement: ${traitementNames}`;

    const qrcode = new QRCode({
      content: content,
      padding: 4,
      width: 256,
      height: 256,
      color: "#000000",
      background: "#ffffff",
    });

    const svgString = qrcode.svg();
    prescription.qrCodeVerif = svgString;

    const savedPrescription = await prescription.save();

    res.status(201).json(savedPrescription);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find()
      .populate("patient")
      .populate("doctor")
      .exec();

    res.status(200).json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPrescriptionById = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate("patient")
      .populate("doctor")
      .populate("traitement")
      .exec();

    if (!prescription) {
      return res.status(404).json({ message: "Prescription not found" });
    }

    res.status(200).json(prescription);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updatePrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id);

    if (!prescription) {
      return res.status(404).json({ message: "Prescription not found" });
    }

    prescription.medicine = req.body.medicine;
    prescription.dosage = req.body.dosage;
    prescription.instructions = req.body.instructions;

    const savedPrescription = await prescription.save();

    res.status(200).json(savedPrescription);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deletePrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findByIdAndDelete(req.params.id);

    if (!prescription) {
      return res.status(404).json({ message: "Prescription not found" });
    }

    res.status(200).json({ message: "Prescription deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getPrescriptionsByPatientId = async (req, res) => {
  const patientId = req.params.id;
  console.log("patient id ", patientId);
  try {
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const prescriptions = await Prescription.find({
      patient: patientId,
    }).populate("doctor", "name email");
    console.log("prespvdfvdg", prescriptions);
    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = {
  createPrescription,
  getAllPrescriptions,
  getPrescriptionById,
  updatePrescription,
  deletePrescription,
  getPrescriptionsByPatientId,
};
