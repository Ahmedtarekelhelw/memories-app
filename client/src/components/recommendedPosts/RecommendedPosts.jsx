import { Divider, Stack, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

const RecommendedPosts = ({ recommendedPosts }) => {
  const navigate = useNavigate();

  return (
    <div className="recommended-posts">
      <Typography gutterBottom variant="h5">
        You might also like:
      </Typography>
      <Divider />

      <Stack direction="row" className="recommended-posts-container">
        {recommendedPosts.map(
          ({ title, name, message, likes, selectedFile, _id }) => (
            <div
              style={{ margin: "20px", cursor: "pointer" }}
              onClick={() => navigate(`/posts/${_id}`)}
              key={_id}
            >
              <Typography gutterBottom variant="h6">
                {title}
              </Typography>
              <Typography gutterBottom variant="subtitle2">
                {name}
              </Typography>
              <Typography gutterBottom variant="subtitle2">
                {message}
              </Typography>
              <Typography gutterBottom variant="subtitle1">
                Likes: {likes.length}
              </Typography>
              <img
                src={
                  selectedFile ||
                  "https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png"
                }
                width="200px"
                height="140px"
                style={{ objectFit: "cover" }}
                alt={title}
              />
            </div>
          )
        )}
      </Stack>
    </div>
  );
};

export default React.memo(RecommendedPosts);
