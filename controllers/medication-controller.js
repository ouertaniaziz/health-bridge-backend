const express = require('express');
const Medication = require('../model/Medication');

const addMedication = async (req, res) => {
    try {
      const medication = new Medication({
        donation: req.body.donation,
        medicationname: req.body.medicationname,
        validationPeriod: req.body.validationPeriod,
        numPackets: req.body.numPackets,
        description: req.body.description
      });
      const newMedication = await medication.save();
      res.status(201).json(newMedication);
    } catch (err) {
      res.status(400).json({ message: err.message });
      }
}; 

const getAllMedications = async (req, res) => {
  try {
    const medications = await Medication.find();
    res.json(medications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}

const updateMedication = async (req, res) => {
    try {
        const medication = await Medication.findByIdAndUpdate(
          req.params.id,
          req.body,
          { new: true }
        );
        if (!medication) {
          return res.status(404).json({ message: 'Medication not found' });
        }
        res.json(medication);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
      }
};

const getMedicationById = async (req, res) => {
    try {
        const medication = await Medication.findById(req.params.id);
        if (!medication) {
          return res.status(404).json({ message: 'Medication not found' });
        }
        res.json(medication);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
      }
}

const deleteMedication = async (req, res) => {
    try {
        const medication = await Medication.findByIdAndDelete(req.params.id);
        if (!medication) {
          return res.status(404).json({ message: 'Medication not found' });
        }
        res.json(medication);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
      }
}

module.exports = {
    addMedication,
    getAllMedications,
    getMedicationById,
    updateMedication,
    deleteMedication
}