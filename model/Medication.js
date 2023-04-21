const mongoose = require("mongoose");

const medicationSchema = new mongoose.Schema({
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Donor",
    required: true,
  },
  medicationname: {
    type: String,
    required: true,
  },
  validationPeriod: {
    type: Date,
    required: true,
  },
  numPackets: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const Medication = mongoose.model("Medication", medicationSchema);

module.exports = Medication;