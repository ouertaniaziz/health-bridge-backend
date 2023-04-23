const mongoose = require("mongoose");

const pharmacistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  
  pharmacie: {
    type: String,
  },
  insuranceInformation: {
    type: String,
  },
  medications: {
    type: String,
  },

  StreetAddress :{
    type: String,
  },
    City :{
    type: String,
    },
 


});

const Pharmacist = mongoose.model("Pharmacist", pharmacistSchema);

module.exports = Pharmacist;
