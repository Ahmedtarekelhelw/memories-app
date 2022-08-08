import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Container, Grid, Grow, Paper, Stack, Typography } from "@mui/material";

import Posts from "../components/posts/Posts";
import Search from "../components/search/Search";
import AddPostForm from "../components/addPostForm/AddPostForm";
import Paginator from "../components/paginator/Paginator";
import "./style.scss";
import { useLocation } from "react-router-dom";
import queryString from "query-string";

// const useQuery = () => {
//   return new URLSearchParams(useLocation().search);
// };

const Home = () => {
  // const query = useQuery();
  // const page = query.get("page") || 1;
  const location = useLocation();
  const { searchQuery, tags, page } = queryString.parse(location.search);
  const { user } = useSelector((state) => state.auth);

  const [editPostId, setEditPostId] = useState("");

  return (
    <Grow in>
      <Container maxWidth="xl" className="home-container">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={8} lg={9}>
            <Posts setEditPostId={setEditPostId} />
          </Grid>
          <Grid item xs={12} sm={12} md={4} lg={3}>
            <Stack spacing={2}>
              <Search searchQuery={searchQuery} tags={tags} />
              {user ? (
                <AddPostForm
                  editPostId={editPostId}
                  setEditPostId={setEditPostId}
                />
              ) : (
                <Paper elevation={6}>
                  <Typography variant="h6" p={1} textAlign="center">
                    Please Sign In To Enable To Create A Post
                  </Typography>
                </Paper>
              )}

              {!searchQuery && !tags && (
                <Paper className="pagination-paper" elevation={6}>
                  <Paginator page={page || 1} />
                </Paper>
              )}
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Grow>
  );
};

export default Home;
