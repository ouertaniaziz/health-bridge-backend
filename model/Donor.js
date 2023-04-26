const mongoose = require("mongoose");


const donorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  donationDate: {
    type: Date,
  
  },
  description: {
    type: Date,
  
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
