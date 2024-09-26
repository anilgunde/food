import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  MenuItem as MuiMenuItem,
  Select,
  TextField,
} from "@mui/material";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import makeStyles from "@mui/styles/makeStyles";
import { useFormik } from "formik";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  addFamilyMember,
  resetHouseHolds,
  setApiErrorStatusCode,
  setComplete,
  setCompleteClear,
  setHouseHold,
  setLoading,
  setRefreshForViewHouseHolds,
  setSubmitClick,
  updatDetails,
  updateHouseHoldObj,
} from "../../../store/slices/app.tsx";
import CommonAccordion from "./CommonAccordion.jsx";

import img from "../../../assets/familyHead.png";
import moment from "moment/moment";
import axios from "../../../api/axios.js";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import createCache from "@emotion/cache";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";

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
const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});
const cacheLtr = createCache({
  key: "mui-ltr",
  stylisPlugins: [prefixer],
});
const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1.5px solid #45AEAE`,
  "&:not(:last-child)": {},
  "&:before": {
    display: "none",
  },
  marginBottom: "6px",
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon style={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiAccordionSummary-expandIconWrapper": {
    color: "#45AEAE",
  },
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    color: "#45AEAE",
  },
  "& .MuiAccordionSummary-content": {},
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({}));

function ViewHouseHolds() {
  const classes = useStyles();

  const dispatch = useDispatch();

  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const id = queryParams?.get("id");
  const page = queryParams?.get("page");
  const pageid = queryParams?.get("pageid");
  const appState = useSelector((state) => state?.app);

  useEffect(() => {
    dispatch(setRefreshForViewHouseHolds(false));
    if (appState?.refresh) {
      dispatch(setLoading(true));
      dispatch(resetHouseHolds());
      dispatch(setCompleteClear());
      axios
        .get(`/api/household/getHouseholdWithparticipants/${id}`, {
          headers: { authorization: `Bearer ${appState?.accessToken}` },
        })
        .then((res) => {
          dispatch(setLoading(false));

          let vals = Object.fromEntries(
            Object.entries(res?.data?.data).filter(
              ([key, value]) =>
                key !== "scheduledDate" &&
                key !== "assignedSurveyId" &&
                key !== "assignedInterviewerId"
            )
          );
          const val2 = {
            ...vals,
            participants: vals?.participants?.map((obj) => {
              const {
                ["completedBy"]: removedKey,
                ["startedBy"]: removedKey2,
                ...newObject
              } = obj;
              return newObject;
            }),
          };
          dispatch(setHouseHold(res?.data?.data));

          formik.setValues({
            familyCode: res?.data?.data?.familyCode || "",
            participantCode:
              res?.data?.data?.participants?.[0]?.participantCode || "",
            participantId: res?.data?.data?.participants?.[0]?.participantId,
            headOfFamily: true,
            firstName: res?.data?.data?.participants?.[0]?.firstName || "",
            familyName: res?.data?.data?.participants?.[0]?.familyName || "",
            phoneNumber: res?.data?.data?.phoneNumber || "",
            cityName: res?.data?.data?.cityName || "",
            streetName: res?.data?.data?.streetName || "",
            houseNumber: res?.data?.data?.houseNumber || "",
            buildingName: res?.data?.data?.buildingName || "",
            dob: res?.data?.data?.participants?.[0]?.dob || "",
            district: res?.data?.data?.district || "",
            region: res?.data?.data?.region || "",

            academicLevelId:
              res?.data?.data?.participants?.[0]?.academicLevelId || "",
            maritalStatusId:
              res?.data?.data?.participants?.[0]?.maritalStatusId || "",
            relativeRelationId:
              res?.data?.data?.participants?.[0]?.relativeRelationId || "",
            occupationId:
              res?.data?.data?.participants?.[0]?.occupationId || "",
            genderId: res?.data?.data?.participants?.[0]?.genderId || "",
            householdId: res?.data?.data?.householdId,
          });
          res?.data?.data?.participants?.map((parts, index) => {
            dispatch(
              setComplete({
                member: index,
                completed: true,
              })
            );
          });
        })
        .catch((err) => {
          dispatch(setLoading(false));
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
    }
  }, [appState?.refresh]);

  const handleAdd = () => {
    if (appState?.houseHold?.participants?.length) {
      dispatch(
        addFamilyMember({
          participantCode:
            appState?.houseHold?.participants?.length >= 9
              ? `${appState?.houseHold?.familyCode}${
                  appState?.houseHold?.participants?.length + 1
                }`
              : `${appState?.houseHold?.familyCode}0${
                  appState?.houseHold?.participants?.length + 1
                }`,
          headOfFamily: null,
          firstName: "",
          familyName: "",
          dob: "",
          genderId: "",
          maritalStatusId: "",
          academicLevelId: "",
          occupationId: "",
        })
      );
    } else {
      toast.error(t("Please Enter and Save Head of the Family details"));
    }
  };
  const formik = useFormik({
    initialValues: {
      familyCode: appState?.houseHold?.familyCode || "",
      participantCode:
        appState?.houseHold?.participants?.[0]?.participantCode || "",

      headOfFamily: true,

      firstName: appState?.houseHold?.participants?.[0]?.firstName || "",
      familyName: appState?.houseHold?.participants?.[0]?.familyName || "",

      phoneNumber: appState?.houseHold?.phoneNumber || "",
      cityName: appState?.houseHold?.cityName || "",
      streetName: appState?.houseHold?.streetName || "",
      houseNumber: appState?.houseHold?.houseNumber || "",
      buildingName: appState?.houseHold?.buildingName || "",
      dob: appState?.houseHold?.participants?.[0]?.dob || "",
      district: appState?.houseHold?.district || "",
      region: appState?.houseHold?.region || "",

      academicLevelId:
        appState?.houseHold?.participants?.[0]?.academicLevelId || "",
      maritalStatusId:
        appState?.houseHold?.participants?.[0]?.maritalStatusId || "",
      relativeRelationId:
        appState?.houseHold?.participants?.[0]?.relativeRelationId || "",
      occupationId: appState?.houseHold?.participants?.[0]?.occupationId || "",
      genderId: appState?.houseHold?.participants?.[0]?.genderId || "",
    },
    onSubmit: (values) => {
      let vals = Object.fromEntries(
        Object.entries(values).filter(
          ([key, value]) =>
            key !== "participantCode" &&
            key !== "firstName" &&
            key !== "familyName" &&
            key !== "dob" &&
            key !== "genderId" &&
            key !== "maritalStatusId" &&
            key !== "relativeRelationId" &&
            key !== "academicLevelId" &&
            key !== "occupationId" &&
            key !== "headOfFamily"
        )
      );
      const vall = {
        assignedSurveyId: 0,
        assignedInterviewerId: 0,
        scheduledDate: 0,
      };
      const valss = { ...vals };
      dispatch(
        updateHouseHoldObj({
          valss,
        })
      );
      const vals2 = Object.fromEntries(
        Object.entries(values).filter(
          ([key, value]) =>
            key !== "familyCode" &&
            key !== "houseNumber" &&
            key !== "buildingName" &&
            key !== "streetName" &&
            key !== "cityName" &&
            key !== "phoneNumber" &&
            key !== "region" &&
            key !== "district"
        )
      );
      dispatch(
        updatDetails({
          values: {
            ...vals2,
            updatedDate: moment()["_d"]?.toISOString(),
            householdId: appState?.houseHold?.householdId,
            dob: moment(values.dob["$d"]).format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
          },
          memberIndex: 0,
        })
      );

      toast(t("Head of the Family Members details saved successfully"), {
        position: "top-center",
        autoClose: 4000,
        hideProgressBar: false,
        pauseOnHover: true,
        draggable: true,
        type: "success",
      });
    },
    validate: (values) => {
      const errors = {};

      if (!values.familyCode) {
        errors.familyCode = `${t("Head of Family ID Code Required")}`;
      }
      if (!values.participantCode) {
        errors.participantCode = `${t("Head of Participant Code Required")}`;
      }
      if (!values.firstName.trim()) {
        errors.firstName = `${t("First Name Required")}`;
      }
      if (!values.familyName.trim()) {
        errors.familyName = `${t("Family Name Required")}`;
      }
      if (!values.phoneNumber) {
        errors.phoneNumber = `${t("Phone Number Required")}`;
      }
      if (!values.cityName) {
        errors.cityName = `${t("Region Required")}`;
      }
      if (!values.region) {
        errors.region = `${t("Area Required")}`;
      }
      if (!values.district) {
        errors.district = `${t("District Required")}`;
      }
      if (!values.streetName.trim()) {
        errors.streetName = `${t("Street No Required")}`;
      }

      if (!values.buildingName.trim()) {
        errors.buildingName = `${t("Building name Required")}`;
      }
      if (!values.genderId) {
        errors.genderId = `${t("Gender Required")}`;
      }
      if (!values.dob) {
        errors.dob = `${t("DOB Required")}`;
      }

      if (!values.academicLevelId) {
        errors.academicLevelId = `${t("Academic Level Required")}`;
      }
      if (!values.maritalStatusId) {
        errors.maritalStatusId = `${t("Marital Status Required")}`;
      }
      if (!values.relativeRelationId) {
        errors.relativeRelationId = `${t("Relationship Required")}`;
      }
      if (!values.occupationId) {
        errors.occupationId = `${t("Occupation Required")}`;
      }
      return errors;
    },
  });
  const navigate = useNavigate();
  const handleChange = (date) => {
    formik.setFieldValue("dob", date);
    if (date === "") {
      formik.setFieldError("dob", "error");
    }
  };
  const handleDelete = () => {
    dispatch(setLoading(true));
    axios
      .delete(`/api/household/deleteHouseholdWithparticipants/${id}`, {
        headers: { authorization: `Bearer ${appState?.accessToken}` },
      })
      .then((res) => {
        dispatch(setLoading(false));
        if (res?.data?.isSuccess === true) {
          toast(t("Record deleted successfully"), {
            position: "top-center",
            autoClose: 4000,
            hideProgressBar: false,
            pauseOnHover: true,
            draggable: true,
            type: "success",
          });
          navigate("/household");
        }
      })
      .catch((err) => {
        dispatch(setLoading(false));
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
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  };

  const [visible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    setIsVisible(true);
    const hasValues = (obj) => {
      for (const key in obj) {
        if (obj[key] === "") {
          return false;
        }
      }
      return true;
    };
    if (hasValues(formik.values)) {
      dispatch(
        setComplete({
          member: 0,
          completed: true,
        })
      );
      let vals = Object.fromEntries(
        Object.entries(formik?.values).filter(
          ([key, value]) =>
            key !== "participantCode" &&
            key !== "firstName" &&
            key !== "familyName" &&
            key !== "dob" &&
            key !== "genderId" &&
            key !== "maritalStatusId" &&
            key !== "relativeRelationId" &&
            key !== "academicLevelId" &&
            key !== "occupationId" &&
            key !== "headOfFamily"
        )
      );
      const valss = { ...vals };
      dispatch(
        updateHouseHoldObj({
          valss,
        })
      );
      const vals2 = Object.fromEntries(
        Object.entries(formik.values).filter(
          ([key, value]) =>
            key !== "familyCode" &&
            key !== "houseNumber" &&
            key !== "buildingName" &&
            key !== "streetName" &&
            key !== "cityName" &&
            key !== "region" &&
            key !== "district" &&
            key !== "phoneNumber"
        )
      );
      dispatch(
        updatDetails({
          values: {
            ...vals2,
            dob: formik?.values?.dob,
          },
          memberIndex: 0,
        })
      );
    } else {
      setIsVisible(false);
    }
  }, [formik.values]);

  const [districts, setDistricts] = React.useState([]);

  React.useEffect(() => {
    const hasValuesForAllKeys = (array) => {
      for (const obj of array) {
        for (const key in obj) {
          if (obj[key] === "") {
            return false;
          }
        }
      }
      return true;
    };
    if (
      hasValuesForAllKeys(appState?.houseHold?.participants) &&
      appState?.houseHold?.houseNumber?.length == 4 &&
      districts?.find((fin) => fin.code === formik.values.district)
        ?.hhStartCode <= appState?.houseHold?.houseNumber &&
      districts?.find((fin) => fin.code === formik.values.district)
        ?.hhEndCode >= appState?.houseHold?.houseNumber &&
      !appState?.complete?.map((mem) => mem.completed).includes(false)
    ) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [
    appState?.houseHold?.participants,
    appState?.complete,
    appState?.houseHold?.houseNumber,
    districts,
  ]);

  const handleSave = () => {
    let showToast = true;
    if (!appState?.houseHold?.participants?.length) {
      toast(t("Please Enter and Save Head of the Family details"), {
        position: "top-center",
        autoClose: 4000,
        hideProgressBar: false,
        pauseOnHover: true,
        progress: undefined,
        draggable: true,
        type: "error",
      });
    } else if (appState?.houseHold?.participants?.length === 1) {
      dispatch(setLoading(true));
      axios
        .put(
          `/api/household/updateHouseholdWithparticipants/${id}`,
          { ...appState.houseHold },
          {
            headers: { authorization: `Bearer ${appState?.accessToken}` },
          }
        )
        .then((res) => {
          dispatch(setLoading(false));
          if (res?.data?.isSuccess === true) {
            toast(t("Household Details saved successfully"), {
              position: "top-center",
              autoClose: 4000,
              hideProgressBar: false,
              pauseOnHover: true,
              draggable: true,
              type: "success",
            });
            navigate("/household");
          }
        })
        .catch((err) => {
          dispatch(setLoading(false));
          if (err?.response?.status !== 401) {
            toast(err?.response?.data?.Errors[0], {
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
    } else if (appState?.houseHold?.participants?.length) {
      appState?.houseHold?.participants?.map((val, index) => {
        if (index == 0) {
          return;
        } else {
          if (Object.values(val).some((value) => value === "" && showToast)) {
            showToast = false;
            toast(
              `${t(
                "Please Enter and Save the Details of Family Member"
              )} ${index}`,
              {
                position: "top-center",
                autoClose: 4000,
                hideProgressBar: false,
                pauseOnHover: true,
                draggable: true,
                type: "error",
              }
            );
            setOpenAccordion(index);
            dispatch(setSubmitClick({ secNum: index }));
            return;
          } else {
            return;
          }
        }
      });
      if (showToast) {
        dispatch(setLoading(true));
        axios
          .put(
            `/api/household/updateHouseholdWithparticipants/${id}`,
            { ...appState.houseHold },
            {
              headers: { authorization: `Bearer ${appState?.accessToken}` },
            }
          )
          .then((res) => {
            dispatch(setLoading(false));
            if (res?.data?.isSuccess === true) {
              toast(t("Household Details saved successfully"), {
                position: "top-center",
                autoClose: 4000,
                hideProgressBar: false,
                pauseOnHover: true,
                draggable: true,
                type: "success",
              });
              navigate("/household");
            }
          })
          .catch((err) => {
            dispatch(setLoading(false));
            if (err?.response?.status != 401) {
              toast(err?.response?.data?.Errors[0], {
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
    } else {
      toast(t("Family Members Details added successfully"), {
        position: "top-center",
        autoClose: 4000,
        hideProgressBar: false,
        pauseOnHover: true,
        draggable: true,
        type: "success",
      });
    }
  };
  const [openAccordion, setOpenAccordion] = React.useState(null);
  const handleAccordionChange = (index) => {
    setOpenAccordion((prev) => (prev === index ? null : index));
  };
  const { t } = useTranslation();
  const lang = sessionStorage.getItem("lang");
  const [cities, setCities] = React.useState([]);
  const [regions, setRegions] = React.useState([]);

  React.useEffect(() => {
    axios
      .get("/api/types/cities", {
        headers: {
          authorization: `Bearer ${appState.accessToken}`,
        },
      })
      .then((res) => {
        setCities(res?.data?.data.cities);
      });
  }, []);

  React.useEffect(() => {
    setDistricts(
      cities?.find((filter) => filter?.code === formik?.values?.cityName)
        ?.districts
    );
    setRegions(
      districts?.find((filter) => filter?.code === formik?.values?.district)
        ?.regions
    );
    if (
      formik.values.cityName &&
      formik.values.district &&
      formik.values.region
    ) {
      formik.setFieldValue(
        "participantCode",
        formik.values.cityName +
          formik.values.district +
          formik.values.region +
          formik.values.houseNumber +
          "01"
      );
      formik.setFieldValue(
        "familyCode",
        formik.values.cityName +
          formik.values.district +
          formik.values.region +
          formik.values.houseNumber
      );
    }
  }, [
    cities,
    districts,
    formik.values.cityName,
    formik.values.district,
    formik.values.region,
    formik.values.houseNumber,
  ]);

  useEffect(() => {
    i18next.changeLanguage(lang);
  }, [lang]);
  const MenuItem = styled((props) => (
    <div dir={lang === "ar" ? "rtl" : ""}>
      <MuiMenuItem {...props} />
    </div>
  ))(({ theme }) => ({}));

  const handleDateChange = (newDate) => {
    formik.setFieldValue(
      "dob",
      moment(newDate["$d"]).format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")
    );
  };

  return (
    <div dir={lang === "ar" ? "rtl" : ""}>
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
              sx={{ marginTop: "-3px", marginBottom: "-3px" }}
            >
              <Box
                display={"flex"}
                justifyContent={"space-between"}
                width={"100%"}
                alignItems={"center"}
              >
                <Typography fontWeight={"bold"}>
                  {appState?.houseHold?.participants?.[0]?.firstName
                    ? appState?.houseHold?.participants?.[0]?.firstName
                    : `${t("Head of the Family")}`}
                </Typography>
              </Box>
              <IconButton size="small">
                <img src={img} alt="" width={"25px"} />
              </IconButton>
            </AccordionSummary>
            <AccordionDetails>
              <form onSubmit={formik.handleSubmit}>
                <CacheProvider value={lang === "ar" ? cacheRtl : cacheLtr}>
                  <Grid
                    container
                    columnSpacing={2}
                    rowSpacing={2}
                    padding={{ lg: "20px 20px 30px 10px", xs: "0px" }}
                  >
                    <Grid item sm={12} xs={12} md={6} lg={4}>
                      <Typography color={"#1D2420"}>
                        {t("First Name")}
                      </Typography>
                      <Box
                        display={"flex"}
                        alignItems={"center"}
                        gap={0.5}
                        color={"#5A6670"}
                      >
                        <TextField
                          disabled={page === "view"}
                          name={"firstName"}
                          size="small"
                          style={{ width: "100%" }}
                          InputProps={{
                            className: classes.input,
                            classes: {
                              focused: classes.focused,
                            },
                          }}
                          value={formik.values.firstName}
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
                      <Typography color={"#1D2420"}>
                        {t("Family Name")}
                      </Typography>
                      <Box
                        display={"flex"}
                        alignItems={"center"}
                        gap={0.5}
                        color={"#5A6670"}
                      >
                        <TextField
                          disabled={page === "view"}
                          name={"familyName"}
                          size="small"
                          style={{ width: "100%" }}
                          InputProps={{
                            className: classes.input,
                            classes: {
                              focused: classes.focused,
                            },
                          }}
                          value={formik.values.familyName}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={
                            formik.touched.familyName &&
                            formik.errors.familyName
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
                      <Typography color={"#1D2420"}>
                        {t("Family Code")}
                      </Typography>
                      <Box
                        display={"flex"}
                        alignItems={"center"}
                        gap={0.5}
                        color={"#5A6670"}
                      >
                        <TextField
                          disabled
                          size="small"
                          name={"familyCode"}
                          style={{ width: "100%" }}
                          value={formik.values.familyCode}
                          InputProps={{
                            className: classes.input,
                            classes: {
                              focused: classes.focused,
                            },
                          }}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={
                            formik.touched.familyCode &&
                            formik.errors.familyCode
                              ? true
                              : false
                          }
                          helperText={
                            formik.touched.familyCode &&
                            formik.errors.familyCode &&
                            formik.errors.familyCode
                          }
                        />
                      </Box>
                    </Grid>
                    <Grid item sm={12} xs={12} md={6} lg={4}>
                      <Typography color={"#1D2420"}>
                        {t("Participant Code")}
                      </Typography>
                      <Box
                        display={"flex"}
                        alignItems={"center"}
                        gap={0.5}
                        color={"#5A6670"}
                      >
                        <TextField
                          disabled
                          size="small"
                          name={"participantCode"}
                          style={{ width: "100%" }}
                          value={formik.values.participantCode}
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
                      <Typography color={"#1D2420"}>
                        {t("Phone Number")}
                      </Typography>
                      <Box
                        display={"flex"}
                        alignItems={"center"}
                        gap={0.5}
                        color={"#5A6670"}
                      >
                        <TextField
                          disabled={page === "view"}
                          name={"phoneNumber"}
                          type="number"
                          size="small"
                          style={{ width: "100%" }}
                          InputProps={{
                            className: classes.input,
                            classes: {
                              focused: classes.focused,
                            },
                          }}
                          value={formik.values.phoneNumber}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
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
                      </Box>
                    </Grid>
                    <Grid item sm={12} xs={12} md={6} lg={4}>
                      <Typography color={"#1D2420"}>{t("Region")}</Typography>
                      <Box
                        display={"flex"}
                        alignItems={"center"}
                        gap={0.5}
                        color={"#5A6670"}
                      >
                        <CacheProvider
                          value={lang === "ar" ? cacheRtl : cacheLtr}
                        >
                          <FormControl fullWidth size="small">
                            <Select
                              disabled={page === "view"}
                              sx={{
                                ".MuiSelect-outlined": {
                                  border: "1.5px solid #C1C1C1",
                                  borderRadius: "5px",
                                  outline: "none",
                                },
                              }}
                              size="small"
                              name={"cityName"}
                              style={{ width: "100%" }}
                              InputProps={{
                                className: classes.input,
                                classes: {
                                  focused: classes.focused,
                                },
                              }}
                              value={formik.values.cityName}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              error={
                                formik.touched.cityName &&
                                formik.errors.cityName
                                  ? true
                                  : false
                              }
                              helperText={
                                formik.touched.cityName &&
                                formik.errors.cityName &&
                                formik.errors.cityName
                              }
                            >
                              <MenuItem value="">{t("Select")}</MenuItem>
                              {cities?.map((city) => (
                                <MenuItem value={city?.code}>
                                  {city?.name}
                                </MenuItem>
                              ))}

                              {/* <MenuItem value={2}>{t('FEMALE')}</MenuItem> */}
                            </Select>
                            <div dir={lang === "ar" ? "rtl" : ""}>
                              <FormHelperText
                                style={
                                  formik.touched.cityName &&
                                  formik.errors.cityName
                                    ? { display: "block", color: "#d32f2f" }
                                    : { display: "none" }
                                }
                              >
                                {t("Region Required")}
                              </FormHelperText>
                            </div>
                          </FormControl>
                        </CacheProvider>
                      </Box>
                    </Grid>
                    <Grid item sm={12} xs={12} md={6} lg={4}>
                      <Typography color={"#1D2420"}>{t("District")}</Typography>
                      <Box
                        display={"flex"}
                        alignItems={"center"}
                        gap={0.5}
                        color={"#5A6670"}
                      >
                        <CacheProvider
                          value={lang === "ar" ? cacheRtl : cacheLtr}
                        >
                          <FormControl fullWidth size="small">
                            <Select
                              disabled={page === "view"}
                              sx={{
                                ".MuiSelect-outlined": {
                                  border: "1.5px solid #C1C1C1",
                                  borderRadius: "5px",
                                  outline: "none",
                                },
                              }}
                              size="small"
                              name={"district"}
                              style={{ width: "100%" }}
                              InputProps={{
                                className: classes.input,
                                classes: {
                                  focused: classes.focused,
                                },
                              }}
                              value={formik.values.district}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              error={
                                formik.touched.district &&
                                formik.errors.district
                                  ? true
                                  : false
                              }
                              helperText={
                                formik.touched.district &&
                                formik.errors.district &&
                                formik.errors.district
                              }
                            >
                              <MenuItem value="">{t("Select")}</MenuItem>

                              {districts?.map((city) => (
                                <MenuItem value={city?.code}>
                                  {city?.name}
                                </MenuItem>
                              ))}
                              {/* <MenuItem value={2}>{t('FEMALE')}</MenuItem> */}
                            </Select>
                            <div dir={lang === "ar" ? "rtl" : ""}>
                              <FormHelperText
                                style={
                                  formik.touched.district &&
                                  formik.errors.district
                                    ? { display: "block", color: "#d32f2f" }
                                    : { display: "none" }
                                }
                              >
                                {t("District Required")}
                              </FormHelperText>
                            </div>
                          </FormControl>
                        </CacheProvider>
                      </Box>
                    </Grid>
                    <Grid item sm={12} xs={12} md={6} lg={4}>
                      <Typography color={"#1D2420"}>{t("Area")}</Typography>
                      <Box
                        display={"flex"}
                        alignItems={"center"}
                        gap={0.5}
                        color={"#5A6670"}
                      >
                        <CacheProvider
                          value={lang === "ar" ? cacheRtl : cacheLtr}
                        >
                          <FormControl fullWidth size="small">
                            <Select
                              disabled={page === "view"}
                              sx={{
                                ".MuiSelect-outlined": {
                                  border: "1.5px solid #C1C1C1",
                                  borderRadius: "5px",
                                  outline: "none",
                                },
                              }}
                              size="small"
                              name={"region"}
                              style={{ width: "100%" }}
                              InputProps={{
                                className: classes.input,
                                classes: {
                                  focused: classes.focused,
                                },
                              }}
                              value={formik.values.region}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              error={
                                formik.touched.region && formik.errors.region
                                  ? true
                                  : false
                              }
                              helperText={
                                formik.touched.region &&
                                formik.errors.region &&
                                formik.errors.region
                              }
                            >
                              <MenuItem value="">{t("Select")}</MenuItem>
                              {regions?.map((city) => (
                                <MenuItem value={city?.code}>
                                  {city?.name}
                                </MenuItem>
                              ))}

                              {/* <MenuItem value={2}>{t('FEMALE')}</MenuItem> */}
                            </Select>
                            <div dir={lang === "ar" ? "rtl" : ""}>
                              <FormHelperText
                                style={
                                  formik.touched.region && formik.errors.region
                                    ? { display: "block", color: "#d32f2f" }
                                    : { display: "none" }
                                }
                              >
                                {t("Area Required")}
                              </FormHelperText>
                            </div>
                          </FormControl>
                        </CacheProvider>
                      </Box>
                    </Grid>

                    <Grid item sm={12} xs={12} md={6} lg={4}>
                      <Typography color={"#1D2420"}>{t("House No")}</Typography>
                      <Box
                        display={"flex"}
                        alignItems={"center"}
                        gap={0.5}
                        color={"#5A6670"}
                      >
                        <TextField
                          disabled={page === "view"}
                          name={"houseNumber"}
                          size="small"
                          style={{ width: "100%" }}
                          InputProps={{
                            className: classes.input,
                            classes: {
                              focused: classes.focused,
                            },
                          }}
                          placeholder={
                            lang === "en"
                              ? `Range for house no is ${
                                  districts?.find(
                                    (fin) => fin.code === formik.values.district
                                  )?.hhStartCode || 0
                                } to ${
                                  districts?.find(
                                    (fin) => fin.code === formik.values.district
                                  )?.hhEndCode || 0
                                }`
                              : `نطاق المنزل رقم ${
                                  districts?.find(
                                    (fin) => fin.code === formik.values.district
                                  )?.hhStartCode || 0
                                } إلى ${
                                  districts?.find(
                                    (fin) => fin.code === formik.values.district
                                  )?.hhEndCode || 0
                                }`
                          }
                          value={formik.values.houseNumber}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                        />
                      </Box>
                      <span style={{ fontSize: "0.8rem" }}>
                        {t("House Number should be 4 digits")}(Ex:0001)
                      </span>
                    </Grid>
                    <Grid item sm={12} xs={12} md={6} lg={4}>
                      <Typography color={"#1D2420"}>
                        {t("Street No")}
                      </Typography>
                      <Box
                        display={"flex"}
                        alignItems={"center"}
                        gap={0.5}
                        color={"#5A6670"}
                      >
                        <TextField
                          disabled={page === "view"}
                          name={"streetName"}
                          size="small"
                          style={{ width: "100%" }}
                          InputProps={{
                            className: classes.input,
                            classes: {
                              focused: classes.focused,
                            },
                          }}
                          value={formik.values.streetName}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={
                            formik.touched.streetName &&
                            formik.errors.streetName
                              ? true
                              : false
                          }
                          helperText={
                            formik.touched.streetName &&
                            formik.errors.streetName &&
                            formik.errors.streetName
                          }
                        />
                      </Box>
                    </Grid>
                    <Grid item sm={12} xs={12} md={6} lg={4}>
                      <Typography color={"#1D2420"}>
                        {t("Building name")}
                      </Typography>
                      <Box
                        display={"flex"}
                        alignItems={"center"}
                        gap={0.5}
                        color={"#5A6670"}
                      >
                        <TextField
                          disabled={page === "view"}
                          name={"buildingName"}
                          size="small"
                          style={{ width: "100%" }}
                          InputProps={{
                            className: classes.input,
                            classes: {
                              focused: classes.focused,
                            },
                          }}
                          value={formik.values.buildingName}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          error={
                            formik.touched.buildingName &&
                            formik.errors.buildingName
                              ? true
                              : false
                          }
                          helperText={
                            formik.touched.buildingName &&
                            formik.errors.buildingName &&
                            formik.errors.buildingName
                          }
                        />
                      </Box>
                    </Grid>
                    <Grid item sm={12} xs={12} md={6} lg={4}>
                      <Typography color={"#1D2420"}>{t("Gender")}</Typography>
                      <Box
                        display={"flex"}
                        alignItems={"center"}
                        gap={0.5}
                        color={"#5A6670"}
                      >
                        <FormControl fullWidth size="small">
                          <Select
                            sx={{
                              ".MuiSelect-outlined": {
                                border: "1.5px solid #C1C1C1",
                                borderRadius: "5px",
                                outline: "none",
                              },
                            }}
                            size="small"
                            name={"genderId"}
                            style={{ width: "100%" }}
                            InputProps={{
                              className: classes.input,
                              classes: {
                                focused: classes.focused,
                              },
                            }}
                            value={formik.values.genderId}
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
                            disabled={page === "view"}
                          >
                            <MenuItem value="">{t("Select")}</MenuItem>
                            {appState?.types?.genderTypes?.map((gender) => (
                              <MenuItem value={parseInt(gender.genderId)}>
                                {t(gender.genderName)}
                              </MenuItem>
                            ))}
                          </Select>
                          <div dir={lang === "ar" ? "rtl" : ""}>
                            <FormHelperText
                              style={
                                formik.touched.genderId &&
                                formik.errors.genderId
                                  ? { display: "block", color: "#d32f2f" }
                                  : { display: "none" }
                              }
                            >
                              {t("Gender Required")}
                            </FormHelperText>
                          </div>
                        </FormControl>
                      </Box>
                    </Grid>
                    <Grid item sm={12} xs={12} md={6} lg={4}>
                      <Typography color={"#1D2420"}>{t("DOB")}</Typography>
                      <Box
                        display={"flex"}
                        alignItems={"center"}
                        gap={0.5}
                        color={"#5A6670"}
                        style={{ width: "100%" }}
                      >
                        <FormControl size="small" fullWidth name="dob">
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              size="small"
                              disabled={page === "view"}
                              style={{ width: "100%" }}
                              fullWidth
                              name={"dob"}
                              format="DD/MM/YYYY"
                              value={dayjs(formik.values.dob) || null}
                              onChange={handleDateChange}
                              onBlur={formik.handleBlur}
                              slotProps={{
                                textField: {
                                  size: "small",
                                  error:
                                    formik.touched.dob && formik.errors.dob
                                      ? true
                                      : false,
                                  helperText:
                                    formik.touched.dob &&
                                    formik.errors.dob &&
                                    formik.errors.dob,
                                },
                              }}
                              renderInput={(params) => (
                                <TextField
                                  disabled={page === "view"}
                                  error={
                                    formik.touched.dob && formik.errors.dob
                                      ? true
                                      : false
                                  }
                                  helperText={
                                    formik.touched.dob &&
                                    formik.errors.dob &&
                                    formik.errors.dob
                                  }
                                  fullWidth
                                  style={{ width: "100%" }}
                                  sx={{
                                    "& .MuiInputBase-input": {},
                                    width: "100%",
                                  }}
                                  {...params}
                                  name="dob"
                                />
                              )}
                            />
                          </LocalizationProvider>
                        </FormControl>
                      </Box>
                    </Grid>

                    <Grid item sm={12} xs={12} md={6} lg={4}>
                      <Typography color={"#1D2420"}>
                        {t("Academic Level")}
                      </Typography>
                      <Box
                        display={"flex"}
                        alignItems={"center"}
                        gap={0.5}
                        color={"#5A6670"}
                      >
                        <FormControl fullWidth size="small">
                          <Select
                            sx={{
                              ".MuiSelect-outlined": {
                                border: "1.5px solid #C1C1C1",
                                borderRadius: "5px",
                                outline: "none",
                              },
                            }}
                            size="small"
                            name={"academicLevelId"}
                            style={{ width: "100%" }}
                            InputProps={{
                              className: classes.input,
                              classes: {
                                focused: classes.focused,
                              },
                            }}
                            value={formik.values.academicLevelId}
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
                            disabled={page === "view"}
                          >
                            <MenuItem value="">{t("Select")}</MenuItem>
                            {appState?.types?.academicLevelTypes?.map((ac) => (
                              <MenuItem value={parseInt(ac.academicLevelId)}>
                                {t(ac.academicLevelName)}
                              </MenuItem>
                            ))}
                          </Select>
                          <div dir={lang === "ar" ? "rtl" : ""}>
                            <FormHelperText
                              style={
                                formik.touched.academicLevelId &&
                                formik.errors.academicLevelId
                                  ? { display: "block", color: "#d32f2f" }
                                  : { display: "none" }
                              }
                            >
                              {t("AcedemicLevel Required")}
                            </FormHelperText>
                          </div>
                        </FormControl>
                      </Box>
                    </Grid>
                    <Grid item sm={12} xs={12} md={6} lg={4}>
                      <Typography color={"#1D2420"}>
                        {t("Marital Status")}
                      </Typography>
                      <Box
                        display={"flex"}
                        alignItems={"center"}
                        gap={0.5}
                        color={"#5A6670"}
                      >
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
                            name={"maritalStatusId"}
                            style={{ width: "100%" }}
                            InputProps={{
                              className: classes.input,
                              classes: {
                                focused: classes.focused,
                              },
                            }}
                            value={formik.values.maritalStatusId}
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
                            disabled={page === "view"}
                          >
                            <MenuItem value={""}>{t("Select")}</MenuItem>
                            {appState?.types?.maritalStatusTypes?.map(
                              (mart) => (
                                <MenuItem value={parseInt(mart.maritalId)}>
                                  {t(mart.maritalName)}
                                </MenuItem>
                              )
                            )}
                          </Select>
                          <div dir={lang === "ar" ? "rtl" : ""}>
                            <FormHelperText
                              style={
                                formik.touched.maritalStatusId &&
                                formik.errors.maritalStatusId
                                  ? { display: "block", color: "#d32f2f" }
                                  : { display: "none" }
                              }
                            >
                              {t("Marital Status Required")}
                            </FormHelperText>
                          </div>
                        </FormControl>
                      </Box>
                    </Grid>
                    <Grid item sm={12} xs={12} md={6} lg={4}>
                      <Typography color={"#1D2420"}>
                        {t("Relationship")}
                      </Typography>
                      <Box
                        display={"flex"}
                        alignItems={"center"}
                        gap={0.5}
                        color={"#5A6670"}
                      >
                        <CacheProvider
                          value={lang === "ar" ? cacheRtl : cacheLtr}
                        >
                          <FormControl fullWidth size="small">
                            <Select
                              size="small"
                              disabled
                              sx={{
                                ".MuiSelect-outlined": {
                                  border: "1.5px solid #C1C1C1",
                                  borderRadius: "5px",
                                  outline: "none",
                                },
                                ".MuiFormHelperText-root":
                                  lang === "ar"
                                    ? {
                                        position: "absolute",
                                        right: 0,
                                        bottom: "-20px",
                                      }
                                    : {},
                              }}
                              name={"relativeRelationId"}
                              style={{ width: "100%" }}
                              InputProps={{
                                className: classes.input,
                                classes: {
                                  focused: classes.focused,
                                },
                              }}
                              value={formik.values.relativeRelationId}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              error={
                                formik.touched.relativeRelationId &&
                                formik.errors.relativeRelationId
                                  ? true
                                  : false
                              }
                              helperText={
                                formik.touched.relativeRelationId &&
                                formik.errors.relativeRelationId &&
                                formik.errors.relativeRelationId
                              }
                            >
                              <MenuItem value={""}>{t("Select")}</MenuItem>
                              {appState?.types?.relationTypes?.map((rel) => (
                                <MenuItem value={parseInt(rel.relationId)}>
                                  {t(rel.relationName)}
                                </MenuItem>
                              ))}
                            </Select>
                            <div dir={lang === "ar" ? "rtl" : ""}>
                              <FormHelperText
                                style={
                                  formik.touched.relativeRelationId &&
                                  formik.errors.relativeRelationId
                                    ? { display: "block", color: "#d32f2f" }
                                    : { display: "none" }
                                }
                              >
                                {t("Relationship Required")}
                              </FormHelperText>
                            </div>
                          </FormControl>
                        </CacheProvider>
                      </Box>
                    </Grid>
                    <Grid item sm={12} xs={12} md={6} lg={4}>
                      <Typography color={"#1D2420"}>
                        {t("Occupation")}
                      </Typography>
                      <Box
                        display={"flex"}
                        alignItems={"center"}
                        gap={0.5}
                        color={"#5A6670"}
                      >
                        <FormControl fullWidth size="small">
                          <Select
                            sx={{
                              ".MuiSelect-outlined": {
                                border: "1.5px solid #C1C1C1",
                                borderRadius: "5px",
                                outline: "none",
                              },
                            }}
                            size="small"
                            name={"occupationId"}
                            style={{ width: "100%" }}
                            InputProps={{
                              className: classes.input,
                              classes: {
                                focused: classes.focused,
                              },
                            }}
                            value={formik.values.occupationId}
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
                            disabled={page === "view"}
                          >
                            <MenuItem value="">{t("Select")}</MenuItem>
                            {appState?.types?.occupationTypes?.map((rel) => (
                              <MenuItem value={parseInt(rel.occupationId)}>
                                {t(rel.occupationName)}
                              </MenuItem>
                            ))}
                          </Select>
                          <div dir={lang === "ar" ? "rtl" : ""}>
                            <FormHelperText
                              style={
                                formik.touched.occupationId &&
                                formik.errors.occupationId
                                  ? { display: "block", color: "#d32f2f" }
                                  : { display: "none" }
                              }
                            >
                              {t("Occupation Required")}
                            </FormHelperText>
                          </div>
                        </FormControl>
                      </Box>
                    </Grid>
                  </Grid>
                  <Box
                    display={page === "view" ? "none" : "flex"}
                    justifyContent={{ md: "flex-end", xs: "center" }}
                    padding={"20px 0px 30px 10px"}
                  ></Box>
                </CacheProvider>
              </form>
            </AccordionDetails>
          </Accordion>
          {appState?.houseHold?.participants?.map((_, index) =>
            index === 0 ? (
              <div key={index}></div>
            ) : (
              <CommonAccordion
                page={page}
                memberIndex={index}
                key={index}
                expanded={openAccordion === index ? true : false}
                onChange={() => handleAccordionChange(index)}
                familyCode={formik.values.familyCode}
                
              />
            )
          )}
          <Box
            width={"100%"}
            display={page === "view" ? "none" : "flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
            height={"40px"}
            border={"1.5px solid #45AEAE"}
            padding={"23px 23px 23px 15px"}
            color={"#45AEAE"}
            style={{ cursor: "pointer" }}
            fontWeight={"bold"}
            onClick={() => {
              handleAdd();
            }}
          >
            <div>{t("Add Another Family Member")}</div>
            <div style={{ fontSize: "22px" }}>+</div>
          </Box>

          <Box
            display={page === "view" ? "none" : "flex"}
            marginTop={"50px"}
            gap={1}
            justifyContent={{ md: "flex-end", xs: "center" }}
          >
            <Button
              variant="contained"
              style={{ color: "white", width: "100px" }}
              onClick={() => {
                navigate("/household");
              }}
            >
              {t("Cancel")}
            </Button>
            <Button
              variant="contained"
              style={{ color: "white", width: "100px" }}
              color="danger"
              onClick={() => {
                handleDelete();
              }}
            >
              {t("Delete")}
            </Button>
            <Button
              variant="contained"
              style={{ color: "white", width: "100px" }}
              color="green"
              disabled={!visible}
              onClick={() => {
                handleSave();
              }}
            >
              {t("Save")}
            </Button>
          </Box>

          <Box
            display={page === "edit" ? "none" : "flex"}
            marginTop={"50px"}
            gap={1}
            justifyContent={{ md: "flex-end", xs: "center" }}
          >
            <Button
              variant="contained"
              style={{ color: "white", width: "100px" }}
              onClick={() => {
                navigate("/household");
              }}
            >
              {t("Back")}
            </Button>
            
          </Box>
        </CardContent>
      </Card>
    </div>
  );
}

export default ViewHouseHolds;
