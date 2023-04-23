const express = require("express");
const router = express.Router();
const controller = require("../controllers/blog-controller");
const authenticate = require("../middleware/authenticate");
// const authenticateUser = require("../middleware/authenticateUser");
const multer = require("multer");

const storage = multer.memoryStorage();

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

router.post(
  "/blogs/addblog",
  authenticate,
  upload.single("image"),
  controller.createBlog
);

router.get("/blogs", controller.getAllBlogs);
router.get("/blogs/:id", controller.getBlogById);
router.put("/blogs/:id", controller.updateBlogById);
router.delete("/blogs/:id",  controller.deleteBlogById);
router.post("/blogs/:id/like",  controller.likePost);
router.post("/blogs/:id/dislike",  controller.dislikePost);
router.post("/blogs/:id/comment",  controller.commentPost);

module.exports = router;
