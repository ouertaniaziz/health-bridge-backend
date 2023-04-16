const mongoose = require("mongoose");

const forumThreadSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
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
  replies: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ForumReply",
    },
  ],
});

module.exports = mongoose.model("ForumThread", forumThreadSchema);
