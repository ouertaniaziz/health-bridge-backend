const express = require("express");
const Prescription = require("../model/Prescription");

const createPrescription = async (req, res) => {
  try {
    const prescription = new Prescription({
      patient: req.body.patientId,
      doctor: req.body.doctorId,
      medicine: req.body.medicine,
      dosage: req.body.dosage,
      instructions: req.body.instructions,
    });

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

// const findPrescriptionById = async (id) => {
//   try {
//     const prescription = await Prescription.findById(id);
//     return prescription;
//   } catch (error) {
//     console.error(error);
//     throw new Error('Error finding prescription');
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