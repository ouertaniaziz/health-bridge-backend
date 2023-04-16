const express = require("express");
const router = express.Router();
const Prescription = require("../model/Prescription");

// Create a new prescription
router.post("/addprescription", async (req, res) => {
  try {
    const { doctor, patient, medication, dosage, frequency, startDate, endDate, createdAt } = req.body;
    const prescription = await Prescription.create({
      doctor,
      patient,
      medication,
      dosage,
      frequency,
      startDate,
      endDate,
      createdAt
    });
    res.json(prescription);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all prescriptions
router.get("/rescriptions", async (req, res) => {
  try {
    const prescriptions = await Prescription.find();
    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a prescription
router.patch("/updateprescription/:id", async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.params.id);
    const { medication, dosage, frequency } = req.body;
    if (medication) {
      prescription.medication = medication;
    }
    if (dosage) {
      prescription.dosage = dosage;
    }
    if (frequency) {
      prescription.frequency = frequency;
    }
    await prescription.save();
    res.json(prescription);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a prescription
router.delete("/deleteprescription/:id", async (req, res) => {
  try {
    await Prescription.findByIdAndDelete(req.params.id);
    res.json({ message: "Prescription deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
