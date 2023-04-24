 const mongoose = require("mongoose");

 
const prescriptionSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },

  instructions: {
    type: String,
    required: false,
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
