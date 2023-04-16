const express = require("express");
const Patient = require("../model/Patient");
const Doctor = require("../model/Doctor");

const addPatient = async (res, req) => {
     const patientData = req.body;

     try {
       // Create new patient in database
       const newPatient = new Patient(patientData);
       await newPatient.save();

       // Find doctor with matching speciality
       const doctor = await Doctor.findOne({
         speciality: patientData.speciality,
       });

       if (doctor) {
         // Add patient to doctor's list of patients
         doctor.patients.push(newPatient);
         await doctor.save();

         res
           .status(201)
           .json({ message: "Patient added and assigned to doctor" });
       } else {
         res
           .status(400)
           .json({ message: "No doctor found with matching speciality" });
       }
     } catch (error) {
       res.status(500).json({ message: error.message });
     }
};

module.exports = addPatient;