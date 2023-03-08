const mongoose = require("mongoose");

const Role = Object.freeze({
  Patient: "patient",
  Doctor: "doctor",
  Pharmacist: "pharmacist",
  AdminPolyclinc: "adminpolyclinic",
  Admin: "admin",
});

const Speciality = Object.freeze({
  Carcinologist: "carcino",
  Cardiologist: "cardiologist",
  Psychiatrist: "psychiatrist",
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  firstname: String,
  lastname: String,
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: String,
  gender: {
    type: String,
    enum: ["Male", "Female"],
  },
  phone: String,
  state: String,
  street: String,
  creationDate: Date,
  status: {
    type: String,
    enum: ["Pending", "Active", "Inactive"],
    default: "Pending",
  },
  role: {
    type: String,
    enum: Object.values(Role),
  },

  speciality: {
    type: String,
    enum: Object.values(Speciality),
  },
  isVerified:{
    type:Boolean,
    default:false
  },
  emailtoken:{
    type:String
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
