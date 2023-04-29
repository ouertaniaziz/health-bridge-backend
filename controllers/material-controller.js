const express = require("express");
const Material = require("../model/Material");
const Donor = require("../model/Donor");
const User = require("../model/User");


// Create a new material
//  exports.createMaterial = async (req, res) => {
//    try {
//      const { DonorId, donationDate, donationType } = req.body;
//      const donor = new Donor({
//       donor: DonorId,
//        donationDate,
//        donationType,
//      });
//      await donor.save();
//      res.status(201).json({ message: 'Donor created successfully', donor });
//    } catch (err) {
//      console.error(err);
//      res.status(500).json({ error: 'Server error' });
//    }
//  };

// Get all materials
const getAllMaterials = async (req, res) => {

  try {
    const materials = await Material.find();
    res.json(materials);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
                                                                 
};

const getByNameMaterial = async (req, res) => {

    const name = req.params.name;
    try {
      const materials = await Material.find({ name });
      res.json(materials);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }

  };

 module.exports = {
  getAllMaterials,
  getByNameMaterial
 }
