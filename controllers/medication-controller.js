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
    const donors = await Donor.find().populate('user');
    res.json(donors);
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


  module.exports={
    getAllmedications,
    getByNameMedication

  }
  