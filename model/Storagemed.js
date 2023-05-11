const mongoose = require("mongoose");

const storagemed = new mongoose.Schema({
  medicationname: {
    type: String,
  },
  Dosage:{
    type:String,
  },
  Dateofmanufacture: {
  type:Date},
  ExpireDate: {
    type: Date,
  },
  numPackets: {
    type: Number,
  },

});

const Storagemed = mongoose.model("Storagemed", storagemed);

module.exports = Storagemed;