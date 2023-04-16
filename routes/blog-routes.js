const express = require("express");
const router = express.Router();
const Blog = require("../model/Blog");
const getBlog = require("../middleware/getBlog")
const multer = require("multer");


const DIR = "./public/";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(" ").join("-");
    cb(null, uuidv4() + "-" + fileName);
  },
});

var upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
    }
  },
});


// Get all blogs
router.get("/blogs", async (req, res) => {
  try {
    const blogs = await Blog.find().populate("author", "name"); // populate author field with name field of user document
    res.status(200).json(blogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new blog
router.post("/addblog", upload.single('profileImg'), async (req, res) => {
  const blog = new Blog({
    _id: new mongoose.Types.ObjectId(),
    title: req.body.title,
    content: req.body.description,
    author: req.body.author,
    picture: url + "/public/" + req.file.filename,
  });
  try {
    const newBlog = await blog.save();
    res.status(201).json(newBlog);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get a single blog by id
router.get("/getblog/:id", getBlog, (req, res) => {
  res.json(res.blog);
});

// Update a blog by id
router.patch("/updateblog/:id", getBlog, async (req, res) => {
  if (req.body.title != null) {
    res.blog.title = req.body.title;
  }
  if (req.body.content != null) {
    res.blog.content = req.body.content;
  }
  try {
    const updatedBlog = await res.blog.save();
    res.json(updatedBlog);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a blog by id
router.delete("/deleteblog/:id", getBlog, async (req, res) => {
  try {
    await res.blog.remove();
    res.json({ message: "Blog deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
