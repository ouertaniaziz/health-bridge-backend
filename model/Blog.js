const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    image: {
      data: Buffer,
      contentType: String,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor",
      },
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient",
      },
    ],
    dislikes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor",
      },
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient",
      },
    ],
    comments: [
      {
        text: {
          type: String,
          required: true,
        },
        author: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        likes: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
        ],
        dislikes: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
        ],
      },
    ],
  },
);

const Blog = mongoose.model("Blog", blogSchema);
