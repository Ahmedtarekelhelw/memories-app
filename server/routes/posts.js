const router = require("express").Router();
const {
  getPosts,
  getPost,
  createPost,
  deletePost,
  updatePost,
  likePost,
  getPostBySearch,
  commentPost,
  getPostsByCreator,
} = require("../controllers/posts");
const { auth } = require("../middleware/auth");

router.route("/").get(getPosts).post(auth, createPost);
router.get("/search", getPostBySearch);
router.get("/:id", getPost);
router.delete("/:id", auth, deletePost);
router.patch("/:id", auth, updatePost);
router.patch("/:id/likePost", auth, likePost);
router.patch("/:id/comment", auth, commentPost);
router.get("/creator/:name", getPostsByCreator);

module.exports = router;
