const mongoose = require("mongoose");

const donationTypeEnum = Object.freeze({
  Materials: "materials",
  Medications: "medications",
  Money: "donationAmount",
});

const donorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  donationDate: {
    type: Date,
  
  },
  donationType: {
    type: String,
    enum: Object.values(donationTypeEnum),
   
  },
  materials: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Material",
    },
  ],
  medications: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Medication",
    },
  ],
});



const Donor = mongoose.model("Donor", donorSchema);
module.exports = Donor;
