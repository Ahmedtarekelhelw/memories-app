const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    name: { type: String, required: true },
    creator: { type: String, required: true, ref: "User" },
    selectedFile: { type: String },
    tags: { type: [String], required: true },
    likes: { type: [String], default: [] },
    comments: { type: [String], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
