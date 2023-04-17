const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const dislikeSchema = new Schema({
  post: { type: Schema.Types.ObjectId, ref: "Post" },
  user: { type: Schema.Types.ObjectId, ref: "User" },
});

const Dislike = mongoose.model("Dislike", dislikeSchema);

module.exports = Dislike;