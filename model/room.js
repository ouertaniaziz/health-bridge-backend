const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  name: String,
});



const Room = mongoose.model("Room", roomSchema);

module.exports = Room;