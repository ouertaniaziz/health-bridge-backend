const mongoose = require("mongoose");

const materialSchema = new mongoose.Schema({
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Donor",
    required: true,
  },
  materialname: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

const Material = mongoose.model("Material", materialSchema);

module.exports = Material;