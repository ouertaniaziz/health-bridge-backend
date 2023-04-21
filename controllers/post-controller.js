const express = require("express");
const Post = require("../model/Post");
const upload = require("../middleware/upload");

const createpost = async (req, res) => {
        upload.single("image") // handle the image upload
        try {
          const { title, content } = req.body;
          const imagePath = req.file ? req.file.path : "";

          const post = new Post({
            title,
            content,
            image: imagePath,
          });

          await post.save();

          res.json({ message: "Post created successfully", post });
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: "Server error" });
        };
      
};

const getposts = async (req, res) => {
    try {
      const posts = await Post.find();
      res.json(posts);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
};

const updatePost = async (req, res) => {
    upload.single('image') // handle the image upload
    try {
      const { title, content } = req.body;
      const postId = req.params.id;
      const imagePath = req.file ? req.file.path : '';

      const post = await Post.findById(postId);

      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      post.title = title;
      post.content = content;
      post.image = imagePath || post.image;

      await post.save();

      res.json({ message: 'Post updated successfully', post });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    };
};

const deletePost = async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (post) {
        await post.remove();
        res.json({ message: "Post deleted" });
      } else {
        res.status(404).json({ message: "Post not found" });
      }
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
};

module.exports = {
    createpost,
    getposts,
    updatePost,
    deletePost
}