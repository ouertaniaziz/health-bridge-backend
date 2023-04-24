const mongoose = require("mongoose");

const adminpolyclinicSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  polyname: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  medicalRecords: {
    type: String,
  },
  prescriptions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Prescription",
    },
  ],
});

const AdminPolyclinic = mongoose.model(
  "AdminPolyclinic",
  adminpolyclinicSchema
);

module.exports = AdminPolyclinic;
