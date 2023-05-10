const mongoose = require("mongoose");

const adminpolyclinicSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  doctors: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
    },
  ],
  patients: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
    },
  ],
  location: {
    type: String,
    enum: ["Tunis Polyclinic", "Sousse Polyclinic", "Sfax Polyclinic"],
    required: true,
  },
  prescriptions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Precription",
    },
  ],
});

const AdminPolyclinic = mongoose.model(
  "AdminPolyclinic",
  adminpolyclinicSchema
);

module.exports = AdminPolyclinic;
