import MenuIcon from "@mui/icons-material/Menu";
import { Box, IconButton, styled, Toolbar, Tooltip } from "@mui/material";
import MuiAppBar from "@mui/material/AppBar";
import useMediaQuery from "@mui/material/useMediaQuery";

import LogoutIcon from "@mui/icons-material/Logout";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { setPreviosPath } from "../../../store/slices/app.tsx";
import { SM_WIDTH } from "../../../utils/constants";
import { useCookies } from "react-cookie";
import Cookies from "js-cookie";
import { t } from "i18next";

const StyledNavbar = styled(MuiAppBar)(({ theme }) => ({
  backgroundColor: "#45AEAE",
  paddingTop: theme.spacing(0.3),
  paddingLeft: theme.spacing(1),
  paddingBottom: theme.spacing(0.3),

  display: "flex",
  flexDirection: "row",
  position: "fixed",
  top: 0,
  left: 0,
  alignItems: "center",

  justifyContent: "space-between",
}));

const Navbar = ({ setIsOpen, ...other }) => {
  const lang = sessionStorage.getItem("lang");

  const isLarge = useMediaQuery(`(min-width:${SM_WIDTH}px)`);
  const navigate = useNavigate();

  const login = JSON.parse(sessionStorage?.getItem("login"));
  const token = login?.data?.accessToken;
  const location = useLocation();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setPreviosPath(location.pathname));
  }, [location.pathname]);
  const appState = useSelector((state) => state?.app);

  useEffect(() => {}, [appState?.prevPath]);

  const toggleNavbar = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, [setIsOpen]);

  useEffect(() => {
    const urlPatterns = [
      /^\/household\/viewHouseHold/,
      /^\/household\/assignSurvey/,
    ];

    const matchesPattern = urlPatterns.some((pattern) =>
      pattern.test(location.pathname)
    );

    if (!matchesPattern) {
      sessionStorage.removeItem("householdPageNumber");
      // sessionStorage.removeItem("reportRowsPerPage1");
    }
  }, [location.pathname]);

  useEffect(() => {
    const urlPattern = /^\/reports\/viewReports/;

    if (!urlPattern.test(location.pathname)) {
      sessionStorage.removeItem("reportPageNumber");
       sessionStorage.removeItem("reportRowsPerPage");
     
      // sessionStorage.removeItem("reportRowsPerPage3");
    }
  }, [location.pathname]);

  useEffect(() => {
    const urlPattern = /^\/userManagement\/updateUser/;

    if (!urlPattern.test(location.pathname)) {
      sessionStorage.removeItem("userPageNumber");
    }
  }, [location.pathname]);

  useEffect(() => {
    const urlPattern = /^\/recipes\/recipeEdit/;

    if (!urlPattern.test(location.pathname)) {
      sessionStorage.removeItem("receipsPageNumber");
      // sessionStorage.removeItem("receipsRowsPerPage");
    }
  }, [location.pathname]);

  const [cookies, setCookie] = useCookies(["token"]);
  const logOut = useCallback(() => {
    navigate("/");
    window.location.reload();

    Cookies.remove("token1");
    Cookies.remove("unique_name");
    sessionStorage.removeItem("householdpage");
    sessionStorage.removeItem("householdPageNumber");
  }, [navigate]);

  return (
    <div dir={lang === "ar" ? "rtl" : ""}>
      <StyledNavbar {...other} elevation={2}>
        <Toolbar>
          <Box>
            {!isLarge && (
              <Tooltip title={t("Open Navigation")}>
                <IconButton onClick={toggleNavbar} color="white">
                  <MenuIcon />
                </IconButton>
              </Tooltip>
            )}
          </Box>

          <Box
            sx={{
              marginLeft: isLarge && lang === "en" ? "220px" : "0px",
              marginRight: isLarge && lang === "ar" ? "230px" : "0px",
            }}
            color={"#FFFFFF"}
            fontSize={{ xs: 14, md: 16, lg: 18 }}
          >
            {t(
              location.pathname.split("/").length == 3
                ? location.pathname
                    ?.split("/")[2]
                    .replace(/([a-z])([A-Z])/g, "$1 $2")
                    .toLowerCase()
                    .replace(/(?:^|\s)\S/g, (match) => match.toUpperCase())
                : location.pathname.split("/").length == 4
                ? location.pathname
                    ?.split("/")[3]
                    .replace(/([a-z])([A-Z])/g, "$1 $2")
                    .toLowerCase()
                    .replace(/(?:^|\s)\S/g, (match) => match.toUpperCase())
                : location.pathname
                    ?.split("/")[1]
                    .replace(/([a-z])([A-Z])/g, "$1 $2")
                    .toLowerCase()
                    .replace(/(?:^|\s)\S/g, (match) => match.toUpperCase())
            )}
          </Box>
        </Toolbar>

        <Box
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          marginRight={"1rem"}
        >
          <Tooltip title={t("Notifications")}>
            <IconButton
              aria-label="send"
              size="medium"
              sx={{ marginRight: "5%", marginLeft: "2%" }}
              color="white"
            >
              <NotificationsIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={t("Logout")}>
            <IconButton
              aria-label="send"
              size="medium"
              sx={{ marginRight: "5%", marginLeft: "2%" }}
              color="white"
              onClick={logOut}
              style={lang === "ar" ? { transform: "rotate(180deg)" } : {}}
            >
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </StyledNavbar>
    </div>
  );
};

export default Navbar;
