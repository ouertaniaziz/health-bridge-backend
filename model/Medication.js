const mongoose = require("mongoose");

const medicationSchema = new mongoose.Schema({
  // donor: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "Donor",
  // },
  donation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Donation",
    required: true,
  },
  medicationname: {
    type: String,
    required: true,
  },
  validationPeriod: {
    type: String,
    required: true,
  },
  numPackets: {
    type: Number,
    required: true,
  },
  description: {
    type: String
  },
});

const Medication = mongoose.model("Medication", medicationSchema);

module.exports = Medication;