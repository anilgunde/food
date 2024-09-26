import { Paper, Stack, Typography, useTheme } from "@mui/material";
const NotFound = () => {
  const theme = useTheme();
  return (
    <Paper
      elevation={5}
      marginY={2}
      sx={{
        borderBottom: `3px solid ${theme.palette.primary.main}`,
        borderTop: `3px solid ${theme.palette.primary.main}`,
      }}
    >
      <Stack
        justifyContent="center"
        alignItems="center"
        minHeight={"calc(100vh - 10px)"}
      >
        <Typography
          variant="h5"
          component="h2"
          color={theme => theme.palette.primary.main}
          textTransform={"uppercase"}
          fontWeight={600}
          letterSpacing={3}
        >
          <span style={{ color: "red" }}> 404 Error </span> - Page Not Found
        </Typography>
      </Stack>
    </Paper>
  );
};

export default NotFound;
