const express = require("express");
const Donor = require("../model/Donor");
const Material =require('../model/Material');
const Medication = require('../model/Medication');
const nodemailer = require('nodemailer');

const addMedication = async (req, res) => {
  try {
   

    // check if the donor exists
    const donor = await Donor.findById(req.body.donor);
    if (!donor) {
      return res.status(404).json({ message: 'Donor not found' });
    }

    // create a new medication
    const medication = new Medication({
        donor: donor,
        medicationname: req.body.medicationname,
        validationperiod: req.body.validationperiod,
        packtesname: req.body.packtesname,
        description: req.body.description 
      });
    await medication.save();

    // add the medication to the donor's medication list
    donor.medications.push(medication);
    await donor.save();

     // envoi de l'email de remerciement
     const transporter = nodemailer.createTransport({
      service: 'esprit',
      auth: {
        user: 'farah.kasraoui@esprit.tn',
        pass: '213JMT8132'
      }
    });

    const message = {
      from: 'farah.kasraoui@esprit.tn',
      to: donor.email,
      subject: 'Thank you for your donation',
      text: 'Dear ' + donor.name + ',\n\nThank you for your recent donation of ' + medication.medicationname + '. We appreciate your generosity and support in our mission to help those in need.\n\nBest regards,\nThe Donation Team'
    };

    transporter.sendMail(message, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

    res.status(201).json({ medication, message: 'Medication added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
const addMaterial = async (req, res) => {
  try {
    
    // check if the donor exists
    const donor = await Donor.findById(req.body.donor);
    if (!donor) {
      return res.status(404).json({ message: 'Donor not found' });
    }

    // create a new material
    const material = new Material({
      donor: donor,
      materialname: req.body.materialname,
      quantity: req.body.quantity,
      state: req.body.state,
    });
    await material.save();

    // add the material to the donor's material list
    donor.materials.push(material);
    await donor.save();
    const transporter = nodemailer.createTransport({
      service: 'esprit',
      auth: {
        user: 'farah.kasraoui@esprit.tn',
        pass: '213JMT8132'
      }
    });

    const message = {
      from: 'farah.kasraoui@esprit.tn',
      to: donor.email,
      subject: 'Thank you for your donation',
      text: 'Dear ' + donor.name + ',\n\nThank you for your recent donation of ' + material.materialname + '. We appreciate your generosity and support in our mission to help those in need.\n\nBest regards,\nThe Donation Team'
    };

    transporter.sendMail(message, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });


    res.status(201).json({ material, message: 'Material added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


const getAllDonors = async (req, res) => {
  try {
    const donors = await Donor.find().populate('user');
    res.json(donors);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

module.exports = {
  addMedication,
  getAllDonors,
  addMaterial
};

    
  
