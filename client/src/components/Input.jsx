import React from "react";
import { Grid, IconButton, InputAdornment, TextField } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
const Input = ({
  name,
  label,
  handleChange,
  handleShowPassword,
  half,
  autoFocus,
  type,
  inputRef,
  onFocus,
  onBlur,
  className,
}) => {
  return (
    <Grid item xs={12} sm={half ? 6 : 12}>
      <TextField
        name={name}
        label={label}
        required
        className={className}
        autoFocus={autoFocus}
        type={type}
        fullWidth
        onFocus={onFocus}
        onBlur={onBlur}
        onChange={handleChange}
        inputRef={inputRef}
        InputProps={
          name === "password"
            ? {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleShowPassword}>
                      {type === "password" ? (
                        <VisibilityOffIcon />
                      ) : (
                        <VisibilityIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }
            : null
        }
      />
    </Grid>
  );
};

export default Input;
