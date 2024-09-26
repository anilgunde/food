import { styled } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
const Link = styled(RouterLink)({
  color: "black",
  textDecoration: "none",
  "&:hover": {
    color: "black",
    textDecoration: "none",
  },
});

export default Link;
