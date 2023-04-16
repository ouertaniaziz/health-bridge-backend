const mongoose = require("mongoose");

const forumReplySchema = new mongoose.Schema({
  body: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  thread: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ForumThread",
    required: true,
  },
});

module.exports = mongoose.model("ForumReply", forumReplySchema);
