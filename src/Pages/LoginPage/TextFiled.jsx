import React from "react";

import { Box } from "@mui/material";
import TextField from "@mui/material/TextField";

function LoginTextfield({ ...props }) {
  const textStyle = {
    "&.MuiTextField-root": {
      "& .MuiInputLabel-outlined": {
        color: "#214C55",
      },
      "& .MuiInputBase-inputSizeSmall": {
        color: "#214C55",
      },
      "& .MuiOutlinedInput-root": {
        backgroundColor: "#e9efed",
        borderRadius: "10px",
        height: "43px",
      },
      "& .MuiFormHelperText-contained": {
        color: "error.main",
        margin: 0,
      },
    },
    "& fieldset": { border: "none" },
    ".Mui-error": {
      marginBottom: "25px",
    },
    position: "relative",
  };
  return (
    <Box>
      <div>
        <TextField
          fullWidth
          autoComplete="off"
          sx={textStyle}
          style={{ width: "100%", height: "40px" }}
          {...props}
          inputProps={{
            sx: {
              "&::placeholder": {
                color: "#214C55",
                opacity: 1,
                fontSize: "15px",
              },
            },
          }}
        />
      </div>
    </Box>
  );
}

export default LoginTextfield;
