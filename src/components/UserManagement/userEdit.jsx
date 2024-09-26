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
  MenuItem,
  Stack,
  styled,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";

import InputLabel from "@mui/material/InputLabel";
import MuiMenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import PersonAddAltOutlinedIcon from "@mui/icons-material/Edit";
import { toast } from "react-toastify";

import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { setApiErrorStatusCode } from "../../store/slices/app.tsx";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import createCache from "@emotion/cache";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import makeStyles from "@mui/styles/makeStyles";

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

const UserUpdate = () => {
  const lang = sessionStorage.getItem("lang");

  const handleUserNameChange = (event) => {
    const inputValue = event.target.value;
    const onlyEnglishLettersAndNumbersAndSpecialChars =
      /^[a-zA-Z0-9\s!@#$%^&*(),.?":{}|<>]*$/;
    if (onlyEnglishLettersAndNumbersAndSpecialChars.test(inputValue)) {
      formik.setFieldValue("username", inputValue);
    }
  };
  const navigate = useNavigate();
  const MenuItem = styled((props) => (
    <div dir={lang === "ar" ? "rtl" : ""}>
      <MuiMenuItem {...props} />
    </div>
  ))(({ theme }) => ({}));
  const [user, setUser] = useState({});
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const id = queryParams?.get("id");

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
          toast(`${err?.response?.data?.errors[0]}`, {
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
  const [userRoles, setUserRoles] = useState([]);

  useEffect(() => {
    if (userRoles?.length) {
      axios({
        method: "get",
        url: `/api/user/getUsers/${id}`,
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${appState?.accessToken}`,
        },
      })
        .then((res) => {
          setUser(res?.data?.data);

          formik.setValues({
            ...res?.data?.data,
            roles: res?.data?.data?.roles?.map((role) => role?.roleName),
          });
        })
        .catch((err) => {
          if (err?.response?.status != 401) {
            toast(`${err?.response?.data?.errors[0]}`, {
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
    }
  }, [userRoles]);
  const appState = useSelector((state) => state?.app);

  const dispatch = useDispatch();
  const { t } = useTranslation();

  const formik = useFormik({
    initialValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      username: user?.username || "",

      roles: user?.roles || [],
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || "",
    },
    onSubmit: (values) => {
      axios
        .put(
          `/api/user/updateUser/${id}`,
          {
            ...values,
            roles: userRoles
              ?.filter((role) => values.roles.includes(role.roleName))
              .map((roles) => roles?.id),
            phoneNumber: values.phoneNumber.toString(),
          },
          {
            headers: { authorization: `Bearer ${appState?.accessToken}` },
          }
        )
        .then((res) => {
          if (
            res?.data?.isSuccess === true &&
            appState?.loginInfo?.user_id === id
          ) {
            toast(t("User Updated Successfully, Please Login again"), {
              position: "top-center",
              autoClose: 4000,
              hideProgressBar: false,
              pauseOnHover: true,
              draggable: true,
              type: "success",
            });
            navigate("/");
          } else {
            toast(t("User Updated Successfully"), {
              position: "top-center",
              autoClose: 4000,
              hideProgressBar: false,
              pauseOnHover: true,
              draggable: true,
              type: "success",
            });
            navigate("/userManagement");
          }
        })
        .catch((err) => {
          if (err?.response?.status !== 401) {
            toast(`${err?.response?.data?.errors[0]}`, {
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
      if (!values.firstName) {
        errors.firstName = `${t("First Name Required")}`;
      }
      if (!values.lastName) {
        errors.lastName = `${t("Last Name Required")}`;
      }
      if (!values.phoneNumber) {
        errors.phoneNumber = `${t("Phone Number Required")}`;
      }
      if (!values.username) {
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
  return (
    <div>
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
                  variant="outlined"
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
                    formik.touched.email && formik.errors.email ? true : false
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
                  type="number"
                  fullWidth
                  value={formik.values.phoneNumber}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.phoneNumber && formik.errors.phoneNumber
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
                <FormControl fullWidth size="small">
                  <InputLabel id="demo-multiple-name-label">
                    {t("Select Role(s)")}
                  </InputLabel>
                
                  <Select
                    labelId="demo-multiple-name-label"
                    id="demo-multiple-select"
                    name="roles"
                    multiple
                    label={t("Select Role(s)")}
                   
                    error={
                      formik.touched.roles && formik.errors.roles ? true : false
                    }
                    value={formik?.values?.roles}
                    onChange={handleChange}
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} />
                        ))}
                      </Box>
                    )}
                    MenuProps={MenuProps}
                  >
                    {userRoles?.map((role, index) => (
                      <MenuItem key={index} value={role?.roleName}>
                        <Checkbox
                          checked={
                            formik.values?.roles?.indexOf(role?.roleName) > -1
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
                    // color="orange"
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
                    // onClick={HandelSubmit}
                  >
                    {t("Submit")}
                  </Button>
                </Stack>
              </div>
            </Grid>
          </Grid>
          {/* </div> */}
        </CacheProvider>
      </form>
    </div>
  );
};

const PasswordUpdate = () => {
  const lang = sessionStorage.getItem("lang");
  const { t } = useTranslation();
  const [load, setLoad] = useState(false);
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [cpassword, setCpassword] = useState("");
  const appState = useSelector((state) => state?.app);
  const [user, setUser] = useState({});
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const id = queryParams?.get("id");
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowPassword1 = () => setShowPassword1((show1) => !show1);
  useEffect(() => {
    if (true) {
      axios({
        method: "get",
        url: `/api/user/getUsers/${id}`,
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${appState?.accessToken}`,
        },
      })
        .then((res) => {
          setUser(res?.data?.data);
          
        })
        .catch((err) => {
          if (err?.response?.status != 401) {
            toast(`${err?.response?.data?.errors[0]}`, {
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
    }
  }, []);
  const handleKeyPress = (e) => {
    if (e.key === " ") {
      e.preventDefault(); // Prevent space from being entered
    }
  };
  const handleSubmit2 = (e) => {
    e.preventDefault();
    const trimmedPassword = password.trim();
    const trimmedCpassword = cpassword.trim();
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!trimmedPassword) {
      toast.error(`${t("Please Enter New Password")}`);
    } else if (!passwordRegex.test(trimmedPassword)) {
      toast.error(
        `${t(
          "Your password must be at least 8 characters long and include uppercase letters, lowercase letters, numbers, and special characters."
        )}`
      );
    } else if (!trimmedCpassword) {
      toast.error(`${t("Please Enter ConfirmPassword")}`);
    } else if (trimmedPassword !== trimmedCpassword) {
      toast.error(`${t("Password and ConfirmPassword Not Same")}`);
    } else {
      axios
        .patch(
          `/api/user/forgotpassword/${user?.username}`,

          [
            {
              operationType: 0,
              path: "password",
              op: "replace",
              from: "admin",
              value: trimmedCpassword,
            },
          ]
        )
        .then((res) => {
          if (res?.data?.isSuccess === true) {
            setLoad(false);
            toast(t("Password changed successfully"), {
              position: "top-center",
              autoClose: 4000,
              hideProgressBar: false,
              pauseOnHover: true,
              draggable: true,
              type: "success",
            });
            navigate("/userManagement");
          }
        })
        .catch((err) => {
          setLoad(false);
          toast.error(err?.response?.data?.Errors[0]);
        });
      setCpassword("");
      setPassword("");
    }
  };

  return (
    <div>
      <Box>
        <CacheProvider value={lang === "ar" ? cacheRtl : cacheLtr}>
          <Grid container spacing={2} position={"relative"}>
            <Grid item xs={12} sm={12}>
              <div dir={lang === "ar" ? "rtl" : ""}>
                <TextField
                  value={user?.username}
                  fullWidth
                  size="small"
                  variant="outlined"
                  name="username"
                  disabled
                  placeholder={t("Username/Email ID")}
                />
              </div>
            </Grid>
            <Grid item xs={12} sm={12}>
              <div dir={lang === "ar" ? "rtl" : ""}>
                <TextField
                  fullWidth
                  size="small"
                  name="Password"
                  variant="outlined"
                  placeholder={t("Enter New Password")}
                  label={t("New Password")}
                  value={password}
                  type={showPassword ? "text" : "password"}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyPress}
                  autoComplete="off"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          edge="end"
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
            </Grid>
            <Grid item xs={12} sm={12}>
              <div dir={lang === "ar" ? "rtl" : ""}>
                <TextField
                  variant="outlined"
                  name="confirmpassword"
                  fullWidth
                  size="small"
                  label={t("Confirm New Password")}
                  value={cpassword}
                  onChange={(e) => setCpassword(e.target.value)}
                  placeholder={t("Confirm New Password")}
                  type={showPassword1 ? "text" : "password"}
                  onKeyDown={handleKeyPress}
                  autoComplete="off"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword1}
                          edge="end"
                        >
                          {showPassword1 ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <Button
                variant="contained"
                style={{ color: "white" }}
                size="small"
                fullWidth
                onClick={() => {
                  navigate("/userManagement");
                }}
              >
                {t("Cancel")}
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <Button
                variant="contained"
                size="small"
                style={{ color: "white" }}
                fullWidth
                onClick={handleSubmit2}
              >
                {t("Update")}
              </Button>
            </Grid>
          </Grid>
        </CacheProvider>
      </Box>
    </div>
  );
};

const UpdateUser = () => {
  const lang = sessionStorage.getItem("lang");
  const theme = useTheme();
  const [selectedOption, setSelectedOption] = useState("");
  const { t } = useTranslation();

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };

  let renderedComponent;
  switch (selectedOption) {
    case "UserUpdate":
      renderedComponent = <UserUpdate />;
      break;
    case "PasswordUpdate":
      renderedComponent = <PasswordUpdate />;
      break;
    default:
  }

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
                      fontSize: "2.5rem",
                      color: `${theme.palette.grey[500]}`,
                      borderRadius: "3%",
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
                    {t("UPDATE USER DETAILS")}
                  </Typography>
                  <CacheProvider value={lang === "ar" ? cacheRtl : cacheLtr}>
                    <div dir={lang === "ar" ? "rtl" : ""}>
                      <Box pt={3}>
                        <FormControl size="small" sx={{ width: 383 }}>
                          <InputLabel id="Options">
                            {t("Select user update option")}
                          </InputLabel>
                          <Select
                            labelId="Select user update option"
                            id="Select user update option"
                            value={selectedOption}
                            label={t("Select user update option")}
                            size="small"
                            onChange={handleChange}
                          >
                            <MenuItem value="UserUpdate">
                              {t("UserUpdate")}
                            </MenuItem>
                            <MenuItem value="PasswordUpdate">
                              {t("PasswordUpdate")}
                            </MenuItem>
                          </Select>
                        </FormControl>
                      </Box>
                    </div>
                  </CacheProvider>
                  <Box mt={2}>{renderedComponent}</Box>
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
};

export default UpdateUser;
