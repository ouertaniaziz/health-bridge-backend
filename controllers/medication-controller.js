const express = require("express");
const Medication = require("../model/Medication");
const Donor = require("../model/Donor");
const User = require("../model/User");



// Create a new medication
//  exports.createmedication = async (req, res) => {
//    try {
//      const { DonorId, donationDate, donationType } = req.body;
//     const donor = new Donor({
//       donor: DonorId,
//        donationDate,
//        donationType,
//     });
//      await donor.save();
//      res.status(201).json({ message: 'Donor created successfully', donor });
//    } catch (err) {
//      console.error(err);
//      res.status(500).json({ error: 'Server error' });
//    }
//  };

// Get all medications
const getAllmedications = async (req, res) => {
  try {
    const medications = await Medication.find();
    res.json(medications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

const getByNameMedication = async (req, res) => {
  const name = req.params.name;
  try {
    const medications = await Medication.find({ name });
    res.json(medications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const updateMedication = async (req, res) => {
  try {
    const updatedMedication = await Medication.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedMedication) {
      return res.status(404).send({ message: 'Medication not found' });
    }

    res.send(updatedMedication);
  } catch (error) {
    console.error(error);
  }
};

const deleteMedication = async (req, res) => {
  try {
    const medication = await Medication.findByIdAndDelete(req.params.id);

    if (!medication) {
      return res.status(404).json({ message: "medication not found" });
    }

    res.status(200).json({ message: "medication deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

  module.exports={
    getAllmedications,
    getByNameMedication,
    updateMedication,
    deleteMedication
  }
  