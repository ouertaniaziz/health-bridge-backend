const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Donor = require('../model/Donor');
const Material = require("../model/Material");
const Medication = require("../model/Medication");
const express = require("express");


const signup = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const donor = new Donor({
      name: req.body.name,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      password: hashedPassword,
      address: req.body.address,
      donationtype: req.body.donationtype,
      contact: req.body.contact,
      medications: req.body.medications,
      materials: req.body.materials
    });

    if (req.body.donationtype === "materials") {
      const material = new Material({
        donor: donor._id,
        materialname: req.body.materialname,
        state: req.body.state,
        quantity: req.body.quantity,
      });

      await material.save();
      donor.materials.push(material);
    }

    if (req.body.donationtype === "medications") {
      const medication = new Medication({
        donor: donor._id,
        medicationname: req.body.medicationname,
        validationPeriod: req.body.validationPeriod,
        numPackets: req.body.numPackets,
        description: req.body.description,
      });

      await medication.save();
      donor.medications.push(medication);
    }

    await donor.save();

    res.status(201).json({ message: "donor created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const donor = await Donor.findOne({ email: req.body.email });
    console.log(donor);
    if (!donor) {
      return res.status(404).json({ message: "donor not found" });
    }

    const passwordIsValid = await bcrypt.compare(
      req.body.password,
      donor.password
    );
    if (!passwordIsValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign({ id: donor.id }, process.env.SECRET, {
      expiresIn: process.env.JWT_EXPIRE_IN,
    });
    res.status(200).json({
      accessToken: token,
      name: donor.name,
      contact: donor.contact,
      donationtype: donor.donationtype,
      message: "OK",
      expiresIn: process.env.JWT_EXPIRE_IN
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};

const logout = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; // Get JWT token from Authorization header
    await jwt.verify(token, process.env.SECRET); // Verify JWT token

    // If JWT is valid, send a success response
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error(error);
    // If JWT is invalid or missing, send an error response
    return res.status(401).json({ message: "Unauthorized" });
  }
};

const getMaterialsByDonationType = async (req, res) => {
  try {
    const materials = await Material.find()
      .populate({
        path: "donor",
        select: "firstname",
        match: { donationtype: req.params.donationtype },
      })
      .exec();

    res.status(200).json(materials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMedicationsByDonationType = async (req, res) => {
  try {
    const medications = await Medication.find()
      .populate({
        path: "donor",
        select: "name",
        match: { donationtype: req.params.donationType },
      })
      .exec();

    res.status(200).json(medications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
    signup,
    login,
    logout,
    getMaterialsByDonationType,
    getMedicationsByDonationType
};
