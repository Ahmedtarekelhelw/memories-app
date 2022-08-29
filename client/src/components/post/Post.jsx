import React from "react";
import {
  Button,
  ButtonBase,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Stack,
  Typography,
} from "@mui/material";
import "./style.scss";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ThumbUpAltOutlined from "@mui/icons-material/ThumbUpAltOutlined";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { deletePost, likePost } from "../../redux/actions/post";
import moment from "moment";

const Post = ({ post, setEditPostId }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const handleLike = () => {
    dispatch(likePost(post._id));
  };

  const userId = user?._id || user?.googleId;

  const Likes = () => {
    if (post?.likes.length > 0) {
      return post?.likes.includes(userId) ? (
        <>
          <ThumbUpAltIcon fontSize="small" /> &nbsp;
          {post?.likes.length > 2
            ? `You and ${post?.likes.length - 1} others`
            : `${post?.likes.length} like${post?.likes.length > 1 ? "s" : ""}`}
        </>
      ) : (
        <>
          <ThumbUpAltOutlined fontSize="small" /> &nbsp; {post?.likes.length}{" "}
          {post?.likes.length === 1 ? "Like" : "Likes"}
        </>
      );
    }

    return (
      <>
        <ThumbUpAltOutlined fontSize="small" /> &nbsp; Like
      </>
    );
  };
  return (
    <Card>
      <ButtonBase onClick={() => navigate(`/posts/${post._id}`)}>
        <div className="card-head">
          <CardMedia
            className="img"
            height="150"
            component="img"
            image={
              post.selectedFile ||
              "https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png"
            }
          />
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            className="card-head-stack"
          >
            <div className="head">
              <Typography variant="h5">{post.name}</Typography>
              <Typography variant="body2">
                {moment(post.createdAt).fromNow()}
              </Typography>
            </div>

            {userId === post.creator && (
              <div
                className="edit-icon"
                onClick={(e) => {
                  e.stopPropagation();
                  setEditPostId(post._id);
                }}
              >
                <MoreHorizIcon />
              </div>
            )}
          </Stack>
          <div className="overlay" />
        </div>
        <CardContent>
          <Typography variant="body2">
            {post.tags.map((tag) => `#${tag} `)}
          </Typography>
          <Typography variant="h3" py={2}>
            {post.title}
          </Typography>
          <Typography variant="body2">{post.message}</Typography>
        </CardContent>
      </ButtonBase>
      <CardActions>
        <Button
          size="small"
          color="primary"
          className="card-btn"
          onClick={handleLike}
          disabled={!user}
        >
          <Likes />
        </Button>
        {userId === post.creator && (
          <Button
            size="small"
            color="error"
            className="card-btn"
            onClick={() => dispatch(deletePost(post._id))}
          >
            <DeleteIcon fontSize="small" /> &nbsp; Delete
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

export default React.memo(Post);
