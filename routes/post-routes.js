const post = require("../controllers/post-controller");
const express = require("express");
const router = express.Router();

router.post('/addpost', post.createpost);
router.get('/getposts', post.getposts);
router.put('/updatepost/:id', post.updatePost);
router.delete('/deletepost/:id', post.deletePost);

module.exports = router;