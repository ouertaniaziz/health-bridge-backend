const multer = require("multer");
const fs = require("fs");
const mongoose = require("mongoose");
const Blog = require("../model/Blog");

// Create storage engine for multer
const storage = multer.memoryStorage();

// Create multer instance with storage engine
const upload = multer({
  storage,
  limits: { fileSize: 1000000 }, // Limit file size to 1 MB
  fileFilter: function (req, file, cb) {
    // Only allow certain file types
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"));
    }
  },
});

const createBlog = async (req, res) => {
  const { title, content } = req.body;
  const author = req.user._id; // assuming the user is authenticated and the id is available in the request
  const image = {
    data: fs.readFileSync(req.file.path),
    contentType: req.file.mimetype,
  };

  try {
    const newBlog = await Blog.create({ title, content, author, image });
    res.status(201).json({ blog: newBlog });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create a new blog!" });
  }
};

const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate("author")
      .populate("comments.author")
      .exec();

    res.status(200).json({ blogs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch blogs!" });
  }
};

const getBlogById = async (req, res) => {
  const { blogId } = req.params;

  try {
    const blog = await Blog.findById(blogId)
      .populate("author")
      .populate("comments.author")
      .exec();

    if (!blog) {
      return res.status(404).json({ error: "Blog not found!" });
    }

    res.status(200).json({ blog });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch the blog!" });
  }
};

const updateBlogById = async (req, res) => {
  const { blogId } = req.params;
  const { title, content } = req.body;

  try {
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      { title, content },
      { new: true }
    );

    if (!blog) {
      return res.status(404).json({ error: "Blog not found!" });
    }

    res.status(200).json({ blog });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update the blog!" });
  }
};

const deleteBlogById = async (req, res) => {
  const { blogId } = req.params;

  try {
    const blog = await Blog.findByIdAndDelete(blogId);

    if (!blog) {
      return res.status(404).json({ error: "Blog not found!" });
    }

    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete the blog!" });
  }
};

const likePost = async (req, res) => {
  try {
    const { blogId } = req.params;
    const { userId } = req.body;

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found!" });
    }

    // Check if the user has already liked the post
    if (blog.likes.includes(userId)) {
      return res
        .status(400)
        .json({ error: "You have already liked this post!" });
    }

    // Check if the user has previously disliked the post
    if (blog.dislikes.includes(userId)) {
      blog.dislikes.pull(userId);
    }

    blog.likes.push(userId);
    await blog.save();

    res.status(200).json({ message: "Post liked successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to like post!" });
  }
};

const commentPost = async (req, res) => {
  try {
    const { blogId } = req.params;
    const { userId, text } = req.body;

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found!" });
    }

    const comment = {
      text,
      author: userId,
    };
    blog.comments.push(comment);
    await blog.save();

    res.status(200).json({ message: "Comment added successfully!", comment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add comment!" });
  }
};

const dislikePost = async (req, res) => {
  const blogId = req.params.blogId;
  const userId = req.user._id;

  try {
    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    const index = blog.likes.indexOf(userId);

    if (index > -1) {
      blog.likes.splice(index, 1);
    }

    const index2 = blog.dislikes.indexOf(userId);

    if (index2 > -1) {
      blog.dislikes.splice(index2, 1);
    } else {
      blog.dislikes.push(userId);
    }

    await blog.save();

    res.status(200).json({ blog });
  } catch (error) {
    res.status(500).json({ error: "Failed to dislike post" });
  }
};


module.exports = {
    createBlog,
    getAllBlogs,
    getBlogById,
    updateBlogById,
    deleteBlogById,
    likePost,
    commentPost,
    dislikePost
};