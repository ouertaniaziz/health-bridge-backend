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
  role: {
    type: String,
    enum: Object.values(Role),
  },

  speciality: {
    type: String,
    enum: Object.values(Speciality),
  },
  emailtoken:{
    type:String
  },
  resetPasswordToken:{
    type:String
  }
  // failedAttempts:{
  //   count :{
  //     type:Number,
  //     default:0
  //   },
  //   time:{
  //     type:Date,
  //     default:Date.now()
  //   }
  // }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
