const express = require("express");
const router = express.Router();
const controller = require("../controllers/blog-controller");
const authenticateUser = require("../middleware/authenticateUser");
const multer = require("multer");

// Create a storage instance with desired options
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

// Define multer upload settings
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

// Create a new blog
router.post(
  "/blogs/addblog",
  authenticateUser,
  upload.single("image"),
  controller.createBlog
);

// Get all blogs
router.get("/blogs", controller.getAllBlogs);

// Get a blog by ID
router.get("/blogs/:id", controller.getBlogById);

// Update a blog by ID
router.put("/blogs/:id", authenticateUser, controller.updateBlogById);

// Delete a blog by ID
router.delete("/blogs/:id", authenticateUser, controller.deleteBlogById);

// Like a blog
router.post("/blogs/:id/like", authenticateUser, controller.likePost);

// Dislike a blog
router.post("/blogs/:id/dislike", authenticateUser, controller.dislikePost);

// Comment on a blog

router.post("/blogs/:id/comment", authenticateUser, controller.commentPost);

module.exports = router;
