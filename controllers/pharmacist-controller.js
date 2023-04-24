const express = require("express");

const User = require("../model/User");
const Pharmacist = require("../model/Pharmacist");
const Medication = require("../model/Medication");


// const addpharmacist = async (req, res) => {
//   const pharmacistData = req.body;
  
//   try {
//     // Create new pharmacist in database
//     const newpharmacist = new Pharmacist(pharmacistData);
    


const getpharmacist = async (req, res) => {
  try {
    console.log(req.body);
    const pharmacist = await Pharmacist.findOne({ user: req.body.userId }).populate(
      "user"
    );
    console.log(pharmacist);
    if (!pharmacist) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ pharmacist, user: pharmacist.user });
  } catch (error) {}
};



        const updatepharmacist = async (req, res) => {
            try {
              const user = new User(req.body.user);
              
              const updated = await User.findOneAndUpdate(
                { _id: req.body.user._id },
                user,
                {
                  new: true,
                }
              );
              
              console.log(updated);
              res.status(200).send('done');
            } catch (error) {
              res.status(400).json({ status: "failed", message: error.message });
            }
          };




// const getMedicationfromPolyclique = async (req, res) => {
//     try {
//         console.log(req.body);
//         const Medication = await Medication.findOne({ user: req.body.userId }).populate(
//             "medication"
//         );
//         console.log(Medication);
//         if (!Medication) {
//             return res.status(404).json({ message: "medication not found " });
//         }
//         res.status(200).json({ Medication, user: Medication.user });
//     } catch (error) {}
// };

module.exports = { getpharmacist , updatepharmacist};
