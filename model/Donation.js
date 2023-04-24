const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  phone: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  donationtype: {
    type: String,
    enum: ["materials", "medications"],
    required: true,
  },
  materials: [{ type: mongoose.Schema.Types.ObjectId, ref: "Material" }],
  medications: [{ type: mongoose.Schema.Types.ObjectId, ref: "Medication" }],

});

const Donation = mongoose.model("Donation", donationSchema);

module.exports = Donation;
