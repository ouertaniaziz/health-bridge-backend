const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create schema for failed login attempts
const FailedAttemptSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  time: {
    type: Date,
    required: true,
  },
});

const Failed = mongoose.model("Failed", FailedAttemptSchema);

module.exports = Failed;
