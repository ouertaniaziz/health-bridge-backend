const mongoose = require("mongoose");

const prescriptionSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },

  verified: {
    type: Boolean,
    required: true,
    default: false,
  },
  qrCodeVerif: {
    type: String,
    required: true,
  },

  traitement: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Traitement",
    },
  ],
});

const Prescription = mongoose.model("Prescription", prescriptionSchema);

module.exports = Prescription;
