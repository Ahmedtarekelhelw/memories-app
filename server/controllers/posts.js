const mongoose = require("mongoose");
const Post = require("../model/post");
const User = require("../model/user");

const getPosts = async (req, res, next) => {
  const { page } = req.query; // this retrun string
  try {
    const LIMIT = 6;
    const startIndex = (Number(page) - 1) * LIMIT;
    const total = await Post.countDocuments();
    const posts = await Post.find()
      .sort({ _id: -1 })
      .limit(LIMIT)
      .skip(startIndex);
    if (!posts.length) return res.status(201).json({ msg: "No posts found" });
    res.status(200).json({
      data: posts,
      currentPage: Number(page),
      numberOfPages: Math.ceil(total / LIMIT),
    });
  } catch (error) {
    next(error);
  }
};

const getPost = async (req, res, next) => {
  const { id } = req.params;
  try {
    const post = await Post.findById(id);
    if (!post) return res.status(400).json({ msg: "Not Found" });
    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

const createPost = async (req, res, next) => {
  // this come from auth middleware
  const { userId } = req;
  try {
    const newPost = await Post.create({
      ...req.body,
      creator: userId,
    });
    res.status(201).json(newPost);
  } catch (err) {
    next(err);
  }
};

const deletePost = async (req, res, next) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).json({ msg: "This Id Not Valid" });
    const post = await Post.findById(id);
    if (!post) return res.status(400).json({ msg: "This Post Not Found" });
    await Post.findByIdAndDelete(id);
    res.status(200).json({ msg: "Post has been deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const updatePost = async (req, res, next) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).json({ msg: "This Id Not Valid" });
    const updatedPost = await Post.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json(updatedPost);
  } catch (error) {
    next(error);
  }
};

const likePost = async (req, res, next) => {
  const { id } = req.params;
  const { userId } = req;

  try {
    const post = await Post.findById(id);
    const findUserLike = post.likes.find((likeId) => likeId === userId);
    if (findUserLike) {
      post.likes = post.likes.filter((like) => like !== userId);
    } else {
      post.likes.push(userId);
    }
    await post.save();
    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

const getPostBySearch = async (req, res, next) => {
  const { searchQuery, tags } = req.query;
  try {
    const title = new RegExp(searchQuery, "i");
    let searchPost;
    if (searchQuery === "none" || tags === "none") {
      searchPost = await Post.find({
        $or: [{ title }, { tags: { $in: tags.split(",") } }],
      });
    }
    if (searchQuery !== "none" && tags !== "none") {
      searchPost = await Post.find({
        $and: [{ title }, { tags: { $in: tags.split(",") } }],
      });
      if (!searchPost.length) {
        searchPost = await Post.find({
          $or: [{ title }, { tags: { $in: tags.split(",") } }],
        });
      }
    }
    res.status(200).json(searchPost);
  } catch (error) {
    next(error);
  }
};
const getPostsByCreator = async (req, res, next) => {
  const { name } = req.params;
  try {
    const post = await Post.find({ name });
    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

const commentPost = async (req, res, next) => {
  const { id } = req.params;
  const { comment } = req.body;
  try {
    const post = await Post.findById(id);
    post.comments.push(comment);
    await post.save();
    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPosts,
  getPost,
  createPost,
  deletePost,
  updatePost,
  getPostBySearch,
  likePost,
  commentPost,
  getPostsByCreator,
};
