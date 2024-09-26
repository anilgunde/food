import React, { useEffect, useState } from "react";
import DashCard from "../../components/Common/DashCard";
import {
  Grid,
  Typography,
  CardContent,
  Card,
  MenuItem,
  Select,
  Box,
  TextField,
} from "@mui/material";
import dashsurvey from "../../assets/dash-survey.svg";
import house from "../../assets/house_FILL1_wght400_GRAD0_opsz24.svg";
import chart from "../../assets/bar_chart_FILL1_wght400_GRAD0_opsz24.svg";
import plus from "../../assets/plus.png";
import check from "../../assets/check-solid.svg";
import recently from "../../assets/recent.svg";
import Chart from "chart.js/auto";
import { Line, Doughnut } from "react-chartjs-2";
import { PATHS } from "../../utils/constants";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import axios from "../../api/axios";
import { useDispatch, useSelector } from "react-redux";
import { setTypes } from "../../store/slices/app.tsx";
import moment from "moment";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker, DateTimePicker } from "@mui/x-date-pickers";
import { styled } from "@mui/styles";
import createCache from "@emotion/cache";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});
const cacheLtr = createCache({
  key: "mui-ltr",
  stylisPlugins: [prefixer],
});
const Sample = () => {
  const lang = sessionStorage.getItem("lang");

  const options = {
    responsive: true,
    
    scale: {
      ticks: {
        precision: 0,
      },
      x: {
        reverse: true,
      },
      y: {
        position: lang === "ar" ? "right" : "left",
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
  };
  const { t } = useTranslation();

  const dispatch = useDispatch();
  useEffect(() => {
    i18next.changeLanguage(lang);
  }, [lang]);
  const appState = useSelector((app) => app.app);
  const [total, setTotal] = useState({});
  const [completed, setCompleted] = useState({});
  const [boxes, setBoxes] = useState({});
  const [response, setResponse] = useState([]);
  const [type, setType] = useState("Registered");
  const [range, setRange] = useState("This Week");
  const [data, setData] = useState({
    labels: [],
    datasets: [
      {
        label: t("Visit 1"),
        backgroundColor: "#45AEAE",
        borderColor: "#45AEAE",
        data: [],
      },
      {
        label: t("Visit 2"),
        backgroundColor: "#b3e51c",
        borderColor: "#b3e51c",
        data: [],
      },
      {
        label: t("Visit 3"),
        backgroundColor: "#fae23e",
        borderColor: "#fae23e",
        data: [],
      },
    ],
  });

  useEffect(() => {
    axios
      .get("/api/types/allTypes", {
        headers: {
          authorization: `Bearer ${appState.accessToken}`,
        },
      })
      .then((res) => {
        dispatch(setTypes(res?.data?.data));
      });

    axios
      .get("/api/dashboard/getAllRegisteredInformation", {
        headers: {
          authorization: `Bearer ${appState.accessToken}`,
        },
      })
      .then((res) => {
        setTotal(res?.data?.data[0]);
      });

    axios
      .get("/api/dashboard/getAllCompletedInformation", {
        headers: {
          authorization: `Bearer ${appState.accessToken}`,
        },
      })
      .then((res) => {
        setCompleted(res?.data?.data[0]);
      });
    axios
      .get("/api/dashboard/getAllHeaderCounts", {
        headers: {
          authorization: `Bearer ${appState.accessToken}`,
        },
      })
      .then((res) => {
        setBoxes(res?.data?.data[0]);
      });
  }, []);

  const [startDatee, setStartDate] = useState(null);
  const [endDatee, setEndDate] = useState(null);

  useEffect(() => {
    let startDate;
    let endDate;

    if (range === "This Week") {
      endDate = moment().format("YYYY-MM-DD");
      startDate = moment().subtract(6, "day").format("YYYY-MM-DD");
      endDate = endDate + ' 23:59:59' 
    } else if (range === "This Month") {
      endDate = moment().format("YYYY-MM-DD");
      startDate = `${moment().year()}-${moment().month() + 1}-01`;
      endDate = endDate + ' 23:59:59'
    } else if (range === "This Year") {
      endDate = moment().format("YYYY-MM-DD");
      startDate = `${moment().year()}-01-01`;
      endDate = endDate + ' 23:59:59'
    } else {
      if (startDatee && endDatee) {
        startDate = moment(startDatee["$d"]).format("YYYY-MM-DD");
        endDate = moment(endDatee["$d"]).format("YYYY-MM-DD");
        endDate = endDate + ' 23:59:59'
      }
    }

    axios
      .get("/api/dashboard/getAllVisitsCounts", {
        headers: {
          authorization: `Bearer ${appState.accessToken}`,
        },
        params: {
          startDate,
          endDate,
        },
      })
      .then((res) => {
        setResponse(res?.data?.data);
        setData({
          labels: res?.data?.data?.map((dat) => {
            const range = dat?.range;
            if (range && range.includes("/")) {
              const formattedDate = moment(range).format("DD-MM-YYYY");
              return formattedDate;
            } else {
              return range;
            }
          }),
          datasets: [
            {
              label: t("Visit 1"),
              backgroundColor: "#45AEAE",
              borderColor: "#45AEAE",
              data: res?.data?.data?.map((vis) => vis.totalVisits1),
            },
            {
              label: t("Visit 2"),
              backgroundColor: "#b3e51c",
              borderColor: "#b3e51c",
              data: res?.data?.data?.map((vis) => vis.totalVisits2),
            },
            {
              label: t("Visit 3"),
              backgroundColor: "#fae23e",
              borderColor: "#fae23e",
              data: res?.data?.data?.map((vis) => vis.totalVisits3),
            },
          ],
        });
      });
  }, [range, startDatee, endDatee]);

  
  const doughnutdata = {
    labels: [
      t("Abu Dhabi City"),
      t("Al Ain"),
      t("Al Dhafra"),
      t("Madinat Zayed"),
      t("Ruwais"),
      t("Ghayathi"),
      t("Liwa Oasis"),
      t("Other"),
    ],
    datasets: [
      {
        data:
          type === "Registered"
            ? [
                total?.adcCounts || 0,
                total?.aaCounts || 0,
                total?.adhCounts || 0,
                total?.mzCounts || 0,
                total?.rCounts || 0,
                total?.gCounts || 0,
                total?.loCounts || 0,
                total?.otherCounts || 0,
              ]
            : [
                completed?.adcCounts || 0,
                completed?.aaCounts || 0,
                completed?.adhCounts || 0,
                completed?.mzCounts || 0,
                completed?.rCounts || 0,
                completed?.gCounts || 0,
                completed?.loCounts || 0,
                completed?.otherCounts || 0,
              ],
        backgroundColor: [
          "#ff6384",
          "#45AEAE",
          "#ffce56",
          "#97a9fd",
          "#36a2eb",
          "#45A111",
          "#f99",
          "#f61",
        ],
        borderColor: [
          "#ff6384",
          "#45AEAE",
          "#ffce56",
          "#97a9fd",
          "#36a2eb",
          "#45A111",
          "#f99",
          "#f61",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
      <Grid container columnSpacing={"1rem"} rowSpacing={"1rem"}>
        <CacheProvider value={lang === "ar" ? cacheRtl : cacheLtr}>
          <Grid item lg={4} md={6} sm={12} xs={12}>
            <DashCard
              img={dashsurvey}
              title={t("Surveys")}
              count={boxes?.surveys || 0}
              view={t("View all surveys/Create new")}
              viewImg={plus}
               url={PATHS.Survey.root}
            />
          </Grid>
          <Grid item lg={4} md={6} sm={12} xs={12}>
            <DashCard
              img={house}
              title={t("Households")}
              count={boxes?.households || 0}
              view={t("View household details")}
              viewImg={check}
              url={PATHS.HouseHold.root}
            />
          </Grid>
          <Grid item lg={4} md={6} sm={12} xs={12}>
            <DashCard
              img={chart}
              title={t("Reports")}
              count={boxes?.reports || 0}
              view={t("View all reports")}
              viewImg={recently}
              // url={PATHS.Reports.root}
              url={appState?.loginInfo?.role === 'Administrator'?PATHS.Reports.root:PATHS.Reports.root}
            />
          </Grid>
          
          <Grid item lg={response?.length >= 15 ? 12 : 8} md={response?.length >= 15 ? 12 : 8} sm={12} xs={12} elevation={2}>
            <Card
             
              height={response?.length >= 15 ? '550px' : '100%'}
              padding={"20px"}
              
            >
              <CardContent>
                <div dir={lang === "ar" ? "rtl" : ""}>
                  <Box
                    display={"flex"}
                    justifyContent={"space-between"}
                    gap={"1rem"}
                    alignItems={"center"}
                  >
                    <Typography
                      color={"#5A6670"}
                      marginBottom={"0.5rem"}
                      fontWeight={"bold"}
                    >
                      {t("Survey trend")}
                    </Typography>
                    {range === "Custom" ? (
                      <Box
                        display={"flex"}
                        justifyContent={"space-between"}
                        gap={"1rem"}
                        alignItems={"center"}
                      >
                        <LocalizationProvider dateAdapter={AdapterDayjs}
                        >
                          <DatePicker
                            size="small"
                            sx={{ width: "10rem" }}
                            value={startDatee}
                            disableFuture
                            format="DD/MM/YYYY"
                            label={t("Start Date")}
                            onChange={(newValue) => {
                              if (newValue) {
                                setStartDate(newValue);
                              } else {
                                setStartDate("");
                              }
                            }}
                            slotProps={{ textField: { size: "small" } }}
                            renderInput={(params) => (
                              <TextField
                                size="small"
                                sx={{
                                  "& .MuiInputBase-input": {
                                    height: "10px",
                                  },
                                }}
                                {...params}
                              />
                            )}
                          />
                          <DatePicker
                            size="small"
                            sx={{ width: "10rem" }}
                            value={endDatee}
                            format="DD/MM/YYYY"
                            disableFuture
                            label={t("End Date")}
                            onChange={(newValue) => {
                              if (newValue) {
                                setEndDate(newValue);
                              } else {
                                setEndDate("");
                              }
                            }}
                            slotProps={{ textField: { size: "small" } }}
                            renderInput={(params) => (
                              <TextField
                                size="small"
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
                      </Box>
                    ) : (
                      ""
                    )}
                    <Select
                      size="small"
                      value={range}
                      onChange={(e) => {
                        setRange(e.target.value);
                      }}
                    >
                      <MenuItem value={"This Week"}>{t("This Week")}</MenuItem>
                     
                      <MenuItem value={"This Month"}>
                        {t("This Month")}
                      </MenuItem>
                      <MenuItem value={"This Year"}>{t("This Year")}</MenuItem>
                      <MenuItem value={"Custom"}>{t("Custom")}</MenuItem>
                    </Select>
                  </Box>
                </div>

                <Line
                  data={{ labels: data?.labels, datasets: data?.datasets }}
                  options={options}
                  width={"auto"}
                 
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid item lg={4} md={4} sm={12} xs={12} elevation={2}>
            <Card sx={{ height: "100%" }} padding={"20px"}>
              <CardContent>
                <div dir={lang === "ar" ? "rtl" : ""}>
                  <Box
                    display={"flex"}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                  >
                    <Typography
                      color={"#5A6670"}
                      marginBottom={"0.5rem"}
                      fontWeight={"bold"}
                    >
                      {t("Region wise surveys")}
                    </Typography>
                    <Select
                      size="small"
                      value={type}
                      onChange={(e) => {
                        setType(e.target.value);
                      }}
                    >
                      <MenuItem value={"Registered"}>
                        {t("Registered")}
                      </MenuItem>
                      <MenuItem value={"Completed"}>{t("Completed")}</MenuItem>
                    </Select>
                  </Box>
                </div>
                <Doughnut data={doughnutdata} options={options} />
              </CardContent>
            </Card>
          </Grid>
        </CacheProvider>
      </Grid>
    </>
  );
};

export default Sample;
