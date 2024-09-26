import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  ListItemText,
  Stack,
  TextField,
  Typography,
  styled,
  useTheme,
} from "@mui/material";

import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MuiMenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import { toast } from "react-toastify";

import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { setApiErrorStatusCode } from "../../store/slices/app.tsx";
import {
  CheckCircleOutline,
  HighlightOff,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import createCache from "@emotion/cache";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import { useTranslation } from "react-i18next";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});
const cacheLtr = createCache({
  key: "mui-ltr",
  stylisPlugins: [prefixer],
});

const CreateUser = () => {
  const theme = useTheme();

  const navigate = useNavigate();

  const [userRoles, setUserRoles] = useState([]);
  const lang = sessionStorage.getItem("lang");
  useEffect(() => {
    axios({
      method: "get",
      url: `/api/user/getUserRoles`,
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${appState?.accessToken}`,
      },
    })
      .then((res) => {
        setUserRoles(res?.data?.data);
      })
      .catch((err) => {
        if (err?.response?.status != 401) {
          toast(`${err?.response?.data?.Errors[0]}`, {
            position: "top-center",
            autoClose: 4000,
            hideProgressBar: false,
            pauseOnHover: true,
            draggable: true,
            type: "error",
          });
        }
        dispatch(setApiErrorStatusCode(err?.response?.status));
      });
  }, []);
  const handleKeyPress = (e) => {
    if (e.key === " ") {
      e.preventDefault();
    }
  };
  const appState = useSelector((state) => state?.app);
  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      username: "",
      password: "",
      roles: [],
      email: "",
      phoneNumber: "",
    },
    onSubmit: (values) => {
      if (
        !/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}/.test(
          values.password
        )
      ) {
        return;
      }
      axios
        .post(
          "/api/user/addUser",
          {
            ...values,
            roles: userRoles
              ?.filter((role) => formik.values.roles.includes(role.roleName))
              .map((roles) => roles?.id),
            phoneNumber: values.phoneNumber.toString(),
          },
          {
            headers: { authorization: `Bearer ${appState?.accessToken}` },
          }
        )
        .then((res) => {
          if (res?.data?.isSuccess === true) {
            toast(t("User Created Successfully"), {
              position: "top-center",
              autoClose: 4000,
              hideProgressBar: false,
              pauseOnHover: true,
              draggable: true,
              type: "success",
            });
          }
          navigate("/userManagement");
        })
        .catch((err) => {
          if (err?.response?.status != 401) {
            toast(`${err?.response?.data?.Errors[0]}`, {
              position: "top-center",
              autoClose: 4000,
              hideProgressBar: false,
              pauseOnHover: true,
              draggable: true,
              type: "error",
            });
          }
          dispatch(setApiErrorStatusCode(err?.response?.status));
        });
    },
    validate: (values) => {
      const errors = {};
      if (!values.firstName.trim()) {
        errors.firstName = `${t("First Name Required")}`;
      }
      if (!values.lastName.trim()) {
        errors.lastName = `${t("Last Name Required")}`;
      }
      if (!values.phoneNumber) {
        errors.phoneNumber = `${t("Phone Number Required")}`;
      }
      if (!values.username.trim()) {
        errors.username = `${t("User Name Required")}`;
      }

      if (!values.email) {
        errors.email = `${t("Email Required")}`;
      } else if (!/\S+@\S+\.\S+/.test(values.email)) {
        errors.email = `${t("Invalid Email Format")}`;
      }
      if (!values.roles.length) {
        errors.roles = "Role(s) Required";
      }
      return errors;
    },
  });

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    formik.setFieldValue(
      "roles",
      typeof value === "string" ? value.split(",") : value
    );
  };

  const [type, setType] = useState("password");
  const handleVisibility = () => {
    setType(type === "text" ? "password" : "text");
  };

  const MenuItem = styled((props) => (
    <div dir={lang === "ar" ? "rtl" : ""}>
      <MuiMenuItem {...props} />
    </div>
  ))(({ theme }) => ({}));
  const { t } = useTranslation();

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
  const PasswordComplexityIndicator = ({ valid, message }) => {
    return (
      <Box display={"flex"} alignItems={"center"}>
        {valid ? (
          <CheckCircleOutline style={{ color: "green", fontSize: "1.2rem" }} />
        ) : (
          <HighlightOff style={{ color: "red", fontSize: "1.2rem" }} />
        )}{" "}
        <Typography fontSize={"0.9rem"}>{message}</Typography>
      </Box>
    );
  };
  const passwordRequirements = [
    {
      pattern: /(?=.*[A-Z])/,
      message: t("At least one uppercase letter"),
    },
    {
      pattern: /(?=.*[a-z])/,
      message: t("At least one lowercase letter"),
    },
    {
      pattern: /(?=.*\d)/,
      message: t("At least one digit"),
    },
    {
      pattern: /(?=.*[!@#$%^&*(),.?":{}|<>])/,
      message: t("At least one special character"),
    },
    {
      pattern: /.{8,}/,
      message: t("At least 8 characters long"),
    },
  ];

  const passwordIndicators = passwordRequirements.map(
    ({ pattern, message }) => ({
      message,
      valid: pattern.test(formik.values.password),
    })
  );

  return (
    <Box>
      <Stack justifyContent="center" alignItems={"center"}>
        <Card
          sx={{
            maxWidth: 450,
            minHeight: 400,
            bordertop: `3px solid ${theme.palette.primary.main}`,
            paddingX: 2,
          }}
        >
          <CardContent>
            <Grid container spacing={2} position={"relative"}>
              <Grid item xs={12} sm={12}>
                <Stack justifyContent="center" alignItems="center">
                  <PersonAddAltOutlinedIcon
                    sx={{
                      fontSize: "4rem",
                      color: `${theme.palette.grey[500]}`,
                      borderRadius: "5%",
                      fontSizeAdjust: 4,
                    }}
                  />
                  <Typography
                    variant="h5"
                    color={(theme) => theme.palette.grey[500]}
                    component="h2"
                    guttertop={"true"}
                    textTransform={"uppercase"}
                    fontWeight={600}
                    letterSpacing={3}
                  >
                    {t("Add User")}
                  </Typography>
                </Stack>
              </Grid>
              <form onSubmit={formik.handleSubmit}>
                <CacheProvider value={lang === "ar" ? cacheRtl : cacheLtr}>
                  <Grid container spacing={2} position={"relative"}>
                    <Grid item xs={12} sm={12}>
                      <div dir={lang === "ar" ? "rtl" : ""}>
                        <TextField
                          size="small"
                          name="firstName"
                          placeholder={t("Enter First Name")}
                          label={t("First Name")}
                          fullWidth
                          value={formik.values.firstName}
                          onChange={formik.handleChange}
                          error={
                            formik.touched.firstName && formik.errors.firstName
                              ? true
                              : false
                          }
                          helperText={
                            formik.touched.firstName &&
                            formik.errors.firstName &&
                            formik.errors.firstName
                          }
                        />
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                      <div dir={lang === "ar" ? "rtl" : ""}>
                        <TextField
                          size="small"
                          name="lastName"
                          placeholder={t("Enter Last Name")}
                          label={t("Last Name")}
                          fullWidth
                          value={formik.values.lastName}
                          onChange={formik.handleChange}
                          error={
                            formik.touched.lastName && formik.errors.lastName
                              ? true
                              : false
                          }
                          helperText={
                            formik.touched.lastName &&
                            formik.errors.lastName &&
                            formik.errors.lastName
                          }
                        />
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                      <div dir={lang === "ar" ? "rtl" : ""}>
                        <TextField
                          size="small"
                          placeholder={t("Enter UserName")}
                          name="username"
                          label={t("Username")}
                          fullWidth
                          value={formik.values.username}
                          onChange={handleUserNameChange}
                          error={
                            formik.touched.username && formik.errors.username
                              ? true
                              : false
                          }
                          helperText={
                            formik.touched.username &&
                            formik.errors.username &&
                            formik.errors.username
                          }
                        />
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                      <div dir={lang === "ar" ? "rtl" : ""}>
                        <TextField
                          size="small"
                          name="email"
                          placeholder={t("Enter Email Address")}
                          label={t("Email Address")}
                          fullWidth
                          value={formik.values.email}
                          onChange={formik.handleChange}
                          error={
                            formik.touched.email && formik.errors.email
                              ? true
                              : false
                          }
                          helperText={
                            formik.touched.email &&
                            formik.errors.email &&
                            formik.errors.email
                          }
                        />
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                      <div dir={lang === "ar" ? "rtl" : ""}>
                        <TextField
                          size="small"
                          name="phoneNumber"
                          placeholder={t("Enter Phone Number")}
                          label={t("Phone Number")}
                          fullWidth
                          type="number"
                          value={formik.values.phoneNumber}
                          onChange={formik.handleChange}
                          error={
                            formik.touched.phoneNumber &&
                            formik.errors.phoneNumber
                              ? true
                              : false
                          }
                          helperText={
                            formik.touched.phoneNumber &&
                            formik.errors.phoneNumber &&
                            formik.errors.phoneNumber
                          }
                        />
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                      <div dir={lang === "ar" ? "rtl" : ""}>
                        <TextField
                          style={{ marginBottom: "10px" }}
                          size="small"
                          fullWidth
                          value={formik.values.password}
                          name="password"
                          label={t("Password")}
                          placeholder={t("Enter Password")}
                          onChange={handlePasswordChange}
                          onKeyDown={handleKeyPress}
                          error={
                            formik.touched.password && formik.errors.password
                              ? true
                              : false
                          }
                          helperText={
                            formik.touched.password &&
                            formik.errors.password &&
                            formik.errors.password
                          }
                          type={type}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() => {
                                    handleVisibility();
                                  }}
                                >
                                  {" "}
                                  {type === "text" ? (
                                    <Visibility />
                                  ) : (
                                    <VisibilityOff />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                        {passwordIndicators.map(({ message, valid }, index) => (
                          <PasswordComplexityIndicator
                            key={index}
                            message={message}
                            valid={valid}
                          />
                        ))}
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                      <div dir={lang === "ar" ? "rtl" : ""}>
                        <FormControl fullWidth size="small">
                          <InputLabel id="demo-multiple-checkbox-label">
                            {t("Select Role(s)")}
                          </InputLabel>

                          <Select
                            labelId="demo-multiple-checkbox-label"
                            id="demo-multiple-checkbox"
                            multiple
                            value={formik.values.roles}
                            handleBlur={formik.handleBlur}
                            onChange={handleChange}
                            input={
                              <OutlinedInput label={t("Select Role(s)")} />
                            }
                            renderValue={(selected) => (
                              <Box
                                sx={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  gap: 0.5,
                                }}
                              >
                                {selected.map((value) => (
                                  <Chip key={value} label={value} />
                                ))}
                              </Box>
                            )}
                            MenuProps={MenuProps}
                            error={
                              formik.touched.roles && formik.errors.roles
                                ? true
                                : false
                            }
                          >
                            {userRoles.map((role) => (
                              <MenuItem
                                key={role.id}
                                value={role.roleName}
                                name={role.roleName}
                              >
                                <Checkbox
                                  checked={
                                    formik.values.roles.indexOf(role.roleName) >
                                    -1
                                  }
                                />
                                <ListItemText primary={role.roleName} />
                              </MenuItem>
                            ))}
                          </Select>

                          <FormHelperText
                            style={
                              formik.touched.roles && formik.errors.roles
                                ? { display: "block", color: "#d32f2f" }
                                : { display: "none" }
                            }
                          >
                            {t("Role(s) Required")}
                          </FormHelperText>
                        </FormControl>
                      </div>
                    </Grid>

                    <Grid item xs={12} sm={12}>
                      <div dir={lang === "ar" ? "rtl" : ""}>
                        <Stack
                          display={"flex"}
                          flexDirection={"row"}
                          justifyContent={"center"}
                          gap={1}
                        >
                          <Button
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            style={{ color: "white" }}
                            onClick={() => {
                              navigate("/userManagement");
                            }}
                          >
                            {t("Cancel")}
                          </Button>
                          <Button
                            fullWidth
                            type="submit"
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            style={{ color: "white" }}
                            // onClick={HandelSubmit}
                          >
                            {t("Submit")}
                          </Button>
                        </Stack>
                      </div>
                    </Grid>
                  </Grid>
                </CacheProvider>
              </form>
            </Grid>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
};

export default CreateUser;
