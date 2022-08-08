import { Button, Stack, TextField, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import "../search/style.scss";
import { useDispatch, useSelector } from "react-redux";
import { createPost, updatePost } from "../../redux/actions/post";
import { storage } from "../../firebase";

import { ref, getDownloadURL, uploadString } from "firebase/storage";
import { v4 } from "uuid";
import Resizer from "react-image-file-resizer";
import { START_LOADING } from "../../redux/constants/actionTypes";

const AddPostForm = ({ editPostId, setEditPostId }) => {
  //this ref to reset file input after any operation
  const inputRef = useRef(null);
  //psot data
  const [postData, setPostData] = useState({
    title: "",
    message: "",
    tags: "",
    selectedFile: "",
  });
  const [file, setFile] = useState(null);
  const [fileChange, setFileChange] = useState(false);

  //redux work
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { posts, loading } = useSelector((state) => state.posts);

  //this to select which post is updated and set postData state with this info
  const post = posts?.find((p) => p._id === editPostId);
  useEffect(() => {
    if (post) setPostData(post);
  }, [post]);

  // to set postData state from my inputs
  const handleChange = (e) => {
    setPostData({ ...postData, [e.target.name]: e.target.value });
  };

  // function to reset form after update or create a post
  const resetForm = () => {
    setEditPostId("");
    setPostData({
      title: "",
      message: "",
      tags: "",
      selectedFile: "",
    });
    setFile(null);
    inputRef.current.value = "";
  };

  //create or update post depend on file input
  //this used because we need to wait to set selectedFile by url that
  // return from function getImageUrl
  useEffect(() => {
    //check if url is set to selectedFile
    if (postData.selectedFile && !editPostId) {
      dispatch(
        createPost({
          ...postData,
          tags: postData.tags.split(","),
          name: user.name,
        })
      );
      resetForm();
    } else if (editPostId && postData.selectedFile && fileChange) {
      dispatch(
        updatePost(editPostId, {
          ...postData,
          tags:
            typeof postData.tags === "string"
              ? postData.tags.split(",")
              : postData.tags.join(",").split(","),
        })
      );
      setFileChange(false);
      resetForm();
    }
    window.scrollTo(0, 0);
  }, [postData.selectedFile]);

  //function to resize image
  const resizeFile = (file) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(file, 500, 500, "JPEG", 25, 0, (uri) => {
        resolve(uri);
      });
    });

  //get image url of the selected file when upload to firebase
  const getImageUrl = async () => {
    let name = file.name.split(".");
    name.shift();
    name.unshift(v4());
    name = name.join(".");

    const img = await resizeFile(file);
    dispatch({ type: START_LOADING });
    const postRef = ref(storage, `image/${name}`);
    const snapshotRef = await uploadString(postRef, img, "data_url");
    const url = await getDownloadURL(snapshotRef.ref);
    setPostData({ ...postData, selectedFile: url });
    setFileChange(true);
  };

  //create and update post
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, message, tags } = postData;

    //create post
    if (title && message && tags && !editPostId) {
      //check file input is set or not
      //if true create post with image done in useEffect
      if (file) return getImageUrl();

      //create post without image
      dispatch(
        createPost({
          ...postData,
          tags: postData.tags.split(","),
          name: user.name,
        })
      );
      window.scrollTo(0, 0);
    } else if (editPostId) {
      //check file input is set Or not
      //if true update post with image done in useEffect
      if (file) return getImageUrl();

      //update post without image or with old image
      dispatch(
        updatePost(editPostId, {
          ...postData,
          tags:
            typeof postData.tags === "string"
              ? postData.tags.split(",")
              : postData.tags.join(",").split(","),
        })
      );
      window.scrollTo(0, 0);
    }
    //this to reset all form data incase of file is not set
    resetForm();
  };

  return (
    <Stack className="form-stack" spacing={2}>
      <Typography variant="h6" textAlign="center">
        {editPostId ? "Editing" : "Creating"} Your Memory
      </Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="title"
            fullWidth
            size="small"
            name="title"
            required
            value={postData.title}
            onChange={handleChange}
          />
          <TextField
            label="Message"
            required
            fullWidth
            name="message"
            size="small"
            value={postData.message}
            onChange={handleChange}
          />
          <TextField
            label="Tags (coma separated)"
            fullWidth
            required
            name="tags"
            size="small"
            value={postData.tags}
            onChange={handleChange}
          />

          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            ref={inputRef}
          />

          <Button
            variant="contained"
            fullWidth
            type="submit"
            size="small"
            disabled={loading}
          >
            Submit
          </Button>
          <Button
            variant="contained"
            color="error"
            fullWidth
            size="small"
            onClick={resetForm}
          >
            Clear
          </Button>
        </Stack>
      </form>
    </Stack>
  );
};

export default AddPostForm;
