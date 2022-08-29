import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { getPost, getPostBySearch } from "../../redux/actions/post";
import { CircularProgress, Divider, Paper, Typography } from "@mui/material";
import moment from "moment";
import Comments from "../../components/comments/Comments";
import RecommendedPosts from "../../components/recommendedPosts/RecommendedPosts";
import "./style.scss";

const PostDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { post, posts, loading } = useSelector((state) => state.posts);

  useEffect(() => {
    dispatch(getPost(id));
  }, [id, dispatch]);

  useEffect(() => {
    if (post?.tags) {
      dispatch(getPostBySearch({ tags: post?.tags }));
    }
  }, [post?.tags, dispatch]);

  const recommendedPosts = useMemo(
    () => posts.filter((post) => post._id !== id),
    [id, posts]
  );

  if (loading) {
    return (
      <Paper elevation={6} className="post-loading">
        <CircularProgress size="7em" />
      </Paper>
    );
  }
  return (
    <Paper style={{ padding: "20px", borderRadius: "15px" }} elevation={6}>
      <div className="post-container">
        <div className="post-data">
          <Typography variant="h3">{post?.title}</Typography>
          <Typography gutterBottom variant="h6" color="textSecondary">
            {post?.tags &&
              post?.tags.map((tag, i) => (
                <Link
                  to={`/tags/${tag}`}
                  key={i}
                  style={{ textDecoration: "none", color: "#3f51b5" }}
                >
                  {` #${tag} `}
                </Link>
              ))}
          </Typography>
          <Typography gutterBottom variant="body1">
            {post?.message}
          </Typography>
          <Typography variant="h6">
            Created by:
            <Link
              to={`/creators/${post?.name}`}
              style={{ textDecoration: "none", color: "#3f51b5" }}
            >
              {` ${post?.name}`}
            </Link>
          </Typography>
          <Typography variant="body1">
            {moment(post?.createdAt).fromNow()}
          </Typography>
          <Divider className="divider" />

          <Comments post={post} />
          <Divider className="divider" />
        </div>

        <div className="post-img">
          <img
            className="img"
            src={
              post?.selectedFile ||
              "https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png"
            }
            alt={post?.title}
          />
        </div>
      </div>

      {/* recommended post*/}
      {!!recommendedPosts.length && (
        <RecommendedPosts recommendedPosts={recommendedPosts} />
      )}
    </Paper>
  );
};

export default PostDetails;
