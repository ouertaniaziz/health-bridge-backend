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
 };

// Get all medications
exports.getAllmedications = async (req, res) => {
  try {
    const donors = await Donor.find().populate('user');
    res.json(donors);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};


exports.getByNameMedication = async (req, res) => {
    const name = req.params.name;
    try {
      const medications = await medications.find({ name });
      res.json(materials);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  