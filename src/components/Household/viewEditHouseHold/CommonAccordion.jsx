import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
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
import {
  removeCompleteByIndex,
  removeFamilyMember,
  setComplete,
  setSubmitClick,
  updatDetails,
} from "../../../store/slices/app.tsx";
import { toast } from "react-toastify";
import { useEffect } from "react";
import moment from "moment";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import createCache from "@emotion/cache";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import axios from "../../../api/axios.js";
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
  "&:not(:last-child)": {
    
  },
  "&:before": {
    display: "none",
  },
  marginBottom: "6px",
  "&.Mui-expanded": {
    "&.MuiAccordion-root": { marginBottom: "6px" },
  },
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

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  // padding: theme.spacing(2,6,3,5),
  // borderTop: '1px solid rgba(0, 0, 0, .125)',
}));
const CommonAccordion = ({ memberIndex, page, familyCode, ...props }) => {
  const dispatch = useDispatch();

  const appState = useSelector((state) => state?.app);

  const formik = useFormik({
    initialValues: {
      participantCode:
        memberIndex >= 9
          ? familyCode + `${memberIndex + 1}`
          : familyCode + `0${memberIndex + 1}`,
      // participantId:memberIndex,
      headOfFamily: false,
      firstName:
        appState?.houseHold?.participants?.[memberIndex]?.firstName || "",
      familyName:
        appState?.houseHold?.participants[memberIndex]?.familyName || "",
      // phoneNumber: appState?.houseHold?.participants?.[memberIndex]?.phoneNumber || "",
      // city: appState?.houseHold?.participants[memberIndex]?.city || "",
      // streetNo: appState?.houseHold?.participants?.[memberIndex]?.streetNo || "",
      genderId:
        appState?.houseHold?.participants?.[memberIndex]?.genderId || "",
      dob: appState?.houseHold?.participants[memberIndex]?.dob || "",
      // relationship: appState?.houseHold?.participants?.[memberIndex]?.relationship || "",
      academicLevelId:
        appState?.houseHold?.participants?.[memberIndex]?.academicLevelId || "",
      maritalStatusId:
        appState?.houseHold?.participants?.[memberIndex]?.maritalStatusId || "",
      relativeRelationId:
        appState?.houseHold?.participants?.[memberIndex]?.relativeRelationId ||
        "",
      occupationId:
        appState?.houseHold?.participants?.[memberIndex]?.occupationId || "",
    },
    enableReinitialize: true,
    onSubmit: (values) => {
     
      dispatch(
        updatDetails({
          values: {
            ...values,
            updatedDate: moment()["_d"].toISOString(),
            householdId: appState?.houseHold?.householdId,
            dob: moment(values.dob["$d"]).format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"),
          },
          memberIndex,
        })
      );
      toast(t("Family Member Details saved successfully"), {
        position: "top-center",
        autoClose: 4000,
        hideProgressBar: false,
        pauseOnHover: true,
        draggable: true,
        type: "success",
      });
      dispatch(setSubmitClick({ secNum: null }));
    },
    validate: (values) => {
      const errors = {};
      if (!values.participantCode) {
        errors.participantCode = `${t("Head of Participant Code Required")}`;
      }
      if (!values.firstName.trim()) {
        errors.firstName = `${t("First Name Required")}`;
      }
      if (!values.familyName.trim()) {
        errors.familyName = `${t("Family Name Required")}`;
      }
      if (!values.genderId) {
        errors.genderId = `${t("Gender Required")}`;
      }
      if (!values.dob) {
        errors.dob = `${t("DOB Required")}`;
      }
      // if (!values.relationship) {
      //   errors.relationship = "Relationship Required";
      // }
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
  const handleChange = (date) => {
    formik.setFieldValue("dob", date);
  };
  const classes = useStyles();

  const [open1, setOpen1] = React.useState(false);
  const [delectid, setDelectid] = React.useState('');
  const [index, setIndex] = React.useState('');
  const handleClickOpen1 = (indexes,id) => {
    setOpen1(true);
    setDelectid(id)
    setIndex(indexes)
  };

  const handleClose1 = () => {
    setOpen1(false);
  };

  const handleRemove = () => {
   
    axios.delete(`/api/household/deleteParticipant/${delectid}`,{
      headers: { authorization: `Bearer ${appState?.accessToken}` },
    })
      .then(() => {
        // Dispatch actions to update the state
        dispatch(removeFamilyMember(index));
        dispatch(removeCompleteByIndex(index));
        setOpen1(false);
        toast(t("Record deleted successfully"), {
          position: "top-center",
          autoClose: 4000,
          hideProgressBar: false,
          pauseOnHover: true,
          draggable: true,
          type: "success",
        });
        // If the index matches the current submit click, reset it
        if (index === appState?.submitClick) {
          dispatch(setSubmitClick({ secNum: null }));
        }
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
      });
  };
  

  useEffect(() => {
    if (memberIndex === appState?.submitClick) {
      formik.handleSubmit();
    }
  }, [appState?.submitClick]);

  React.useEffect(() => {
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
        updatDetails({
          values: {
            ...formik?.values,
            dob: appState?.houseHold?.participants[memberIndex]?.dob?.length
              ? formik?.values.dob
              : moment(formik.values.dob["$d"]).format(
                  "YYYY-MM-DDTHH:mm:ss.SSS[Z]"
                ),
          },
          memberIndex,
        })
      );
      dispatch(setSubmitClick({ secNum: null }));

      dispatch(
        setComplete({
          member: memberIndex,
          completed: true,
        })
      );
     
    } else {
      if (appState.complete[memberIndex]?.completed === false) {
        return;
      }
      dispatch(
        setComplete({
          member: memberIndex,
          completed: false,
        })
      );
    }
  }, [formik.values]);

  const lang = sessionStorage.getItem("lang");
  const MenuItem = styled((props) => (
    <div dir={lang === "ar" ? "rtl" : ""}>
      <MuiMenuItem {...props} />
    </div>
  ))(({ theme }) => ({}));
  const { t } = useTranslation();
  useEffect(() => {
    i18next.changeLanguage(lang);
  }, [lang]);
  return (  
    <div key={memberIndex}>
      <Accordion {...props}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
          sx={
            page !== "view" ? { marginTop: "-5px", marginBottom: "-5px" } : {}
          }
        >
            <React.Fragment>
      
      <Dialog
        open={open1}
        onClose={handleClose1}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
       
        <DialogContent>
         <Typography variant="h5" >{t('Do you  want to  Delete This Participant?')}</Typography>
        </DialogContent>
       
         <Box p={3} display={'flex'} alignContent={'center'} justifyContent={'center'} flexDirection={'row'} gap={3}>
         <Button variant="contained" size="small" onClick={handleClose1}>{t('NO')}</Button>
          <Button variant="contained" size="small" onClick={handleRemove} autoFocus>
            {t('YES')}
          </Button>
         </Box>
        
      </Dialog>
    </React.Fragment>
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            width={"100%"}
            alignItems={"center"}
          >
            <Typography fontWeight={"bold"}>
              {appState?.houseHold?.participants?.[memberIndex]?.firstName
                ? appState?.houseHold?.participants?.[memberIndex]?.firstName
                : `${t("Family member")} ${memberIndex}`}
            </Typography>
          </Box>
         
          <IconButton
           sx={
            appState?.roleinfo?.role?.includes("Administrator" ) 
              ? { display: "flex" }
              : {}
          }
            // style={page === "view" ? { display: "none" } : { display: "flex" }}
            onClick={(e) => {
              handleClickOpen1(memberIndex,appState?.houseHold?.participants?.[memberIndex]?.participantId);
              e.stopPropagation();
            }}
            size="small"
          >
            <DeleteIcon color="danger" />
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
                  <Typography color={"#1D2420"}>{t("First Name")}</Typography>
                  <Box
                    display={"flex"}
                    alignItems={"center"}
                    gap={0.5}
                    color={"#5A6670"}
                  >
                   
                    <TextField
                      disabled={page === "view"}
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
                  <Typography color={"#1D2420"}>{t("Family Name")}</Typography>
                  <Box
                    display={"flex"}
                    alignItems={"center"}
                    gap={0.5}
                    color={"#5A6670"}
                  >
                   
                    <TextField
                      disabled={page === "view"}
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
                  <Typography color={"#1D2420"}>{t("Gender")}</Typography>
                  <Box
                    display={"flex"}
                    alignItems={"center"}
                    gap={0.5}
                    color={"#5A6670"}
                  >
                   
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
                            formik.touched.genderId && formik.errors.genderId
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
                  >
                    {/* <span>H</span> */}
                    <FormControl size="small" fullWidth name="dob">
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          size="small"
                          //value={fromdate}
                          style={{ width: "100%" }}
                          fullWidth
                          disabled={page === "view"}
                          name={"dob"}
                          format="DD/MM/YYYY"
                          disableFuture
                          value={dayjs(formik.values.dob) || null}
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
                              
                              sx={{
                                "& .MuiInputBase-input": {
                                  
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
                  <Typography color={"#1D2420"}>
                    {t("Academic Level")}
                  </Typography>
                  <Box
                    display={"flex"}
                    alignItems={"center"}
                    gap={0.5}
                    color={"#5A6670"}
                  >
                    {/* <span>J</span> */}
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
                        disabled={page === "view"}
                      >
                        <MenuItem value={""}>{t("Select")}</MenuItem>
                        {appState?.types?.maritalStatusTypes?.map((mart) => (
                          <MenuItem value={parseInt(mart.maritalId)}>
                            {t(mart.maritalName)}
                          </MenuItem>
                        ))}
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
                  <Typography color={"#1D2420"}>{t("Relationship")}</Typography>
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
                        value={formik.values.relativeRelationId}
                        name="relativeRelationId"
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
                        disabled={page === "view"}
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
                  </Box>
                </Grid>
                <Grid item sm={12} xs={12} md={6} lg={4}>
                  <Typography color={"#1D2420"}>{t("Occupation")}</Typography>
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
                // marginTop={'20px'}
                padding={"20px 0px 30px 10px"}
              >
                {/* <Button
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
               {t('Save')}
              </Button> */}
              </Box>
            </CacheProvider>
          </form>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default CommonAccordion;
