const express = require("express");
const Donor = require("../model/Donor");
const Material =require('../model/Material');
const Medication = require('../model/Medication');
const nodemailer = require('nodemailer');

const addMedication = async (req, res) => {
  try {
    const donor = await Donor.findById(req.body.donor);

    const newMedication = new Medication({
      donor: donor,
      medicationname: req.body.medicationname,
      validationperiod: req.body.validationperiod,
      packetsname: req.body.packetsname,
      description: req.body.description,
    });

    await newMedication.save();

    donor.medications.push(newMedication);
    await donor.save();
    
    // send thank you email to the donor
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
      text: `Dear ${donor.name},\n\nThank you for your recent donation of ${newMedication.medicationname}. We appreciate your generosity and support in our mission to help those in need.\n\nBest regards,\nThe Donation Team`
    };

    transporter.sendMail(message, (error, info) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Failed to send email" });
      } else {
        console.log('Email sent: ' + info.response);
        return res.status(200).json({
          success: true,
          message: "Medication added to donor successfully",
        });
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


    
   
   
const addMaterial = async (req, res) => {
  
  const donor = await Donor.findById(req.body.donor);

try {

  const newmaterial = new Material({
    donor: donor,
    materialname: req.body.materialname,
    state: req.body.state,
    quantity: req.body.quantity,
   
  });
  await newmaterial.save();

  donor.materials.push(newmaterial);
  await donor.save();
  
    
    // add the material to the donor's material list
    donor.materials.push(newmaterial);
    await donor.save();
   
    
    return res.status(200).json({
      success: true,
      message: "Material added to donor successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
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
const getTotalDonors = async (req, res) => {
  try {
  const totalDonors = await Donor.countDocuments();
  return res.status(200).json({
  success: true,
  data: { totalDonors },
  });
  } catch (error) {
  return res.status(500).json({ success: false, message: error.message });
  }
  };
  const mostDonatedMaterial = async (req, res) => {
    try {
        const result = await Donor.aggregate([
            {
                $lookup: {
                    from: "materials",
                    localField: "_id",
                    foreignField: "donor",
                    as: "materials",
                },
            },
            {
                $unwind: "$materials",
            },
            {
                $match: { "materials.materialname": { $ne: "" } },
            },
            {
                $group: {
                    _id: "$materials.materialname",
                    totalDonated: { $sum: "$materials.quantity" },
                },
            },
            {
                $sort: { totalDonated: -1 },
            },
            {
                $limit: 1,
            },
        ]);

        console.log("Aggregate result:", result);

        const mostDonatedMaterial = result.length > 0 ? result[0]._id : "No donations yet";
        const totalDonated = result.length > 0 ? result[0].totalDonated : 0;

        return res.status(200).json({
            success: true,
            message: `The most donated material is ${mostDonatedMaterial} with a total count of ${totalDonated}.`,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

  

module.exports = {
  addMedication,
  getAllDonors,
  addMaterial,
  getTotalDonors,
  mostDonatedMaterial
 

 
};

    
  
