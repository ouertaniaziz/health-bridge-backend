const mongoose = require("mongoose");

const recordschema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  filename: {
    type: String,
  },
  file: {
    type: String,
  },
});

const Record = mongoose.model("Record", recordschema);

module.exports = Record;
