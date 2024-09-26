import { Backdrop, Stack } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import CardWrapper from "../../components/Card/CardWrapper";
import Heart from "../../components/Common/Heart";
import MuiDrawer from "../../components/Navbar/SideNav/Drawer";
import DrawList from "../../components/Navbar/SideNav/DrawerList";
import Navbar from "../../components/Navbar/TopNav/Navbar";
import {
  setApiErrorStatusCode,
  setLoading,
  setRefreshForViewHouseHolds,
  setResponseSurvey,
  setSurveyClick,
} from "../../store/slices/app.tsx";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";

import i18next from "i18next";

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}));

const Loader = () => {
  const classes = useStyles();

  return (
    <Backdrop className={classes.backdrop} open={true}>
      <Heart />
    </Backdrop>
  );
};
const NavMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [timer, setTimer] = useState(900);

  useEffect(() => {
    const myInterval = setInterval(() => {
      if (timer > 0) {
        setTimer(timer - 1);
      }
    }, 1000);
    const resetTimeout = () => {
      setTimer(900);
    };
    const events = [
      "load",
      "mousemove",
      "mousedown",
      "click",
      "scroll",
      "keypress",
    ];
    for (let i in events) {
      window.addEventListener(events[i], resetTimeout);
    }
    return () => {
      clearInterval(myInterval);
      for (let i in events) {
        window.removeEventListener(events[i], resetTimeout);
      }
    };
  }, [timer]);

  if (timer === 0) {
    window.location.reload();
  }
  const appState = useSelector((state) => state?.app);
  const [load, setLoad] = useState(false);
  const dispatch = useDispatch();
  const location = useLocation();
  useEffect(() => {
    dispatch(setLoading(false));
  }, []);

  useEffect(() => {
    setLoad(appState?.value);
  }, [appState?.value]);

  useEffect(() => {
    if (location.pathname !== "/survey/viewSurvey/view") {
      dispatch(setResponseSurvey({}));
    }
    if (location.pathname !== "/survey/createSurvey/section")
      dispatch(setSurveyClick(false));
    if (location.pathname != "/household/viewHouseHold") {
      dispatch(setRefreshForViewHouseHolds(true));
    }
  }, [location.pathname]);
  const [cookies, setCookie] = useCookies(["token"]);

  useEffect(() => {
    if (appState?.apiErrorStatusCode == 401) {
      toast.error("Session expired please login again");
      setCookie("token1", "");
      navigate("/");
      dispatch(setApiErrorStatusCode(null));
    }
  }, [appState?.apiErrorStatusCode]);
  const lang = sessionStorage.getItem("lang");
  useEffect(() => {
    i18next.changeLanguage(lang);
  }, [lang]);
  return (
    <Stack direction={"row"}>
      <Navbar setIsOpen={setIsOpen} style={{ zIndex: 99 }} />
      {lang === "en" ? (
        <MuiDrawer
          style={{ zIndex: 100 }}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        >
          <DrawList setIsOpen={setIsOpen} />
        </MuiDrawer>
      ) : (
        ""
      )}
      <CardWrapper style={{ zIndex: 98 }}>{<Outlet />}</CardWrapper>
      {lang === "ar" ? (
        <MuiDrawer
          style={{ zIndex: 100 }}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        >
          <DrawList setIsOpen={setIsOpen} />
        </MuiDrawer>
      ) : (
        ""
      )}
      {load && <Loader />}
    </Stack>
  );
};

export default NavMenu;
