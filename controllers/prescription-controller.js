const express = require("express");
const Prescription = require("../model/Prescription");
const Patient = require("../model/Patient");
const Doctor = require("../model/Doctor");
const createPrescription = async (req, res) => {
  const doctor = await Doctor.findById(req.body.doctor);
  const patient = await Patient.findById(req.body.patient);
  try {
    console.log(doctor);
    const prescription = new Prescription({
      patient: patient,
      doctor: doctor,
      instructions: req.body.instructions,
      traitement: req.body.traitement,
    });
    console.log(prescription);
    const savedPrescription = await prescription.save();
    console.log(savedPrescription);
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


// const getPrescriptionById = async (req, res) => {
//   try {
//     const prescription = await Prescription.findById(req.params.id)
//       .populate("patient")
//       .populate("doctor")
//       .exec();

// const getPrescriptionById = async (req, res) => {
//   try {
//     const prescription = await Prescription.findById(req.params.id)
//       .populate("patient")
//       .populate("doctor")
//       .exec();

//     if (!prescription) {
//       return res.status(404).json({ message: "Prescription not found" });
//     }

//     res.status(200).json(prescription);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };


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

module.exports = {
    createPrescription,
    getAllPrescriptions,
    // findPrescriptionById,
    updatePrescription,
    deletePrescription,
}