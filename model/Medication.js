const mongoose = require("mongoose");


const medicationSchema = new mongoose.Schema({
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Donor",
    },

    medicationname: {
      type: String,
      required: true,
    },
    validationperiod: {
      type: Number,
      required: true,
    },
      packetsname: {
        type: Number,
        required: true,
      },
      description: {
        type: Number,
        required: true,
      },
      
    
  });
  const Medication = mongoose.model("Medication", medicationSchema);
  module.exports = Medication;