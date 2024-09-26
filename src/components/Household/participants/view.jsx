import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  FormHelperText,
  Grid,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import makeStyles from "@mui/styles/makeStyles";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import moment from "moment";
import { toast } from "react-toastify";
import { setParticipant } from "../../../store/slices/app.tsx";
import axios from "../../../api/axios.js";
import { useLocation, useNavigate } from "react-router-dom";

const useStyles = makeStyles(() => ({
  input: {
    border: "1px solid #C1C1C1",
    borderRadius: "5px",
    outline: "none",
  },
  focused: {
    border: "none",
  },
}));

const ViewParticipants = () => {
  const classes = useStyles();

  const dispatch = useDispatch();

  const appState = useSelector((state) => state?.app);
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const id = queryParams?.get("id");

  useEffect(() => {
    axios
      .get(`/api/participants/${id}`)
      .then((res) => {
        console.log("Zxcvbnjhdxcvbhytfv", res.data);
        dispatch(setParticipant(res.data));
        console.log(appState?.participant?.headOfFamily?.toString());
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      participantCode: appState?.participant?.participantCode || "",
      participantId: appState?.participant?.participantId,
      headOfFamily: appState?.participant?.headOfFamily?.toString() || "",
      firstName: appState?.participant?.firstName || "",
      familyName: appState?.participant?.familyName || "",

      // phoneNumber: appState?.participant?.phoneNumber || "",
      // city: appState?.houseHold?.participants[memberIndex]?.city || "",
      // streetNo: appState?.participant?.streetNo || "",
      genderId: appState?.participant?.genderId || "",
      dob: appState?.participant?.dob || "",
      // relationship: appState?.participant?.relationship || "",
      academicLevelId: appState?.participant?.academicLevelId || "",
      maritalStatusId: appState?.participant?.maritalStatusId || "",
      occupationId: appState?.participant?.occupationId || "",
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      dispatch(setParticipant({ ...appState?.participant, ...values }));
      axios
        .put(`/api/participants/${id}`, {
          ...appState?.participant,
          ...values,
          dob: moment(values.dob["$d"]).format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
          headOfFamily: values.headOfFamily === "false" ? false : true,
        })
        .then((res) => {
          if (res?.length) {
            toast("Participant details have been edited successfully", {
              position: "top-center",
              autoClose: 4000,
              hideProgressBar: false,
              pauseOnHover: true,
              draggable: true,
              type: "success",
            });
            navigate("/household/participants");
          }
        })
        .then((err) => {
          toast("Error Occured", {
            position: "top-center",
            autoClose: 4000,
            hideProgressBar: false,
            pauseOnHover: true,
            draggable: true,
            type: "error",
          });
        });
    },
    validate: (values) => {
      const errors = {};
      if (!values.participantCode) {
        errors.participantCode = "Member Code Required";
      }
      if (!values.firstName) {
        errors.firstName = "First Name Required";
      }
      if (!values.familyName) {
        errors.familyName = "Family Name Required";
      }
      if (!values.genderId) {
        errors.genderId = "Gender Required";
      }
      if (!values.dob) {
        errors.dob = "DOB Required";
      }
      // if (!values.relationship) {
      //   errors.relationship = "Relationship Required";
      // }
      if (!values.academicLevelId) {
        errors.academicLevelId = "Academic Level Required";
      }
      if (!values.maritalStatusId) {
        errors.maritalStatusId = "Marital Status Required";
      }
      if (!values.occupationId) {
        errors.occupationId = "Occupation Required";
      }
      if (!values.headOfFamily) {
        errors.headOfFamily = "Head of Family Required";
      }
      return errors;
    },
  });

  const handleChange = (date) => {
    formik.setFieldValue("dob", date);
  };
  const handleDelete = () => {
    axios
      .delete(`/api/participants/${id}`)
      .then((res) => {
        if (res?.data?.length) {
          toast("Participant deleted successfully", {
            position: "top-center",
            autoClose: 4000,
            hideProgressBar: false,
            pauseOnHover: true,
            draggable: true,
            type: "success",
          });
          navigate("/household/participants");
        }
      })
      .catch((err) => {
        toast(err?.response?.data?.Errors[0], {
          position: "top-center",
          autoClose: 4000,
          hideProgressBar: false,
          pauseOnHover: true,
          draggable: true,
          type: "error",
        });
      })
      
  };
  return (
    <Box>
      <Card>
        <CardContent>
          <Typography fontSize={"1.3rem"} fontWeight={"bold"}>
            Participant Details
          </Typography>
          <form onSubmit={formik.handleSubmit}>
            <Grid
              container
              columnSpacing={2}
              rowSpacing={2}
              padding={{ lg: "20px 40px 30px 30px", xs: "10px" }}
            >
              <Grid item sm={12} xs={12} md={6} lg={4}>
                <Typography color={"#1D2420"} marginLeft={"1rem"}>
                  Participant Code
                </Typography>
                <Box
                  display={"flex"}
                  alignItems={"center"}
                  gap={0.5}
                  color={"#5A6670"}
                >
                  <span>A</span>
                  <TextField
                    size="small"
                    style={{ width: "100%" }}
                    value={formik.values.participantCode}
                    name="participantCode"
                    InputProps={{
                      className: classes.input,
                      classes: {
                        focused: classes.focused,
                      },
                    }}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.participantCode &&
                      formik.errors.participantCode
                        ? true
                        : false
                    }
                    helperText={
                      formik.touched.participantCode &&
                      formik.errors.participantCode &&
                      formik.errors.participantCode
                    }
                  />
                </Box>
              </Grid>
              <Grid item sm={12} xs={12} md={6} lg={4}>
                <Typography color={"#1D2420"} marginLeft={"1rem"}>
                  First Name
                </Typography>
                <Box
                  display={"flex"}
                  alignItems={"center"}
                  gap={0.5}
                  color={"#5A6670"}
                >
                  <span>B</span>
                  <TextField
                    size="small"
                    style={{ width: "100%" }}
                    value={formik.values.firstName}
                    name="firstName"
                    InputProps={{
                      className: classes.input,
                      classes: {
                        focused: classes.focused,
                      },
                    }}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
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
                </Box>
              </Grid>
              <Grid item sm={12} xs={12} md={6} lg={4}>
                <Typography color={"#1D2420"} marginLeft={"1rem"}>
                  Family Name
                </Typography>
                <Box
                  display={"flex"}
                  alignItems={"center"}
                  gap={0.5}
                  color={"#5A6670"}
                >
                  <span>C</span>
                  <TextField
                    size="small"
                    style={{ width: "100%" }}
                    value={formik.values.familyName}
                    name="familyName"
                    InputProps={{
                      className: classes.input,
                      classes: {
                        focused: classes.focused,
                      },
                    }}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.familyName && formik.errors.familyName
                        ? true
                        : false
                    }
                    helperText={
                      formik.touched.familyName &&
                      formik.errors.familyName &&
                      formik.errors.familyName
                    }
                  />
                </Box>
              </Grid>
              <Grid item sm={12} xs={12} md={6} lg={4}>
                <Typography color={"#1D2420"} marginLeft={"1rem"}>
                  Gender
                </Typography>
                <Box
                  display={"flex"}
                  alignItems={"center"}
                  gap={0.5}
                  color={"#5A6670"}
                >
                  <span>G</span>
                  <FormControl fullWidth size="small" name="gender">
                    <Select
                      size="small"
                      sx={{
                        ".MuiSelect-outlined": {
                          border: "1.5px solid #C1C1C1",
                          borderRadius: "5px",
                          outline: "none",
                        },
                      }}
                      value={formik.values.genderId}
                      name="genderId"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.genderId && formik.errors.genderId
                          ? true
                          : false
                      }
                      helperText={
                        formik.touched.genderId &&
                        formik.errors.genderId &&
                        formik.errors.genderId
                      }
                    >
                      <MenuItem value="">Select</MenuItem>
                      <MenuItem value={1}>Twenty</MenuItem>
                      <MenuItem value={2}>Thirty</MenuItem>
                    </Select>
                    <FormHelperText
                      style={
                        formik.touched.genderId && formik.errors.genderId
                          ? { display: "block", color: "#d32f2f" }
                          : { display: "none" }
                      }
                    >
                      Gender Required
                    </FormHelperText>
                  </FormControl>
                </Box>
              </Grid>
              <Grid item sm={12} xs={12} md={6} lg={4}>
                <Typography color={"#1D2420"} marginLeft={"1rem"}>
                  DOB
                </Typography>
                <Box
                  display={"flex"}
                  alignItems={"center"}
                  gap={0.5}
                  color={"#5A6670"}
                >
                  <span>H</span>
                  <FormControl size="small" fullWidth name="dob">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        size="small"
                        //value={fromdate}
                        style={{ width: "100%" }}
                        fullWidth
                        name={"dob"}
                        format="DD/MM/YYYY"
                        value={null || dayjs(formik.values.dob)}
                        onChange={handleChange}
                        onBlur={formik.handleBlur}
                        slotProps={{
                          textField: {
                            size: "small",
                            helperText:
                              formik.touched.dob &&
                              formik.errors.dob &&
                              formik.errors.dob,
                            error:
                              formik.touched.dob && formik.errors.dob
                                ? true
                                : false,
                          },
                        }}
                        renderInput={(params) => (
                          <TextField
                            InputProps={{
                              className: classes.input,
                              classes: {
                                focused: classes.focused,
                              },
                            }}
                            fullWidth
                          
                            name="dob"
                            value={formik.values.dob}
                            sx={{
                              "& .MuiInputBase-input": {
                                height: "10px",
                              },
                              width: "100%",
                            }}
                            {...params}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  </FormControl>
                </Box>
              </Grid>

              <Grid item sm={12} xs={12} md={6} lg={4}>
                <Typography color={"#1D2420"} marginLeft={"1rem"}>
                  Academic Level
                </Typography>
                <Box
                  display={"flex"}
                  alignItems={"center"}
                  gap={0.5}
                  color={"#5A6670"}
                >
                  <span>J</span>
                  <FormControl fullWidth size="small">
                    <Select
                      size="small"
                      sx={{
                        ".MuiSelect-outlined": {
                          border: "1.5px solid #C1C1C1",
                          borderRadius: "5px",
                          outline: "none",
                        },
                      }}
                    
                      value={formik.values.academicLevelId}
                      name="academicLevelId"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.academicLevelId &&
                        formik.errors.academicLevelId
                          ? true
                          : false
                      }
                      helperText={
                        formik.touched.academicLevelId &&
                        formik.errors.academicLevelId &&
                        formik.errors.academicLevelId
                      }
                    >
                      <MenuItem value="">Select</MenuItem>
                      <MenuItem value={1}>Twenty</MenuItem>
                      <MenuItem value={2}>Thirty</MenuItem>
                    </Select>
                    <FormHelperText
                      style={
                        formik.touched.academicLevelId &&
                        formik.errors.academicLevelId
                          ? { display: "block", color: "#d32f2f" }
                          : { display: "none" }
                      }
                    >
                      Academic Level Required
                    </FormHelperText>
                  </FormControl>
                </Box>
              </Grid>
              <Grid item sm={12} xs={12} md={6} lg={4}>
                <Typography color={"#1D2420"} marginLeft={"1rem"}>
                  Marital Status
                </Typography>
                <Box
                  display={"flex"}
                  alignItems={"center"}
                  gap={0.5}
                  color={"#5A6670"}
                >
                  <span>K</span>
                  <FormControl fullWidth size="small">
                    <Select
                      size="small"
                      sx={{
                        ".MuiSelect-outlined": {
                          border: "1.5px solid #C1C1C1",
                          borderRadius: "5px",
                          outline: "none",
                        },
                      }}
                      value={formik.values.maritalStatusId}
                      name="maritalStatusId"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.maritalStatusId &&
                        formik.errors.maritalStatusId
                          ? true
                          : false
                      }
                      helperText={
                        formik.touched.maritalStatusId &&
                        formik.errors.maritalStatusId &&
                        formik.errors.maritalStatusId
                      }
                    >
                      <MenuItem value="">Select</MenuItem>
                      <MenuItem value={1}>Twenty</MenuItem>
                      <MenuItem value={2}>Thirty</MenuItem>
                    </Select>
                    <FormHelperText
                      style={
                        formik.touched.maritalStatusId &&
                        formik.errors.maritalStatusId
                          ? { display: "block", color: "#d32f2f" }
                          : { display: "none" }
                      }
                    >
                      Marital Status Required
                    </FormHelperText>
                  </FormControl>
                </Box>
              </Grid>
              <Grid item sm={12} xs={12} md={6} lg={4}>
                <Typography color={"#1D2420"} marginLeft={"1rem"}>
                  Occupation
                </Typography>
                <Box
                  display={"flex"}
                  alignItems={"center"}
                  gap={0.5}
                  color={"#5A6670"}
                >
                  <span>L</span>
                  <FormControl fullWidth size="small">
                    <Select
                      size="small"
                      sx={{
                        ".MuiSelect-outlined": {
                          border: "1.5px solid #C1C1C1",
                          borderRadius: "5px",
                          outline: "none",
                        },
                      }}
                      value={formik.values.occupationId}
                      name="occupationId"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.occupationId &&
                        formik.errors.occupationId
                          ? true
                          : false
                      }
                      helperText={
                        formik.touched.occupationId &&
                        formik.errors.occupationId &&
                        formik.errors.occupationId
                      }
                    >
                      <MenuItem value="">Select</MenuItem>
                      <MenuItem value={1}>Twenty</MenuItem>
                      <MenuItem value={2}>Thirty</MenuItem>
                    </Select>
                    <FormHelperText
                      style={
                        formik.touched.occupationId &&
                        formik.errors.occupationId
                          ? { display: "block", color: "#d32f2f" }
                          : { display: "none" }
                      }
                    >
                      Occupation Required
                    </FormHelperText>
                  </FormControl>
                </Box>
              </Grid>
              <Grid item sm={12} xs={12} md={6} lg={4}>
                <Typography color={"#1D2420"} marginLeft={"1rem"}>
                  Head Of Family
                </Typography>
                <Box
                  display={"flex"}
                  alignItems={"center"}
                  gap={0.5}
                  color={"#5A6670"}
                >
                  <span>L</span>
                  <FormControl fullWidth size="small">
                    <Select
                      size="small"
                      sx={{
                        ".MuiSelect-outlined": {
                          border: "1.5px solid #C1C1C1",
                          borderRadius: "5px",
                          outline: "none",
                        },
                      }}
                      value={formik.values.headOfFamily}
                      name="headOfFamily"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.headOfFamily &&
                        formik.errors.headOfFamily
                          ? true
                          : false
                      }
                      helperText={
                        formik.touched.headOfFamily &&
                        formik.errors.headOfFamily &&
                        formik.errors.headOfFamily
                      }
                    >
                      <MenuItem value="">Select</MenuItem>
                      <MenuItem value={"true"}>Yes</MenuItem>
                      <MenuItem value={"false"}>No</MenuItem>
                    </Select>
                    <FormHelperText
                      style={
                        formik.touched.headOfFamily &&
                        formik.errors.headOfFamily
                          ? { display: "block", color: "#d32f2f" }
                          : { display: "none" }
                      }
                    >
                      Head of Family Required
                    </FormHelperText>
                  </FormControl>
                </Box>
              </Grid>
            </Grid>
            <Box
              display={"flex"}
              justifyContent={{ md: "flex-end", xs: "center" }}
              gap={1}
            >
              <Button
                variant="contained"
                style={{
                  
                  width: "80px",
                  color: "white",
                  borderRadius: "8px",
                }}
                color="danger"
                onClick={() => {
                 
                  handleDelete();
                }}
              >
                Delete
              </Button>
              <Button
                variant="contained"
                style={{
                  // color: "white",
                  width: "80px",
                  color: "black",
                  border: "1.5px solid black",
                  borderRadius: "8px",
                }}
                color="white"
                type="submit"
              >
                Save
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ViewParticipants;
