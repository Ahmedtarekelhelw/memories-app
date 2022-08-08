import React, { useEffect } from "react";
import { Typography, Divider, CircularProgress, Grid } from "@mui/material";
import Post from "../components/post/Post";
import { useLocation, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getPostBySearch, getPostsByCreator } from "../redux/actions/post";

const CreatorOrTag = () => {
  const { name } = useParams();
  const { loading, posts } = useSelector((state) => state.posts);
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.startsWith("/tags")) {
      dispatch(getPostBySearch({ tags: name.split() }));
    } else if (location.pathname.startsWith("/creator")) {
      dispatch(getPostsByCreator(name));
    }
  }, [dispatch, location.pathname, name]);
  return (
    <div>
      <Typography variant="h2">{name}</Typography>
      <Divider style={{ margin: "20px 0 50px 0" }} />
      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container alignItems="stretch" spacing={3}>
          {posts?.map((post) => (
            <Grid key={post._id} item xs={12} sm={12} md={6} lg={3}>
              <Post post={post} />
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
};

export default CreatorOrTag;
