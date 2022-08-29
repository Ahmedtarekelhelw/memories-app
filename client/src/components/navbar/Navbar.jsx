import {
  AppBar,
  Avatar,
  Button,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import React from "react";
import "./style.scss";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/actions/auth";
import { selectUser } from "../../redux/reducers/auth";

const Navbar = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const location = useLocation();

  return (
    <AppBar position="static">
      <Toolbar className="nav-toolbar">
        <Typography variant="h5" component={Link} to="/" sx={{ flexGrow: 1 }}>
          Memories
        </Typography>
        {user ? (
          <Stack
            direction="row"
            alignItems="center"
            spacing={2}
            className="nav-stack"
          >
            <Avatar
              style={{ backgroundColor: "#ab47bc" }}
              src={user?.imageUrl}
              alt={user?.name}
            >
              {user?.name[0]?.toUpperCase()}
            </Avatar>
            <Typography className="username" variant="h6">
              {user?.name}
            </Typography>
            <Button
              variant="contained"
              color="error"
              onClick={() => dispatch(logout())}
              className="btn-logout"
            >
              Logout
            </Button>
          </Stack>
        ) : (
          <Button
            variant="contained"
            component={Link}
            to="/auth"
            state={{ from: location }}
          >
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default React.memo(Navbar);
