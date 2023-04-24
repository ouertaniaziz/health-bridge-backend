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
  },
  cin: {
    type: String,
  },
  cinverified: {
    type: Boolean,
    default: false,
  },
  appointmentDate: {
    type: Date,
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
  insuranceInformation: {
    type: String,
  },
  bloodGroup: {
    type: String,
  },
  
});

const Patient = mongoose.model("Patient", patientSchema);
module.exports = Patient;
