const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  appointmentDate: {
    type: Date,
  },
  medicalHistory: {
    type: String,
  },
  medications: {
    type: String,
  },

  symptoms: {
    type: String,
  },
  testResults: {
    type: String,
  },
});
const Patient = mongoose.model("Patient", patientSchema);

module.exports = Patient;

