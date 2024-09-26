import { Box, styled, Toolbar } from "@mui/material";

const ContainerWrapper = styled(Box)(({ theme }) => ({
  backgroundColor: "#F2F5F6",
  width: "100%",
  minHeight: "100vh",
  paddingTop: theme.spacing(3.5),
  paddingLeft: theme.spacing(2.5),
  paddingRight: theme.spacing(2.5),
  overflowX: "hidden",
  [theme.breakpoints.down("md")]: {
    paddingLeft: theme.spacing(1.5),
    paddingRight: theme.spacing(1.5),
  }
}));

const CardWrapper = ({ children, ...other }) => (
  <ContainerWrapper {...other}>
    <Toolbar />
    {children}
  </ContainerWrapper>
);

export default CardWrapper;
