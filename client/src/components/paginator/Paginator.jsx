import { Pagination, PaginationItem } from "@mui/material";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getPosts } from "../../redux/actions/post";
import "./style.scss";

const Paginator = ({ page }) => {
  const { numberOfPages } = useSelector((state) => state.posts);
  const dispatch = useDispatch();

  useEffect(() => {
    if (page) dispatch(getPosts(page));
  }, [page, dispatch]);
  return (
    <Pagination
      count={numberOfPages}
      variant="outlined"
      page={Number(page)}
      renderItem={(item) => (
        <PaginationItem
          {...item}
          components={Link}
          href={`/#/posts?page=${item.page}`}
        />
      )}
    ></Pagination>
  );
};

export default Paginator;
