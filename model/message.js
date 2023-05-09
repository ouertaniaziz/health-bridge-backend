const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  message: String,
  author: String,
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
  },
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
