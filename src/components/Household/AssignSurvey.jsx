import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  FormControl,
  Grid,
  MenuItem as MuiMenuItem,
  Select,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import React, { useEffect, useState } from "react";
import date from "../../assets/date.svg";
import house from "../../assets/house.svg";
import list from "../../assets/list.svg";
import person from "../../assets/person.svg";
import { setApiErrorStatusCode, setLoading } from "../../store/slices/app.tsx";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "../../api/axios";
import moment from "moment";
import { DateTimePicker } from "@mui/x-date-pickers";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import img from "../../assets/familyHead.png";
import { styled } from "@mui/styles";
import createCache from "@emotion/cache";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
const CollectionRecipient = () => {
  const cacheRtl = createCache({
    key: "muirtl",
    stylisPlugins: [prefixer, rtlPlugin],
  });
  const cacheLtr = createCache({
    key: "mui-ltr",
    stylisPlugins: [prefixer],
  });
  const appState = useSelector((state) => state?.app);
  const [srveyOptions, setSurveyOptions] = useState([]);
  const [data, setData] = useState([]);
  const [familyCode, setFamilyCode] = useState("");
  const [familyHead, setFamilyHead] = useState("");
  const [interviewOptions, setInterviewOptions] = useState([]);
  const [surveyValue, setSurveyValue] = useState(null);
  const [interviewerValue, setInterviewerValue] = useState([]);
  const [dateTime, setDateTime] = useState(null);

  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const id = queryParams?.get("id");

  const dispatch = useDispatch();
  const call = () => {
    dispatch(setLoading(true));
    axios
      .get("/api/survey/getAllSurveys", {
        headers: { authorization: `Bearer ${appState?.accessToken}` },
      })
      .then((res) => {
        dispatch(setLoading(false));
        setSurveyOptions([
          { label: "visit 1", value: 1 },
          { label: "visit 2", value: 1 },
          { label: "visit 3", value: 1 },
        ]);
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
  };
  const call2 = () => {
    axios
      .get("/api/user/getUsers", {
        headers: { authorization: `Bearer ${appState?.accessToken}` },
        params: { pageSize: 10000 },
      })
      .then((res) => {
        setInterviewOptions(
          res?.data?.data?.items
            ?.filter((inter) =>
              inter?.roles?.some((role) => role?.roleName === "Interviewer")
            )
            .map((opts) => {
              return { label: opts?.username, value: opts?.id };
            })
        );

        const items = res?.data?.data?.items
          ?.filter((inter) =>
            inter?.roles?.some((role) => role?.roleName === "Interviewer")
          )
          .map((opts) => {
            return { label: opts?.username, value: opts?.id };
          });

        axios
          .get(`/api/household/getHouseholdWithparticipants/${id}`, {
            headers: { authorization: `Bearer ${appState?.accessToken}` },
            //   params: { pageNumber: page + 1, pageSize: rowsPerPage },
          })
          .then((res) => {
            setData(res?.data?.data?.householdSurveyAssignment);

            setSurveyValue(
              res?.data?.data?.householdSurveyAssignment?.length === 0
                ? 1
                : res?.data?.data?.householdSurveyAssignment?.filter(
                    (key) => key.visitStatus === 0
                  )?.length >= 1
                ? res?.data?.data?.householdSurveyAssignment?.length
                : res?.data?.data?.householdSurveyAssignment?.length + 1
            );

            setFamilyCode(res?.data?.data?.familyCode);
            setFamilyHead(
              res?.data?.data?.participants?.find(
                (part) => part.headOfFamily === true
              )?.firstName
            );
            const mappedData = items
              .filter((item) =>
                res?.data?.data?.householdSurveyAssignment[
                  res?.data?.data?.householdSurveyAssignment?.length - 1
                ]?.assignedInterviewersId.includes(item.value)
              )
              .map((item) => ({
                value: item.value,
                label: item.label,
              }));
            setInterviewerValue(mappedData);
          });
      })
      .catch((err) => {
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
  };

  useEffect(() => {
    call();
    call2();
  }, []);
  let request;

  const navigate = useNavigate();

  const handleAssign = () => {
    dispatch(setLoading(true));
    axios
      .put(
        `/api/household/assignSurvey/${id}`,
        {
          assignedInterviewersId: interviewerValue?.map((val) => val.value),
          assignedSurveyId: 1,
          canConductFoodIntakeSurvey: data?.length > 2 ? false : true,
          scheduledDate: dateTime,
          visitNumber:
            data?.filter((key) => key?.visitStatus === 0)?.length >= 1
              ? data?.length
              : data?.length + 1,
        },
        {
          headers: { authorization: `Bearer ${appState?.accessToken}` },
        }
      )
      .then((res) => {
        dispatch(setLoading(false));
        if (res?.data?.isSuccess === true) {
          toast(`${t("Interview Assigned Successfully")}`, {
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
          toast(err?.response?.data?.errors[0], {
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
  };

  const lang = sessionStorage.getItem("lang");
  const { t } = useTranslation();
  const MenuItem = styled((props) => (
    <div dir={lang === "ar" ? "rtl" : ""}>
      <MuiMenuItem {...props} />
    </div>
  ))(({ theme }) => ({}));
  return (
    <div dir={lang === "ar" ? "rtl" : ""}>
      <Box>
        <Card elevation={1}>
          <CardHeader
            sx={{
              borderBottom: "1.5px solid #00000024",
              ".MuiCardHeader-title": { fontWeight: "600" },
              ".MuiCardHeader-subheader": {
                fontWeight: "600",
                fontSize: "0.9rem",
              },
            }}
            title={t("Assign survey")}
            subheader={t(
              "Select the survey, household and an interviewer to assign a survey"
            )}
          />
          <CardContent>
            <Grid flexGrow={2}>
              <CacheProvider value={lang === "ar" ? cacheRtl : cacheLtr}>
                <Grid container paddingLeft={{ sm: "2rem" }}>
                  <Grid item xs={12} lg={3} md={6} sm={12}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        gap: "1rem",
                        flexDirection: "row",
                      }}
                    >
                      <Box>
                        {" "}
                        <img src={house} alt="house" />
                      </Box>
                      <Box pt={1}>
                        {" "}
                        <label>{t("Household")}</label>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12} lg={3} md={6} sm={12}>
                    <TextField
                      fullWidth
                      disabled
                      size="small"
                      label={t("Household")}
                      value={familyCode}
                    />
                  </Grid>

                  <Grid item xs={12} lg={6} md={8} sm={12} />
                  <Grid item xs={12} lg={3} md={6} sm={12} pt={1}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        gap: "1rem",
                        flexDirection: "row",
                      }}
                    >
                      <Box>
                        {" "}
                        <img
                          src={img}
                          alt="img"
                          width={"28px"}
                          height={"25px"}
                        />
                      </Box>
                      <Box pt={1}>
                        {" "}
                        <label>{t("Head of the Family")}</label>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} lg={3} md={6} sm={12} pt={1}>
                    <TextField
                      fullWidth
                      disabled
                      size="small"
                      label={t("Head of the Family")}
                      value={familyHead}
                    />
                  </Grid>

                  <Grid item xs={12} lg={6} md={8} sm={12} />

                  <Grid item xs={12} lg={3} md={6} sm={12} pt={1}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        gap: "1rem",
                        flexDirection: "row",
                      }}
                    >
                      <Box>
                        {" "}
                        <img src={list} alt="list" />
                      </Box>
                      <Box pt={1}>
                        {" "}
                        <label>{t("Select Visit")}</label>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12} lg={3} md={6} sm={12} pt={1}>
                    <FormControl fullWidth size="small" name="gender">
                      <Select
                        disabled
                        size="small"
                        value={surveyValue}
                        name="survey"
                        onChange={(event, newValue) => {
                          setSurveyValue(event.target.value);
                        }}
                      >
                        <MenuItem value={1}>{t("Visit 1")}</MenuItem>
                        <MenuItem value={2}>{t("Visit 2")}</MenuItem>
                        <MenuItem value={3}>{t("Visit 3")}</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} lg={6} md={8} sm={12} />

                  <Grid item xs={12} lg={3} md={6} sm={12} pt={1}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        gap: "1rem",
                        flexDirection: "row",
                      }}
                      // columnGap={'1rem'}
                    >
                      <Box>
                        {" "}
                        <img
                          src={person}
                          alt="person"
                          width={"25rem"}
                          height={"25rem"}
                        />
                      </Box>
                      <Box pt={1}>
                        <label>{t("Select interviewer")}</label>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12} lg={3} md={6} sm={12} pt={1}>
                    <Autocomplete
                      defaultValue={interviewerValue}
                      multiple
                      size="small"
                      id="combo-box-demo"
                      value={interviewerValue}
                      onChange={(event, newValue) => {
                        setInterviewerValue(newValue);
                      }}
                      options={interviewOptions}
                      isOptionEqualToValue={(option, value) =>
                        option.label === value?.label
                      }
                      sx={{ width: "100%" }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={t("Select interviewer")}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} lg={6} md={8} sm={12} />

                  <Grid item xs={12} lg={3} md={6} sm={12} pt={1}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        gap: "1rem",
                        flexDirection: "row",
                      }}
                    >
                      <Box>
                        <img src={date} alt="date" />
                      </Box>
                      <Box pt={1}>
                        <label>{t("Set Date and Time")}</label>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12} lg={3} md={6} sm={12} pt={1}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DateTimePicker
                        size="small"
                        sx={{ width: "100%" }}
                        // value={dateTime}
                        disablePast
                        format="DD/MM/YYYY hh:mm A"
                        onChange={(newValue) => {
                          if (newValue) {
                            setDateTime(
                              moment(newValue["$d"])?.format(
                                "YYYY-MM-DD hh:mm:ss A"
                              )
                            );
                          } else {
                            setDateTime("");
                          }
                        }}
                        slotProps={{ textField: { size: "small" } }}
                        renderInput={(params) => (
                          <TextField
                            size="small"
                            width={"100%"}
                            sx={{
                              "& .MuiInputBase-input": {
                                height: "10px",
                              },
                            }}
                            {...params}
                          />
                        )}
                      />
                    </LocalizationProvider>
                  </Grid>

                  <Grid item xs={12} lg={6} md={8} sm={12} />

                  <Grid item xs={12} lg={6} md={8} sm={12} />

                  <Grid item xs={12} lg={3} md={6} sm={12} pt={1} />

                  <Grid item xs={12} lg={3} md={6} sm={12} pt={1} />

                  <Grid
                    item
                    xs={12}
                    lg={12}
                    md={12}
                    sm={12}
                    pb={2}
                    pr={2}
                    sx={{ display: "flex", justifyContent: "flex-end" }}
                    gap={2}
                  >
                    <Button
                      variant="contained"
                      style={{ color: "white" }}
                      onClick={() => {
                        navigate("/household");
                      }}
                    >
                      {t("Cancel")}
                    </Button>
                    <Button
                      variant="contained"
                      style={{ color: "white" }}
                      disabled={
                        !surveyValue || !interviewerValue?.length || !dateTime
                      }
                      onClick={() => {
                        handleAssign();
                      }}
                    >
                      {t("Assign survey")}
                    </Button>
                  </Grid>
                </Grid>
              </CacheProvider>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </div>
  );
};

export default CollectionRecipient;
