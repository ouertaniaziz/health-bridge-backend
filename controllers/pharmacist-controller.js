const express = require("express");

const User = require("../model/User");
const Pharmacist = require("../model/Pharmacist");
const Patient = require("../model/Patient");


 

const getpharmacist = async (req, res) => {
  try {
    console.log(req.body);
    const Pharmacist = await Pharmacist.findOne({ user: req.body.userId }).populate(
      "user"
    );
    console.log(Pharmacist);
    if (!Pharmacist) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ Pharmacist, user: Pharmacist.user });
  } catch (error) {}
};



const getMedicationfromPolyclique = async (req, res) => {
    try {
        console.log(req.body);
        const Medication = await Medication.findOne({ user: req.body.userId }).populate(
            "medication"
        );
        console.log(Medication);
        if (!Medication) {
            return res.status(404).json({ message: "medication not found " });
        }
        res.status(200).json({ Medication, user: Medication.user });
    } catch (error) {}
};

module.exports = {  getMedication , getPharmacist};
