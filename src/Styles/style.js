import "@fontsource/titillium-web";
import "@fontsource/titillium-web/400-italic.css";
import "@fontsource/titillium-web/400.css";
import { createTheme } from "@mui/material";
const colors = {
  primary: "#45AEAE",
  secondary: "#214C55",
  black: "#454545",
  white: "#fff",
  lightgrey: "#efeff1",
  green: "#1ec771",
  error:'#d32f2f'
};

const theme = createTheme({
  typography: {
    fontFamily: "Titillium Web",
  },
  direction:'rtl',
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          borderRadius: 0,
        },
      },
    },
  },
  palette: {
    primary: {
      main: colors.primary,
      error: colors.lightgrey,
    },
    secondary: {
      main: colors.secondary,
      secondary: colors.white,
      error: colors.green,
    },
    grey: {
      100: "#EFF1F3",
    },
    common: {
      black: "#343434",
    },
    white:{
      main:'#fff'
    },
    danger:{
      main:'#c62828'
    },
    green:{
      main:'#1ec771'
    },
  },
});

export default theme;
