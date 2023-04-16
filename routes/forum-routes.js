const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const ForumThread = require("../model/forumThread");
const ForumReply = require("../model/forumReply");

router.post("/blog/forum", authMiddleware, async (req, res) => {
  const { title, body } = req.body;
  const author = req.user._id;

  try {
    const newThread = new ForumThread({
      title,
      body,
      author,
    });

    await newThread.save();

    res.status(201).json(newThread);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

router.post("/blog/forum/:id/reply", authMiddleware, async (req, res) => {
  const { body } = req.body;
  const author = req.user._id;
  const threadId = req.params.id;

  try {
    const newReply = new ForumReply({
      body,
      author,
      thread: threadId,
    });

    const thread = await ForumThread.findById(threadId);

    if (!thread) {
      return res.status(404).json({ msg: "Thread not found" });
    }

    thread.replies.push(newReply._id);

    await newReply.save();
    await thread.save();

    res.status(201).json(newReply);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
