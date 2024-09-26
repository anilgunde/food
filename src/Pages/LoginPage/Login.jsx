import { useEffect, useState } from "react";

import {
  Backdrop,
  Button,
  FormHelperText,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import "bootstrap/dist/css/bootstrap.css";
import { useFormik } from "formik";
import i18next from "i18next";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import logo from "../../assets/atlas.png";
import passImage from "../../assets/key-solid.png";
import userImage from "../../assets/user-solid@2x.png";
import Heart from "../../components/Common/Heart";
import LoginTextfield from "./TextFiled.jsx";
import "./login.css";
import axios from "axios";
import { toast } from "react-toastify";
import {
  setAccessToken,
  setApiErrorStatusCode,
  setCities,
  setLoggedInUser,
  setLoggedInRole,
} from "../../store/slices/app.tsx";
import { Refresh, Visibility, VisibilityOff } from "@mui/icons-material";

import Cookies from "js-cookie";
import image from "../../assets/captcha-bg.png";
import aptiway from "../../assets/powered.png";

const useStyles = makeStyles((theme) => ({
  noBorder: {
    border: "none",
    borderRadius: "5px",
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
  label: {
    fontSize: "10px",
  },
  helperText: {
    color: "#d32f2f",
    marginLeft: "0.2rem",
    marginBottom: "-0.4rem",
  },
}));

const Login = () => {
  const { t } = useTranslation();
  const [lang, setLang] = useState(
    Cookies.get("lang") || sessionStorage?.getItem("lang") || "en"
  );
  const [load, setLoad] = useState(false);
  const [remember, setRemember] = useState(false);
  const [cookies, setCookie] = useState("");

  useEffect(() => {
    setCookie(Cookies.get("token1"));
    dispatch(setAccessToken(null));
  }, []);
  useEffect(() => {
    if (cookies?.length) {
      i18next.changeLanguage(lang);
      dispatch(setAccessToken(cookies));
      const base64Url = cookies?.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );

      const Parsed = JSON.parse(jsonPayload);
      dispatch(setLoggedInUser(Parsed?.unique_name));
      dispatch(setLoggedInRole(Parsed));

      navigate("/dashboard");
    }
  }, [cookies?.length]);

  const appState = useSelector((state) => state?.app);

  const formik = useFormik({
    initialValues: {
      password: "",
      username: "",
      captcha: "",
    },
    validationSchema: Yup.object({
      password: Yup.string().required(`${t("Please Enter Password")}`),
      username: Yup.string().required(`${t("Please Enter Username")}`),
      captcha: Yup.string().required(`${t("Please Enter Captcha")}`),
    }),
    onSubmit: (values, { setSubmitting }) => {
      if (formik.values.captcha != captcha) {
        formik.setFieldError("captcha", true);
        toast.error(t("Please Enter Valid Captcha"));
        return;
      }
      setLoad(true);
      axios
        .post("/api/user/authenticate", {
          username: values.username,
          password: values.password,
        })
        .then((res) => {
          if (res?.data?.data?.jwtToken?.length) {
            if (remember === true) {
              // setCookie('token', res?.data?.data?.jwtToken);
              Cookies.set("token1", res?.data?.data?.jwtToken, {
                expires: 365,
              });
            }
            dispatch(setAccessToken(res?.data?.data?.jwtToken));
            setLoad(false);
            const base64Url = res?.data?.data?.jwtToken.split(".")[1];
            const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
            const jsonPayload = decodeURIComponent(
              atob(base64)
                .split("")
                .map((c) => {
                  return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
                })
                .join("")
            );

            const Parsed = JSON.parse(jsonPayload);

            if (remember === true) {
              Cookies.set("unique_name", Parsed.unique_name, { expires: 365 });
              Cookies.set("role", Parsed.role, { expires: 365 });
            }
            dispatch(setLoggedInUser(Parsed));
            dispatch(setLoggedInRole(Parsed));
            if (
              Parsed.role?.includes("Administrator") ||
              Parsed.role?.includes("Recruiter")
            ) {
              navigate("/dashboard");
              dispatch(setLoggedInUser(Parsed));
            } else if (Parsed.role?.includes("Interviewer")) {
              navigate("/reports");
              dispatch(setLoggedInUser(Parsed));
            } else {
              toast.error("You are not authorized to access this application!");
              dispatch(setAccessToken(""));
            }
          }
        })
        .catch((err) => {
          setLoad(false);
          setCaptcha(generateRandomString(6));
          toast.error(
            err?.response?.data?.errors[0] || err?.response?.data?.Errors[0]
          );
        });
    },
  });
  const classes = useStyles();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setApiErrorStatusCode(null));
  }, []);

  const handleKeyDown = (event) => {
    if (event.keyCode === 13) {
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleChange = (e) => {
    setLang(e.target.value);
    sessionStorage.setItem("lang", e.target.value);
    Cookies.set("lang", e.target.value, { expires: 365 });
  };

  useEffect(() => {
    i18next.changeLanguage(lang);
    sessionStorage.setItem("lang", lang);
    dispatch(
      setCities([
        { option: "ADC", label: "Abu Dhabi City", next: "03" },
        { option: "AA", label: "Al Ain", next: "03" },

        { option: "ADH", label: "Al Dhafra", next: "03" },

        { option: "MZ", label: "Madinat Zayed", next: "03" },

        { option: "R", label: "Ruwais", next: "03" },

        { option: "G", label: "Ghayathi", next: "03" },

        { option: "LO", label: "Liwa Oasis", next: "03" },
      ])
    );
  }, [lang]);

  const Loader = () => {
    return (
      <Backdrop open={true}>
        <Heart />
      </Backdrop>
    );
  };
  const [type, setType] = useState("password");
  const handleVisibility = () => {
    setType(type === "text" ? "password" : "text");
  };

  const handleRemember = (e) => {
    setRemember(e.target.checked);
  };

  const handleUserNameChange = (event) => {
    const inputValue = event.target.value;
    const onlyEnglishLettersAndNumbersAndSpecialChars =
      /^[a-zA-Z0-9\s!@#$%^&*(),.?":{}|<>]*$/;
    if (onlyEnglishLettersAndNumbersAndSpecialChars.test(inputValue)) {
      formik.setFieldValue("username", inputValue);
    }
  };

  const handlePasswordChange = (event) => {
    const inputValue = event.target.value;
    const onlyEnglishLettersAndNumbersAndSpecialChars =
      /^[a-zA-Z0-9\s!@#$%^&*(),.?":{}|<>]*$/;
    if (onlyEnglishLettersAndNumbersAndSpecialChars.test(inputValue)) {
      formik.setFieldValue("password", inputValue);
    }
  };
  function generateRandomString(length) {
    const characters =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let randomString = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomString += characters[randomIndex];
    }
    return lang === "en" ? randomString : randomString;
  }
  const [captcha, setCaptcha] = useState(generateRandomString(6));

  useEffect(() => {
    setTimeout(() => {
      setCaptcha(generateRandomString(6));
    }, 40000);
    clearTimeout();
  }, [captcha]);

  const reloadCaptcha = () => {
    setCaptcha(generateRandomString(6));
  };
  return (
    <>
      <div className="backImg container-fluid">
        <div className="page p-4 rounded-4">
          <div
            className="d-flex justify-content-center flex-column align-items-center"
            style={{ position: "relative" }}
          >
            <img src={logo} width="95px" height="90px" alt="Logo" />
            <Typography
              color={"#214C55"}
              fontSize={"1.2rem"}
              fontWeight={"bold"}
            >
              {t("Abu Dhabi Intake24")}
            </Typography>
            <Typography
              className="mb-4"
              color={"#45AEAE"}
              fontSize={"1.1rem"}
              fontWeight={"bold"}
            >
              {t("Admin Portal")}
            </Typography>
            <div style={{ position: "absolute", right: "0", top: 0 }}>
              <Select
                size="small"
                value={lang}
                onChange={(e) => {
                  handleChange(e);
                }}
              >
                <MenuItem value={"en"}>En</MenuItem>
                <MenuItem value={"ar"}>Ar</MenuItem>
              </Select>
            </div>
          </div>
          <form
            autoComplete="none"
            onSubmit={formik.handleSubmit}
            style={{ width: "100%" }}
          >
            <div dir={lang === "ar" ? "rtl" : ""}>
              <LoginTextfield
                value={formik.values.username}
                autoFocus
                fullWidth
                style={{ width: "100%" }}
                name="username"
                onChange={handleUserNameChange}
                autoComplete="off"
                error={formik.touched.username && formik.errors.username}
                inputProps={{
                  pattern: "[A-Za-z]*",
                  title: "Please enter only English letters",
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <img
                        src={userImage}
                        alt="label"
                        width={"15px"}
                        height={"15px"}
                      />
                    </InputAdornment>
                  ),
                }}
                className={`${
                  formik.touched.username && formik.errors.username
                    ? "mb-2 w-100"
                    : "mb-4 w-100"
                }`}
                placeholder={t("Username/Email ID")}
              />
              <div
                dir={lang === "ar" ? "rtl" : ""}
                style={{ position: "relative" }}
              >
                {formik.touched.username && formik.errors.username && (
                  <FormHelperText
                    style={{ position: "absolute", bottom: "0" }}
                    className={`${classes.helperText} mb-1`}
                  >
                    {formik.touched.username && formik.errors.username}
                  </FormHelperText>
                )}
              </div>
            </div>

            <div dir={lang === "ar" ? "rtl" : ""}>
              <LoginTextfield
                fullWidth
                style={{ width: "100%" }}
                error={formik.touched.password && formik.errors.password}
                type={type}
                name="password"
                value={formik.values.password}
                onChange={handlePasswordChange}
                placeholder={t("Password")}
                autoComplete="off"
                InputProps={{
                  startAdornment: (
                    <InputAdornment
                      position="start"
                      style={
                        lang === "ar"
                          ? { marginRight: "-5px", paddingLeft: "15px" }
                          : {}
                      }
                    >
                      <img
                        src={passImage}
                        alt="label"
                        width={"15px"}
                        height={"15px"}
                      />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => {
                          handleVisibility();
                        }}
                      >
                        {" "}
                        {type === "text" ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <div
                dir={lang === "ar" ? "rtl" : ""}
                style={{ position: "relative" }}
              >
                {formik.touched.password && formik.errors.password && (
                  <FormHelperText
                    className={classes.helperText}
                    style={{ position: "absolute", bottom: "0" }}
                  >
                    {formik.touched.password && formik.errors.password}
                  </FormHelperText>
                )}
              </div>
            </div>
            <div
              className="mb-1 mt-3"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                width: "100%",
              }}
              dir={lang === "ar" ? "rtl" : ""}
            >
              <div
                className="d-flex align-items-center justify-content-center"
                style={{
                  background: "#e9efed",
                  color: "#214C55",
                  borderRadius: "5px",
                  width: "80%",
                  maxWidth: "220px",
                }}
                dir={lang === "ar" ? "rtl" : ""}
              >
                <div class="wrapper">
                  <div class="captcha-area">
                    <div class="captcha-img">
                      <img src={image} alt="Captch Background" />
                      <span class="captcha">
                        {lang === "ar"
                          ? captcha?.split("").reverse().join("")
                          : captcha}
                      </span>
                    </div>
                    <IconButton
                      className="reload-btn"
                      onClick={() => {
                        reloadCaptcha();
                      }}
                    >
                      <Refresh />
                    </IconButton>
                  </div>
                </div>
              </div>
              <div
                className="forgot"
                dir={lang === "ar" ? "rtl" : ""}
                style={{ width: "80%", maxWidth: "220px" }}
              >
                <TextField
                  size="small"
                  placeholder={t("Enter Captcha")}
                  name="captcha"
                  value={formik.values.captcha}
                  onChange={formik.handleChange}
                  error={formik.touched.captcha && formik.errors.captcha}
                  fullWidth
                />
                <div
                  dir={lang === "ar" ? "rtl" : ""}
                  style={{ position: "relative" }}
                >
                  {formik.touched.captcha && formik.errors.captcha && (
                    <FormHelperText
                      style={{ position: "absolute", bottom: "400" }}
                      className={`${classes.helperText} mb-1`}
                    >
                      {formik.touched.captcha && formik.errors.captcha}
                    </FormHelperText>
                  )}
                </div>
              </div>
            </div>
            <div className="remember  mt-3" dir={lang === "ar" ? "rtl" : ""}>
              <div className="d-flex align-items-center">
                <label className="label">
                  {t("Keep me logged in")}
                  <input
                    type="checkbox"
                    onClick={(e) => {
                      handleRemember(e);
                    }}
                  />
                  <span className="checkmark"></span>
                </label>
              </div>
              <div className="forgot">
                <Button
                  variant="text"
                  style={{
                    color: "#45AEAE",
                    textTransform: "none",
                    padding: 0,
                    marginTop: "-2px",
                  }}
                  onClick={() => {
                    navigate("/forgotpassword");
                  }}
                >
                  {t("Forgot Password?")}
                </Button>
              </div>
            </div>
            <div
              style={{ fontSize: "14px" }}
              className="d-flex justify-content-center mb-4"
            ></div>
            <button className="btn btn-app" type="submit">
              {t("Login")}
            </button>
          </form>
        </div>
        <img src={aptiway} alt="Logo" className="bottom-right-logo" />

        {load && <Loader />}
      </div>
    </>
  );
};

export default Login;
