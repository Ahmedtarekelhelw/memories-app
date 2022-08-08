import { Avatar, Button, Container, Grid, Typography } from "@mui/material";
import { useEffect, useState, useRef } from "react";
import Input from "../components/Input";
import { useDispatch, useSelector } from "react-redux";
import { login, signup } from "../redux/actions/auth";
import { GoogleLogin } from "react-google-login";
import GoogleIcon from "@mui/icons-material/Google";
import "./style.scss";
import {
  AUTH_FAILURE,
  AUTH_START,
  AUTH_SUCCESS,
} from "../redux/constants/actionTypes";

const Auth = () => {
  //My State
  const [signUp, setSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const emailRef = useRef();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [validPassword, setValidPassword] = useState(false);
  const [focusPassword, setFocusPassword] = useState(false);
  const [validEmail, setValidEmail] = useState(false);
  const [focusEmail, setFocusEmail] = useState(false);
  const [validConfirmPassword, setValidConfirmPassword] = useState(false);
  const [focusConfirmPassword, setFocusConfirmPassword] = useState(false);

  const { confirmPassword, email, password, ...other } = formData;

  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  //My Functions
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSign = () => {
    setSignUp(!signUp);
  };

  useEffect(() => {
    emailRef.current.focus();
  }, []);

  useEffect(() => {
    dispatch({ type: AUTH_FAILURE, payload: "" });
  }, [dispatch, email, password, confirmPassword]);

  //valid email
  useEffect(() => {
    const EMAIL_REGEX = /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/;
    const result = EMAIL_REGEX.test(email);
    setValidEmail(result);
  }, [email]);

  //valid password and confirmPassword
  useEffect(() => {
    const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
    const result = PWD_REGEX.test(password);
    setValidPassword(result);

    const match = password === confirmPassword;
    setValidConfirmPassword(match);
  }, [password, confirmPassword]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (signUp && validPassword && validConfirmPassword && validEmail) {
      dispatch(
        signup({ ...other, email, password, password2: confirmPassword })
      );
    } else if (!signUp && validPassword && validEmail) {
      dispatch(login({ email, password }));
    }
  };

  const googleSuccess = async (res) => {
    const result = res?.profileObj;
    const token = res?.tokenId;
    dispatch({ type: AUTH_START });
    try {
      dispatch({ type: AUTH_SUCCESS, payload: { ...result, token } });
    } catch (err) {
      dispatch({ type: AUTH_FAILURE, payload: err });
    }
  };
  const googleFailure = () => {
    dispatch({
      type: AUTH_FAILURE,
      payload: "Google Sign In Was UnSuccessful Try Again later",
    });
  };

  return (
    <Container component="main" maxWidth="xs">
      <div
        className="head"
        style={{ marginBottom: "20px", textAlign: "center" }}
      >
        <Avatar style={{ margin: "5px auto" }}></Avatar>
        <Typography variant="h5">{signUp ? "SignUp" : "SignIn"}</Typography>
        {error && <div className="auth-error">{error}</div>}
      </div>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {signUp && (
            <>
              <Input
                name="firstName"
                label="First Name"
                half
                handleChange={handleChange}
              />
              <Input
                name="lastName"
                label="Last Name"
                half
                handleChange={handleChange}
              />
            </>
          )}
          <Input
            name="email"
            label="Email"
            type="email"
            onFocus={() => setFocusEmail(true)}
            onBlur={() => setFocusEmail(false)}
            inputRef={emailRef}
            handleChange={handleChange}
          />
          {focusEmail && !validEmail && (
            <p className="instruction">Please provide a valid email address</p>
          )}
          <Input
            name="password"
            label="Password"
            handleChange={handleChange}
            handleShowPassword={handleShowPassword}
            onFocus={() => setFocusPassword(true)}
            onBlur={() => setFocusPassword(false)}
            type={showPassword ? "text" : "password"}
          />
          {focusPassword && !validPassword && (
            <p className="instruction">
              8 to 24 characters.
              <br />
              Must include uppercase and lowercase letters, a number and a
              special character.
              <br />
              <span>Allowed special characters:!@#$% </span>
            </p>
          )}

          {signUp && (
            <>
              <Input
                name="confirmPassword"
                label="Repeat Password"
                handleChange={handleChange}
                onFocus={() => setFocusConfirmPassword(true)}
                onBlur={() => setFocusConfirmPassword(false)}
                type={showPassword ? "text" : "password"}
              />
              {focusConfirmPassword && !validConfirmPassword && (
                <p className="instruction">
                  Must match the first password input field.
                </p>
              )}
            </>
          )}
        </Grid>
        <Button
          type="submit"
          disabled={
            !signUp
              ? !validEmail || !validPassword || loading
              : !validConfirmPassword ||
                !validPassword ||
                loading ||
                !validEmail ||
                !formData.firstName ||
                !formData.lastName
          }
          fullWidth
          variant="contained"
          style={{ margin: "10px 0" }}
        >
          {signUp ? "Signup" : "Signin"}
        </Button>
        <GoogleLogin
          clientId={process.env.REACT_APP_GOOGLE_ID}
          render={(renderProps) => (
            <Button
              variant="contained"
              fullWidth
              onClick={renderProps.onClick}
              disabled={renderProps.disabled}
              startIcon={<GoogleIcon />}
            >
              Google Sign In
            </Button>
          )}
          onSuccess={googleSuccess}
          onFailure={googleFailure}
          cookiePolicy="single_host_origin"
        />

        <Grid>
          <Button onClick={handleSign}>{signUp ? "SignIn" : "SignUp"}</Button>
        </Grid>
      </form>
    </Container>
  );
};

export default Auth;
