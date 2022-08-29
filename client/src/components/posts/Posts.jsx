import { CircularProgress, Grid, Typography } from "@mui/material";
import Post from "../post/Post";
import { useSelector } from "react-redux";
import React from "react";

const Posts = ({ setEditPostId }) => {
  const { posts, loading } = useSelector((state) => state.posts);
  posts?.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <Grid container spacing={2} className="posts-container">
      {loading ? (
        <CircularProgress />
      ) : posts?.length ? (
        posts?.map((post, i) => (
          <Grid item key={i} sm={12} md={6} lg={4} width={1}>
            <Post post={post} setEditPostId={setEditPostId} />
          </Grid>
        ))
      ) : (
        <Typography variant="h5">There is No Memories</Typography>
      )}
    </Grid>
  );
};

export default React.memo(Posts);
