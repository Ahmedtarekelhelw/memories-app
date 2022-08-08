import { Button, Chip, Stack, TextField } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getPostBySearch, getPosts } from "../../redux/actions/post";
import { useNavigate } from "react-router-dom";
import "./style.scss";

const Search = ({ searchQuery, tags }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [search, setSearch] = useState({
    title: searchQuery ? searchQuery : "",
    tags: tags && tags !== "none" ? tags.split(",") : [],
  });

  const handleDelete = (tag) => {
    setSearch({ ...search, tags: search.tags.filter((t) => t !== tag) });
  };

  const handleChip = (e) => {
    if (e.target.value) {
      if (e.key === "Enter") {
        const find = search.tags.find((tag) => tag === e.target.value);
        if (find || e.target.value === "none") {
          e.target.value = "";
        } else {
          setSearch({ ...search, tags: [...search.tags, e.target.value] });
          e.target.value = "";
        }
      }
    }
  };

  const handleSearch = useCallback(() => {
    if (search.tags.length || search.title) {
      dispatch(getPostBySearch(search));
      navigate(
        `/posts/search?searchQuery=${search.title.trim() || "none"}&tags=${
          search.tags.join(",") || "none"
        }`
      );
    } else {
      dispatch(getPosts());
      navigate("/");
    }
  }, [dispatch, navigate, search]);

  useEffect(() => {
    if (searchQuery || tags) {
      handleSearch();
    }
  }, [searchQuery, tags, handleSearch]);

  return (
    <Stack spacing={2} className="form-stack">
      <TextField
        label="Search Memories"
        value={search.title}
        onKeyDown={(e) => e.keyCode === 13 && handleSearch()}
        onChange={(e) => setSearch({ ...search, title: e.target.value })}
      />
      <TextField
        label="Tags"
        onKeyDown={handleChip}
        InputProps={{
          startAdornment:
            search.tags.length > 0 &&
            search.tags.map((t, i) => (
              <Chip
                key={i}
                label={t}
                sx={{ marginRight: "5px" }}
                size="small"
                variant="outlined"
                onDelete={() => handleDelete(t)}
              />
            )),
        }}
      />
      <Button variant="contained" fullWidth onClick={handleSearch}>
        Search
      </Button>
    </Stack>
  );
};

export default Search;
