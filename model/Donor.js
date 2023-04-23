const mongoose = require("mongoose");

const donorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  donationtype: {
    type: String,
    enum: ["materials", "medications"],
    required: true,
  },
  address: { type: String, required: true },
  contact: { type: Number, required: true, unique: true },
  materials: [{ type: mongoose.Schema.Types.ObjectId, ref: "Material" }],
  medications: [{ type: mongoose.Schema.Types.ObjectId, ref: "Medication" }],
  materialname: {
    type: String,
  },
  state: {
    type: String,
  },
  quantity: {
    type: Number,
  },
  medicationname: {
    type: String,
  },
  validationPeriod: {
    type: Date,
  },
  numPackets: {
    type: Number,
  },
  description: {
    type: String,
  },
});

const Donor = mongoose.model("Donor", donorSchema);

module.exports = Donor;