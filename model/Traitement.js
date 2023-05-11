const mongoose = require("mongoose");

const traitementSchema = new mongoose.Schema({
  medicationName: {
    type: String,
  },
  manufacturer: {
    type: String,
    required: true,
  },
  dosageForm: {
    type: String,
    required: true,
  },
  dosageStrength: {
    type: String,
    required: true,
  },
  validationPeriod: {
    type: Date,
    required: true,
  },
  expirationDate: {
    type: Date,
    required: true,
  },
  prescriptionRequired: {
    type: Boolean,
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

const Traitement = mongoose.model("Traitement", traitementSchema);

module.exports = Traitement;
