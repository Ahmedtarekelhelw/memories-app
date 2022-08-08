import React, { useEffect, useState } from "react";
import { Button, Stack, TextField, Typography } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { commentPost } from "../../redux/actions/post";
import { useRef } from "react";

const Comments = ({ post }) => {
  const { user } = useSelector((state) => state.auth);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(post?.comments || []);
  const dispatch = useDispatch();
  const scrollRef = useRef();

  const handleComment = async () => {
    const newComment = await dispatch(
      commentPost(`${user.name}: ${comment}`, post._id)
    );
    setComment("");
    setComments(newComment);
  };

  const handleKeyDown = ({ keyCode }) => {
    if (keyCode === 13) handleComment();
  };

  const scrollTo = () => {
    scrollRef.current.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    scrollTo();
  }, [comments]);
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      className="comments-stack"
    >
      <div className="comments-right" ref={scrollRef}>
        <Typography gutterBottom variant="h6">
          Comments
        </Typography>
        {comments?.map((c, i) => (
          <Typography gutterBottom key={i}>
            <strong>{c.split(":")[0]}</strong> {c.split(":")[1]}
          </Typography>
        ))}
      </div>
      {user && (
        <Stack width={0.7} ml={3} className="comments-left">
          <Typography gutterBottom variant="h6">
            Write a comment
          </Typography>

          <TextField
            fullWidth
            rows={4}
            multiline
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button
            variant="contained"
            fullWidth
            sx={{ marginTop: "15px" }}
            disabled={!comment}
            onClick={handleComment}
          >
            comment
          </Button>
        </Stack>
      )}
    </Stack>
  );
};

export default React.memo(Comments);
