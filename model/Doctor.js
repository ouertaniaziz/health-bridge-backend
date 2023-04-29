const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  aboutMe: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  speciality: {
    type: String,
    enum: ["Carcinologist", "cardiologist", "Psychiatrist"],
    required: true,
  },
  patients: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
    },
  ],
  adminpolyclinic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "AdminPolyclinic",
  },
});

const Doctor = mongoose.model("Doctor", doctorSchema);

module.exports = Doctor;
