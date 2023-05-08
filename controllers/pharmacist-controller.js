const express = require("express");

const User = require("../model/User");
const Pharmacist = require("../model/Pharmacist");
const Medication = require("../model/Medication");
const Prescription = require("../model/Prescription");
const Storagemed = require("../model/Storagemed");


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

const getAllPrescriptionsPharmacist = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({
      Polyclinicstatus: "Approved",
    })
      .populate({
        path: "patient",
        select: "_id cin",
        populate: {
          path: "user",
          select: "firstname lastname _id",
        },
      })
      .populate({
        path: "doctor",
        select: "_id",
        populate: {
          path: "user",
          select: "firstname lastname _id",
        },
      })
      .populate("traitement")
      .exec();

    const modifiedPrescriptions = prescriptions.map((prescription) => ({
      _id: prescription._id,
      patient: {
        _id: prescription.patient._id,
        username: prescription.patient.user.username,
        cin: prescription.patient.cin,
        firstname: prescription.patient.user.firstname,
        lastname: prescription.patient.user.lastname,
      },
      doctor: {
        _id: prescription.doctor._id,
        firstname: prescription.doctor.user.firstname,
        lastname: prescription.doctor.user.lastname,
      },
      traitement:prescription.traitement,
      date: prescription.date,
    }));

    res.status(200).json(modifiedPrescriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addPharmacistToPrescription = async (req, res) => {
  try {
    const prescription = await Prescription.findById(req.body.prescription);
    const existingPharmacist = await Pharmacist.findOne({
      user: req.body.user,
    }); 

    if (!existingPharmacist) {
      return res
        .status(404)
        .json({ success: false, message: "Pharmacist not found" });
    }

    prescription.pharmacists.push(existingPharmacist);
    await prescription.save();

    return res.status(200).json({ success: true, prescription });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
const getPrescriptionListForPharmacistpart = async (req, res) => {
  try {
    const id =req.params.id
    const pharmacist=await Pharmacist.findOne({user:id})
    const prescriptions = await Prescription.find({
      Polyclinicstatus: "Approved",
    })
      .populate({
        path: "patient",
        select: "_id cin",
        populate: {
          path: "user",
          select: "firstname lastname _id",
        },
      })
      .populate({
        path: "doctor",
        select: "_id",
        populate: {
          path: "user",
          select: "firstname lastname _id",
        },
      })
      .populate("traitement")
      .exec();
    const Mapped = prescriptions.filter((prescription) => {
      return !prescription.pharmacists.includes(pharmacist._id);

    });
    console.log(Mapped);
    const modifiedPrescriptions = Mapped.map((prescription) => ({
      _id: prescription._id,
      patient: {
        _id: prescription.patient._id,
        cin: prescription.patient.cin,
        firstname: prescription.patient.user.firstname,
        lastname: prescription.patient.user.lastname,
      },
      doctor: {
        _id: prescription.doctor._id,
        firstname: prescription.doctor.user.firstname,
        lastname: prescription.doctor.user.lastname,
      },
      traitement: prescription.traitement,
      date: prescription.date,
    }));

    res.status(200).json(modifiedPrescriptions);
   
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getallmedicationsinstorage=async(req,res)=>{
try{
  const storage=await Storagemed.find();
    res.status(200).json({storage})
  
  
}catch(error){
res.status(404).json({ message: error.message });
}
}
module.exports = { getpharmacist , updatepharmacist,getAllPrescriptionsPharmacist,getPrescriptionListForPharmacistpart,addPharmacistToPrescription,getallmedicationsinstorage};
