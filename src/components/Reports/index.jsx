import React, { useCallback, useEffect, useState } from "react";
import styled from "@emotion/styled";
import {
  Box,
  Collapse,
  FormControl,
  IconButton,
  InputLabel,
  Paper,
  Select,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  ThemeProvider,
  Typography,
  MenuItem as MuiMenuItem,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Autocomplete,
} from "@mui/material";
import TableCell from "@mui/material/TableCell";
import { useTranslation } from "react-i18next";
import axios from "../../api/axios";
import { useDispatch, useSelector } from "react-redux";
import { setApiErrorStatusCode, setLoading } from "../../store/slices/app.tsx";
import { useNavigate } from "react-router-dom";
import { Delete, Edit, Visibility } from "@mui/icons-material";
import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { createTheme } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import * as XlsxPopulate from "xlsx-populate/browser/xlsx-populate";
import moment from "moment";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker,  } from "@mui/x-date-pickers";

const themeRtl = createTheme({
  direction: "rtl",
  palette: {
    primary: {
      main: "#45AEAE",
    },
  },
});
const themeLtr = createTheme({
  direction: "ltr",
  palette: {
    primary: {
      main: "#45AEAE",
    },
  },
});

const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});
const MenuItem = styled((props) => (
  <div dir={lang === "ar" ? "rtl" : ""}>
    <MuiMenuItem {...props} />
  </div>
))(({ theme }) => ({}));
const lang = sessionStorage.getItem("lang");

const Row = (props) => {
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);
  const { user } = props;
  const navigate = useNavigate();
  const page = sessionStorage.getItem("reportPageNumber");
  const [prevPage, setPrevPage] = useState(page);
 

  useEffect(() => {
    // Close the accordion when the page changes
    if (prevPage !== page) {
      setOpen(false);
      setPrevPage(page); // Update the previous page
    }
  }, [page, prevPage]);
  return (
    
      <React.Fragment>
        <TableRow onClick={() => setOpen(!open)} style={{ cursor: "pointer" }}>
          <TableCell align={"center"}>{user?.householdId}</TableCell>
          <TableCell align={"center"}>{user?.familyCode}</TableCell>
          <TableCell align={lang === "ar" ? "right" : "left"}>
            {user?.cityName}
          </TableCell>
          <TableCell align={lang === "ar" ? "right" : "left"}>
            {user?.phoneNumber}
          </TableCell>
          <TableCell align={"center"}>{user?.houseNumber}</TableCell>
          <TableCell align={lang === "ar" ? "right" : "left"}>
            {user?.buildingName}
          </TableCell>
          <TableCell align={"center"}>
            <IconButton size="small" onClick={(e) => {
              e.stopPropagation(); // Prevent triggering the row click
              setOpen(!open);
            }}>
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell
            align={"center"}
            style={{ paddingBottom: 0, paddingTop: 0 }}
            colSpan={7}
          >
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell align="center" style={{ fontWeight: "600" }}>
                      {t("Participant ID")}
                    </TableCell>
                    <TableCell style={{ fontWeight: "600" }}>
                      {t("Paricipant code")}
                    </TableCell>
                    <TableCell
                      align={lang === "ar" ? "right" : "left"}
                      style={{ fontWeight: "600" }}
                    >
                      {t("First name")}
                    </TableCell>
                    <TableCell
                      align={lang === "ar" ? "right" : "left"}
                      style={{ fontWeight: "600" }}
                    >
                      {t("Family name")}
                    </TableCell>
                    <TableCell align={"center"} style={{ fontWeight: "600" }}>
                      {t("Head of family")}
                    </TableCell>
                    <TableCell
                      align={lang === "ar" ? "right" : "left"}
                      style={{ fontWeight: "600" }}
                    >
                      {t("Status")}
                    </TableCell>
                    <TableCell align={"center"} style={{ fontWeight: "600" }}>
                      {t("View Reports")}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {user?.participants?.map((participant) => (
                    <TableRow key={participant?.participantId}>
                      <TableCell component="th" scope="row" align="center">
                        {participant?.participantId}
                      </TableCell>
                      <TableCell>{participant?.participantCode}</TableCell>
                      <TableCell align={lang === "ar" ? "right" : "left"}>
                        {participant?.firstName}
                      </TableCell>
                      <TableCell align={lang === "ar" ? "right" : "left"}>
                        {participant?.familyName}
                      </TableCell>
                      <TableCell align="center">
                        {participant?.headOfFamily === true ? "Yes" : "No"}
                      </TableCell>
                      <TableCell align={lang === "ar" ? "right" : "left"}>
                        {participant.status}
                      </TableCell>
                      <TableCell align={"center"}>
                        <IconButton
                          size="small"
                          onClick={() => {
                            navigate(
                              `/reports/viewReports?id=${participant?.participantId}`
                            );
                          }}
                        >
                          <Visibility />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    
  );
};
const Index = () => {
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const { t } = useTranslation();

  const lang = sessionStorage.getItem("lang");

  const [data, setData] = useState([]);

  const [response, setResponse] = useState({});
  const appState = useSelector((state) => state.app);
  const dispatch = useDispatch();

  const [page, setPage] = useState(() => {
    return parseInt(sessionStorage.getItem("reportPageNumber"), 10) || 0;
  });

  const [rowsPerPage, setRowsPerPage] = useState(() => {
    const savedRowsPerPage = sessionStorage.getItem("reportRowsPerPage");
    return savedRowsPerPage ? +savedRowsPerPage : 10 || 10;
  });
  const [searchText, setSearchText] = useState("");

  const [location, setLocation] = useState("");
  const [genderid, setGender] = useState("");
  const [pregnancy, setPregnant] = useState("");
  const [breastfeeding, setBreastFeeding] = useState("");
  const [agerange, setAge] = useState("");
  const [weightrange, setWeight] = useState("");
  const [heightrange, setHeight] = useState("");
  const [bmirange, setBmi] = useState("");
  const [visitno, setVisit] = useState(null);
  const [interviewOptions, setInterviewOptions] = useState([]);
  const [interviewerValue, setInterviewerValue] = useState();

  const [startDatee, setStartDate] = useState();
  const [endDatee, setEndDate] = useState();

  useEffect(() => {
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
      });
  }, []);

  const handleSubmit = () => {
    setPage(0);
    if ((startDatee || endDatee) && !visitno) {
      toast.error("Please enter Start Date, End Date, and Visit Number");
    } else if (startDatee && endDatee && visitno) {
      setSearchText(Math.random());
    } else if (
      !startDatee &&
      !endDatee &&
      !visitno &&
      !location &&
      !genderid &&
      !pregnancy &&
      !breastfeeding &&
      !agerange &&
      !weightrange &&
      !heightrange &&
      !bmirange &&
      !interviewerValue?.value
    ) {
      toast.error("Please select at least one filter");
    } else {
      setSearchText(Math.random());
    }
  };

  const handleReset = () => {
    setLocation("");
    setGender("");
    setPregnant("");
    setBreastFeeding("");
    setAge("");
    setWeight("");
    setHeight("");
    setBmi("");
    setInterviewerValue();
    setVisit(null);
    setSearchText(Math.random());
    setStartDate(null);
    setEndDate(null);
  };

  const loginuser = appState?.loginInfo?.user_id;

  useEffect(() => {
    const debounce = setTimeout(() => {
      dispatch(setLoading(true));

      setOpen(false);

      if (appState?.loginInfo?.role === "Interviewer") {
        axios
          .get("/api/household/getAllHouseholdsDemograhics", {
            headers: { authorization: `Bearer ${appState?.accessToken}` },
            params: {
              pageSize: rowsPerPage,
              pageNumber: page + 1,
              interviwerId: loginuser,
              ...(location && { location: location }),
              ...(genderid && { genderid: genderid }),
              ...(pregnancy && { pregnancy: pregnancy }),
              ...(breastfeeding && { breastfeeding: breastfeeding }),
              ...(agerange && { agerange: agerange }),
              ...(weightrange && { weightrange: weightrange }),
              ...(heightrange && { heightrange: heightrange }),
              ...(bmirange && { bmirange: bmirange }),
              ...(visitno && { visitno: visitno }),
            },
          })
          .then((res) => {
            setData(
              res?.data?.data?.items?.map((it) => ({
                ...it,
                participants: it.participants?.map((p) => ({
                  ...p,
                  questionnaireResponse: p?.questionnaireResponse?.map(
                    (ques) => ({
                      ...ques,
                      response: Object.entries(JSON.parse(ques?.response)).map(
                        ([question, answer]) => ({
                          question,
                          answer,
                        })
                      ),
                    })
                  ),
                })),
              }))
            );
            setResponse(res?.data?.data);
            dispatch(setLoading(false));
          })
          .catch((err) => {
            dispatch(setApiErrorStatusCode(err?.response?.status));
            dispatch(setLoading(false));
          });
      } else if (startDatee && endDatee) {
        if (visitno === "") {
          toast.error("Please Enter Visit Number");
        } else {
          axios
            .get("/api/household/getAllHouseholdsDemograhics", {
              headers: { authorization: `Bearer ${appState?.accessToken}` },
              params: {
                pageSize: rowsPerPage,
                pageNumber: page + 1,
                ...(location && { location: location }),
                ...(genderid && { genderid: genderid }),
                ...(pregnancy && { pregnancy: pregnancy }),
                ...(breastfeeding && { breastfeeding: breastfeeding }),
                ...(agerange && { agerange: agerange }),
                ...(weightrange && { weightrange: weightrange }),
                ...(heightrange && { heightrange: heightrange }),
                ...(bmirange && { bmirange: bmirange }),
                ...(visitno && { visitno: visitno }),
                ...{
                  surveyStartDate: moment(startDatee["$d"]).format(
                    "YYYY-MM-DD"
                  ),
                },
                ...{
                  surveyEndDate: moment(endDatee["$d"]).format("YYYY-MM-DD"),
                },
                ...(interviewerValue?.value && {
                  interviwerId: interviewerValue?.value,
                }),
                // export:true
              },
            })
            .then((res) => {
              setData(
                res?.data?.data?.items?.map((it) => ({
                  ...it,
                  participants: it.participants?.map((p) => ({
                    ...p,
                    questionnaireResponse: p?.questionnaireResponse?.map(
                      (ques) => ({
                        ...ques,
                        response: Object.entries(
                          JSON.parse(ques?.response)
                        ).map(([question, answer]) => ({
                          question,
                          answer,
                        })),
                      })
                    ),
                  })),
                }))
              );
              setResponse(res?.data?.data);
              dispatch(setLoading(false));
            })
            .catch((err) => {
              dispatch(setApiErrorStatusCode(err?.response?.status));
              dispatch(setLoading(false));
            });
        }
      } else {
        axios
          .get("/api/household/getAllHouseholdsDemograhics", {
            headers: { authorization: `Bearer ${appState?.accessToken}` },
            params: {
              pageSize: rowsPerPage,
              pageNumber: page + 1,
              ...(location && { location: location }),
              ...(genderid && { genderid: genderid }),
              ...(pregnancy && { pregnancy: pregnancy }),
              ...(breastfeeding && { breastfeeding: breastfeeding }),
              ...(agerange && { agerange: agerange }),
              ...(weightrange && { weightrange: weightrange }),
              ...(heightrange && { heightrange: heightrange }),
              ...(bmirange && { bmirange: bmirange }),
              ...(visitno && { visitno: visitno }),
              ...(interviewerValue?.value && {
                interviwerId: interviewerValue?.value,
              }),
              // export:true
            },
          })
          .then((res) => {
            setData(
              res?.data?.data?.items?.map((it) => ({
                ...it,
                participants: it.participants?.map((p) => ({
                  ...p,
                  questionnaireResponse: p?.questionnaireResponse?.map(
                    (ques) => ({
                      ...ques,
                      response: Object.entries(JSON.parse(ques?.response)).map(
                        ([question, answer]) => ({
                          question,
                          answer,
                        })
                      ),
                    })
                  ),
                })),
              }))
            );
            setResponse(res?.data?.data);
            dispatch(setLoading(false));
          })
          .catch((err) => {
            dispatch(setApiErrorStatusCode(err?.response?.status));
            dispatch(setLoading(false));
          });
      }
    }, 1);
    return () => {
      clearTimeout(debounce);
    };
  }, [rowsPerPage, page, searchText]);

  useEffect(() => {
    setData(appState?.participantData);
  }, [appState?.participantData]);

  useEffect(() => {
    sessionStorage.setItem("reportPageNumber", page);
  }, [page]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = +event.target.value;
    setRowsPerPage(newRowsPerPage);
    setPage(0);

    sessionStorage.setItem("reportRowsPerPage", newRowsPerPage);
  };
  const [open, setOpen] = React.useState(false);

  const Test22 = [];

  let flattedArray = [];
  const addStyles = (workbookBlob, dataInfo) => {
    return XlsxPopulate.fromDataAsync(workbookBlob).then((workbook) => {
      workbook.sheets().forEach((sheet) => {
        sheet.column("A").width(10);
        sheet.column("B").width(15);
        sheet.column("C").width(15);
        sheet.column("D").width(15);
        sheet.column("E").width(15);
        sheet.column("F").width(15);
        sheet.column("G").width(15);
        sheet.column("H").width(15);
        sheet.column("I").width(15);
        sheet.column("J").width(15);

        function getColumnLetter(index) {
          let columnName = "";
          while (index > 0) {
            const remainder = (index - 1) % 26;
            columnName = String.fromCharCode(65 + remainder) + columnName;
            index = Math.floor((index - 1) / 26);
          }
          return columnName;
        }
        flattedArray?.map((row, index) => {
          const sort = row?.foodIntakeResponse
            ?.filter((vis) => vis.visitNumber === 1)
            ?.slice()
            .sort((a, b) => a.foodIntakeTypeId - b.foodIntakeTypeId);
          const sort2 = row?.foodIntakeResponse
            ?.filter((vis) => vis.visitNumber === 2)
            ?.slice()
            .sort((a, b) => a.foodIntakeTypeId - b.foodIntakeTypeId);

          let sortedData = Object.values(
            sort.reduce((groups, food) => {
              if (!groups[food.foodIntakeTypeId]) {
                groups[food.foodIntakeTypeId] = [];
              }
              groups[food.foodIntakeTypeId].push(food);
              return groups;
            }, {})
          );

          let sortedData2 = Object.values(
            sort2.reduce((groups, food) => {
              if (!groups[food.foodIntakeTypeId]) {
                groups[food.foodIntakeTypeId] = [];
              }
              groups[food.foodIntakeTypeId].push(food);
              return groups;
            }, {})
          );

          let col = 123 + 32;
          let col2 = 123 + 32;
          let col3 = 3;

          sheet.range("A4:ZZ4").style({
            bold: true,
          });

          sortedData?.flat()?.map((food, ind) => {
            sheet
              .cell(`${getColumnLetter(col3)}${index + 5}`)
              .value(food?.visitNumber);
            col--;
          });
          sortedData2?.flat()?.map((food, ind) => {
            sheet
              .cell(`${getColumnLetter(col3)}${index + 5}`)
              .value(food?.visitNumber);
            col2--;
          });

          let cell = 4 + index + 1;
          row.nutrientValueResponse
            ?.filter((fil) => fil.visitNumber === 1)
            ?.map((nutr, i) => {
              sheet
                .cell(`${getColumnLetter(123 + i)}${4}`)
                .value(nutr.nutrientName);
            });
          row.nutrientValueResponse
            ?.filter((fil, a) => fil.visitNumber === 1)
            ?.map((nutr, i) => {
              sheet
                .cell(`${getColumnLetter(123 + i)}${cell}`)
                .value(nutr.nutrientValue);
            });
          row.nutrientValueResponse
            ?.filter((fil, a) => fil.visitNumber === 2)
            ?.map((nutr, i) => {
              sheet
                .cell(`${getColumnLetter(123 + i)}${cell}`)
                .value(nutr.nutrientValue);
            });

          sheet.cell(`${getColumnLetter(123 + 30)}${4}`).value("BMI Value");
          sheet.cell(`${getColumnLetter(123 + 31)}${4}`).value("EER Value");
          row.nutrientIndexResponse?.map((nutr, i) => {
            sheet
              .cell(`${getColumnLetter(123 + 30)}${index + 5}`)
              .value(nutr.bmiValue);
            sheet
              .cell(`${getColumnLetter(123 + 31)}${index + 5}`)
              .value(nutr.eerValue);
          });
        });
      });
      return workbook
        .outputAsync()
        .then((workbookBlob) => URL.createObjectURL(workbookBlob));
    });
  };

  const s2ab = useCallback((s) => {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i !== s.length; ++i) {
      view[i] = s.charCodeAt(i);
    }

    return buf;
  }, []);
  const workbook2blob = useCallback(
    (workbook) => {
      const wopts = {
        bookType: "xlsx",
        type: "binary",
      };
      const wbout = XLSX.write(workbook, wopts);

      const blob = new Blob([s2ab(wbout)], {
        type: "application/octet-stream",
      });
      return blob;
    },
    [s2ab]
  );

  const handleExport = useCallback(async () => {
    let result;
dispatch(setLoading(true));
await axios
  .get("/api/household/getAllHouseholdsDemograhics", {
    headers: { authorization: `Bearer ${appState?.accessToken}` },
    params: {
      pageSize: rowsPerPage,
      pageNumber: page + 1,
      ...(location && { location: location }),
      ...(genderid && { genderid: genderid }),
      ...(pregnancy && { pregnancy: pregnancy }),
      ...(breastfeeding && { breastfeeding: breastfeeding }),
      ...(agerange && { agerange: agerange }),
      ...(weightrange && { weightrange: weightrange }),
      ...(heightrange && { heightrange: heightrange }),
      ...(bmirange && { bmirange: bmirange }),
      ...(visitno && { visitno: visitno }),
      ...{
        surveyStartDate: startDatee?.["$d"]
          ? moment(startDatee["$d"]).format("YYYY-MM-DD")
          : null,
      },
      ...{
        surveyEndDate: endDatee?.["$d"]
          ? moment(endDatee["$d"]).format("YYYY-MM-DD")
          : null,
      },
      ...(interviewerValue && { interviwerId: interviewerValue.value }),
      export: true,
    },
  })
  .then(async (res) => {
    result = await res?.data?.data?.items?.map((it) => ({
      ...it,
      participants: it.participants?.map((p) => ({
        ...p,
        questionnaireResponse: p?.questionnaireResponse?.map((ques) => {
          // Determine the response based on language
          let response = {};
          if (ques?.response) {
            try {
              // Parse JSON response
              response = JSON.parse(ques?.response);
            } catch (error) {
              console.error('Failed to parse response JSON:', error);
              response = {};
            }
          }

          return {
            ...ques,
            response: Object.entries(response).map(([question, answer]) => ({
              question,
              answer,
            })),
            responseArabic: ques?.language === 'ar' ? ques?.responseArabic : null,
          };
        }),
      })),
    }));

    // console.log('Processed result:', result);
    setResponse(res?.data?.data);
    dispatch(setLoading(false));
  })
  .catch((err) => {
    console.error('API Error:', err);
    dispatch(setApiErrorStatusCode(err?.response?.status));
    dispatch(setLoading(false));
  });




    const TimeStampp = [
      {
        A: "",
        B: "",
        C: "",
        D: "",
        E: "",
        F: "",
        G: "",
        H: "",
        I: "",
        J: ` Timestamp : ${moment(new Date()).format("hh:mm:ss A")}`,
      },
    ];
   
    let HorizontalTable = [
      {
        A: "Participant Code",
        B: "Family Code",
        C: "Visit Number",
        D: "Survey Time",
        E: "First Name",
        F: "Family Name",
        G: "Emirate",
        H: "is UAE Citizen ?",
        I: "City / Area",
        J: "Household Income per Month",
        K: "Date of Birth",
        L: "Age",
        M: "Gender",
        N: "Pregnant?",
        O: "BreastFeeding?",
        P: "Weight (Kgs) - Estimated",
        Q: "Height (Cm)-Estimated",
        R: "Weight (Kgs) - Measured",
        S: "Height (Cm)-Measured",
        T: "Body Fat (%)",
        U: "Marital Status",
        V: "Current Situation",
        W: "Level of Education",

        X: "Are you currently following a special diet?",

        Y: "Vegetarian (Diet)",

        Z: "Therapeutic (Diet)",

        AA: "Weight management (Diet)",

        AB: "Allergy-free (Diet)",

        AC: "Sport (Diet)",

        AD: "Do you suffer from any food allergies or intolerances?",

        AE: "Please provide the list of allergies or intolerances suffered",

        AF: "Do you regularly take any supplements?",

        AG: "Supplements",

        AH: "How do you rate your own health?",

        AI: "During the last 7 days, on how many days did you do vigorous physical activities like heavy lifting, digging, aerobics, or fast bicycling? Please input value in [0-7] days",

        AJ: "How much time did you usually spend doing vigorous physical activities on one of those days? Please input value in [0-6]hours and [0-60] minutes",

        AK: "During the last 7 days, on how many days did you do moderate physical activities like carrying light loads, bicycling at a regular pace, or doubles tennis? Do not include walking. Please input value in [0-7] Days.",

        AL: "How much time did you usually spend doing moderate physical activities on one of those days? Please input value in [0-6]hours and [0-60] minutes",

        AM: "During the last 7 days, on how many days did you walk for at least 10 minutes at a time? Please input value in [0-7] Days",

        AN: "How much time did you usually spend walking on one of those days? Please input value in [0-6]hours and [0-60] minutes",

        AO: "During the last 7 days, on how many days did your child do vigorous physical activities like play clubs on the street, rollerblading, or fast bicycling? Please input value in [0-7] Days",

        AP: "During the last 7 days, on how many days did you do moderate physical activities like rope jumping, ice-skating in the malls or at skating centers, or bicycling at a regular pace? Do notinclude walking.Please input value in [0-7] Days",

        AQ: "During the last 7 days, on how many days did you walk for at least 10 minutes at a time? Please input value in [0-7] Days",

        AR: "Do you smoke?",

        AS: "What type of water did you use for drinking?",

        AT: "If you did NOT use tap water, please tell us the reason why? ",

        AU: "What type of water did you use for preparation of your tea/coffee?",

        AV: "Do you cook or participate in food preparation?",

        AW: "What type of water do you use for cooking?",

        AX: "If you used bottled water, please specify the water brand(s)",

        AY: "Do you wash your hands before you eat?",

        AZ: "Do you wash your hands before/during food preparation?",

        BA: "How do you prepare fruits and vegetables before you eat them?",

        BB: "How often do you wash fruits and vegetables before consumption?",

        BC: "Do you use anything to treat fruits and vegetables when you wash/prepare them ?",

        BD: "Do you use one of them to treat vegetables?",

        BE: "How long do you soak fruit and vegetable? Please input value in [0-6]hours and [0-60]minutes",

        BF: "Do you rinse the fruit/vegetables after soaking?",

        BG: "Have you suffered from any symptoms of food poisoning (e.g., diarrhea, vomiting, nausea) last year?",

        BH: "How many times did you have food poisoning last year?",

        BI: "What kind of food poisoning symptoms did you suffer from?",

        BJ: "What kind of materials your cookware is made of?",

        BK: "Who is the primary food shopper(s) in your household? The primary food shopper(s) is the person(s) who does the grocery shopping most often.",

        BL: "What was the single most frequently used food source in the past 30 days?",

        BM: "In the past 30 days, on how many days did the primary food shopper(s) shop/purchase food? [0-30] Days",

        BN: "What was the amount in AED spent on food purchase in the past 30 days?",

        BO: "Which factors influence your food purchase decisions?",

        BP: "What is your preferred payment method?",

        BQ: "I prefer fresh foods..",

        BR: "I enjoy trying new foods.",

        BS: "I prefer online food shopping/purchase.",

        BT: "I avoid wasting food.",

        BU: "I avoid storing/stacking food.",

        BV: "What is your opinion about organic foods?",

        BW: "What is your opinion about locally sourced foods?",

        BX: "What is your opinion about sustainable foods?",

        BY: "How many hours per day did you use your smartphone for personal reasons (not for work) in the past 30 days during weekdays? (if you did not use smartphone, enter 0)",

        BZ: "How many hours per day did you use your smartphone for personal reasons (not for work) in the past 30 days during weekends? (if you did not use smartphone, enter 0)",

        CA: "What was the single most frequently used smartphone content type during the past 30 days?",

        CB: "How many hours per day did you use a social media platform in the past 30 days during weekdays? (if you did not use social media, enter 0)",

        CC: "How many hours per day did you use a social media platform in the past 30 days during weekends? (if you did not use social media, enter 0)",

        CD: "What was the single most frequently used social media (e.g., Instagram, X (Twitter), Facebook) content type during the past 30 days?",



        CE: "How many times you consumed fruits? [In the Past 7 Days]",
        CF: "How many times you consumed vegetables? [In the Past 7 Days]",
        CG: "How many times you consumed milk? [In the Past 7 Days]",
        CH: "How many times you consumed Proteins (Meat, poultry, fish,legumes)?[In the Past 7 Days]",
        CI: "How many times you ate breakfast? [In the Past 7 Days]",
        CJ: "How many times you consumed energy drinks? [In the Past 7 Days]",
        CK: "How many times you consumed sweetened beverages(juices, carbonateddrinks, …etc.)? [In the Past 7 Days]",
        CL: "How many times you consumed fast food? [In the Past 7 Days]",
        CM: "How many times you consumed snacks? [In the Past 7 Days]",
        CN: "How many times you consumed grains (rice, wheat, …etc.)?[In the Past 7Days]",




        CO: "Who is the primary food shopper(s) in your household? The primary food shopper(s) is the person(s) who does the grocery shopping most often",
        CP: "What was the single most frequently used food source in the past 30 days?",
        CQ: "In the past 30 days, on how many days did the primary food shopper(s) shop/purchase food? [0-30] Days",
        CR: "What was the amount in AED spent on food purchase in the past 30 days?",
        CS: "Which factors influence your food purchase decisions?",
        CT: "What is your preferred payment method?",
        CU: "I prefer fresh foods",
        CV: "I prefer online food shopping/purchase.",
        CW: "I avoid wasting food.",
        CX: "I avoid storing/stacking food.",


        CY: "I enjoy trying new foods.",
        CZ: "What is your opinion about organic foods?",
        DA: "What is your opinion about locally sourced foods?",
        DB: "What is your opinion about sustainable foods?",
        DC: "How many hours per day did you use your smartphone for personal reasons (not for work) in the past 30 days during weekdays? (if you did not use smartphone, enter 0)",
        DD: "What was the single most frequently used smartphone content type during the past 30 days?",
        DE: "How many hours per day did you use your smartphone for personal reasons (not for work) in the past 30 days during weekends? (if you did not use smartphone, enter 0)",
        DF: "How many hours per day did you use a social media platform in the past 30 days during weekdays? (if you did not use social media, enter 0)",
        DG: "How many hours per day did you use a social media platform in the past 30 days during weekends? (if you did not use social media, enter 0)",
        DH: "What was the single most frequently used social media (e.g., Instagram,X (Twitter), Facebook) content type during the past 30 days?",


        DI: "How many times you consumed fruits? [In the Past 7 Days]",
        DJ: "How many times you consumed vegetables? [In the Past 7 Days]",
        DK: "How many times you consumed milk? [In the Past 7 Days]",
        DL: "How many times you consumed Proteins (Meat, poultry, fish,legumes)?[In the Past 7 Days]",
        DM: "How many times you ate breakfast? [In the Past 7 Days]",
        DN: "How many times you consumed energy drinks? [In the Past 7 Days]",
        DO: "How many times you consumed sweetened beverages(juices, carbonateddrinks, …etc.)? [In the Past 7 Days]",
        DP: "How many times you consumed fast food? [In the Past 7 Days]",
        DQ: "How many times you consumed snacks? [In the Past 7 Days]",
        DR: "How many times you consumed grains (rice, wheat, …etc.)?[In the Past 7Days]",
      },
    ];

    const newArr = result?.map((arr) =>
      arr?.participants?.map((arr2) => ({
        ...arr2,
        familyCode: arr?.familyCode,
      }))
    );

    flattedArray = newArr
      ?.flat()
      ?.map((a, index) => ({
        arr: a?.questionnaireResponse?.map((aa, index2) => ({
          ...a,
          questionnaireResponse: a?.questionnaireResponse?.[index2],
          foodIntakeResponse: a?.foodIntakeResponse?.filter(
            (vis, inde) => vis?.visitNumber === index2 + 1
          ),
          nutrientIndexResponse: a?.nutrientIndexResponse?.filter(
            (vis, inde) => vis?.visitNumber === index2 + 1
          ),
          nutrientValueResponse: a?.nutrientValueResponse?.filter(
            (vis, inde) => vis?.visitNumber === index2 + 1
          ),
        })),
      }))
      ?.map((ar) => ar?.arr)
      ?.flat();

    flattedArray?.forEach((row, index) => {
      HorizontalTable.push({
        A: row?.participantCode || "NA",
        B: row?.familyCode || "NA",
        C: row?.visitNumber  || "3",
        D: row?.startTime || "NA",
        E: row?.firstName || "NA",
        F: row?.familyName || "NA",
        G: row?.demographicResponse?.nationality || "NA",
        H: row?.demographicResponse?.isUAECitizen || "NA",
        I: row?.demographicResponse?.location || "NA",
        J:
          appState?.types?.incomeGroups?.find(
            (gender) => gender?.id === row?.demographicResponse?.incomeGroupId
          )?.label || "NA",
        K: row?.dob || "NA",
        L: row?.demographicResponse?.age || "NA",
        M:
          appState?.types?.genderTypes?.find(
            (gender) => gender?.genderId === row?.genderId
          )?.genderName || "NA",
        N:
          row?.demographicResponse?.isPregnant === true
            ? "Yes"
            : row?.demographicResponse?.isPregnant === false
            ? "No"
            : "NA",
        O:
          row?.demographicResponse?.isLactating === true
            ? "Yes"
            : row?.demographicResponse?.isPregnant === false
            ? "No"
            : "NA",
        P: row?.demographicResponse?.estimatedWeight || "NA",
        Q: row?.demographicResponse?.estimatedHeight || "NA",
        R: row?.demographicResponse?.weight || "NA",
        S: row?.demographicResponse?.height || "NA",
        T: row?.demographicResponse?.bodyFat || "NA",
        U:
          appState?.types?.maritalStatusTypes?.find(
            (mart) => mart?.maritalId === row?.maritalStatusId
          )?.maritalName || "NA",
        V:
          appState?.types?.occupationTypes?.find(
            (occ) => occ?.occupationId === row?.occupationId
          )?.occupationName || "NA",

        W:
          appState?.types?.academicLevelTypes?.find(
            (aca) => aca?.academicLevelId === row?.academicLevelId
          )?.academicLevelName || "NA",

        X: row?.questionnaireResponse?.response?.find(
          (item) =>
            item?.question === "Are you currently following a special diet?"
        )?.answer,

        Y:
          row?.questionnaireResponse?.response?.find(
            (item) => item?.question === "Vegetarian (Diet)"
          )?.answer || "NA",

        Z:
          row?.questionnaireResponse?.response?.find(
            (item) => item?.question === "Therapeutic (Diet)"
          )?.answer || "NA",

        AA:
          row?.questionnaireResponse?.response?.find(
            (item) => item?.question === "Weight management (Diet)"
          )?.answer || "NA",

        AB:
          row?.questionnaireResponse?.response?.find(
            (item) => item?.question === "Allergy-free (Diet)"
          )?.answer || "NA",

        AC:
          row?.questionnaireResponse?.response?.find(
            (item) => item?.question === "Sport (Diet)"
          )?.answer || "NA",

        AD:
          row?.questionnaireResponse?.response?.find(
            (item) =>
              item?.question ===
              "Do you suffer from any food allergies or intolerances?"
          )?.answer || "NA",

        AE:
          row?.questionnaireResponse?.response?.find(
            (item) =>
              item?.question ===
              "Please provide the list of allergies or intolerances suffered"
          )?.answer || "NA",

        AF:
          row?.questionnaireResponse?.response?.find(
            (item) =>
              item?.question === "Do you regularly take any supplements?"
          )?.answer || "NA",

        AG:
          row?.questionnaireResponse?.response?.find(
            (item) => item?.question === "Supplements"
          )?.answer || "NA",

        AH:
          row?.questionnaireResponse?.response?.find(
            (item) => item?.question === "How do you rate your own health?"
          )?.answer || "NA",

        AI:
          row?.questionnaireResponse?.response?.find(
            (item) =>
              item?.question ===
              "During the last 7 days, on how many days did you do vigorous physical activities like heavy lifting, digging, aerobics, or fast bicycling? Please input value in [0-7] days"
          )?.answer || "NA",

        AJ:
          row?.questionnaireResponse?.response?.find(
            (item) =>
              item?.question ===
              "How much time did you usually spend doing vigorous physical activities on one of those days? Please input value in [0-6]hours and [0-60] minutes"
          )?.answer || "NA",

        AK:
          row?.questionnaireResponse?.response?.find(
            (item) =>
              item?.question ===
              "During the last 7 days, on how many days did you do moderate physical activities like carrying light loads, bicycling at a regular pace, or doubles tennis? Do not include walking. Please input value in [0-7] Days."
          )?.answer || "NA",

        AL:
          row?.questionnaireResponse?.response?.find(
            (item) =>
              item?.question ===
              "How much time did you usually spend doing moderate physical activities on one of those days? Please input value in [0-6]hours and [0-60] minutes"
          )?.answer || "NA",

        AM:
          row?.questionnaireResponse?.response?.find(
            (item) =>
              item?.question ===
              "During the last 7 days, on how many days did you walk for at least 10 minutes at a time? Please input value in [0-7] Days"
          )?.answer || "NA",

        AN:
          row?.questionnaireResponse?.response?.find(
            (item) =>
              item?.question ===
              "How much time did you usually spend walking on one of those days? Please input value in [0-6]hours and [0-60] minutes"
          )?.answer || "NA",

        AO:
          row?.questionnaireResponse?.response?.find(
            (item) =>
              item?.question ===
              "During the last 7 days, on how many days did your child do vigorous physical activities like play clubs on the street, rollerblading, or fast bicycling? Please input value in [0-7] Days"
          )?.answer || "NA",

        AP:
          row?.questionnaireResponse?.response?.find(
            (item) =>
              item?.question ===
              "During the last 7 days, on how many days did you do moderate physical activities like rope jumping, ice-skating in the malls or at skating centers, or bicycling at a regular pace? Do notinclude walking.Please input value in [0-7] Days"
          )?.answer || "NA",

        AQ:
          row?.questionnaireResponse?.response?.find(
            (item) =>
              item?.question ===
              "During the last 7 days, on how many days did you walk for at least 10 minutes at a time? Please input value in [0-7] Days"
          )?.answer || "NA",

        AR:
          row?.questionnaireResponse?.response?.find(
            (item) => item?.question === "Do you smoke?"
          )?.answer || "NA",

        AS:
          row?.questionnaireResponse?.response?.find(
            (item) =>
              item?.question === "What type of water did you use for drinking?"
          )?.answer || "NA",

        AT:
          row?.questionnaireResponse?.response?.find(
            (item) =>
              item?.question ===
              "If you did NOT use tap water, please tell us the reason why?"
          )?.answer || "NA",

        AU:
          row?.questionnaireResponse?.response?.find(
            (item) =>
              item?.question ===
              "What type of water did you use for preparation of your tea/coffee?"
          )?.answer || "NA",

        AV:
          row?.questionnaireResponse?.response?.find(
            (item) =>
              item?.question ===
              "Do you cook or participate in food preparation?"
          )?.answer || "NA",

        AW:
          row?.questionnaireResponse?.response?.find(
            (item) =>
              item?.question === "What type of water do you use for cooking?"
          )?.answer || "NA",

        AX:
          row?.questionnaireResponse?.response?.find(
            (item) =>
              item?.question ===
              "If you used bottled water, please specify the water brand(s)"
          )?.answer || "NA",

        AY:
          row?.questionnaireResponse?.response?.find(
            (item) =>
              item?.question === "Do you wash your hands before you eat?"
          )?.answer || "NA",

        AZ:
          row?.questionnaireResponse?.response?.find(
            (item) =>
              item?.question ===
              "Do you wash your hands before/during food preparation?"
          )?.answer || "NA",

        BA:
          row?.questionnaireResponse?.response?.find(
            (item) =>
              item?.question ===
              "How do you prepare fruits and vegetables before you eat them?"
          )?.answer || "NA",

        BB:
          row?.questionnaireResponse?.response?.find(
            (item) =>
              item?.question ===
              "How often do you wash fruits and vegetables before consumption?"
          )?.answer || "NA",

        BC:
          row?.questionnaireResponse?.response?.find(
            (item) =>
              item?.question ===
              "Do you use anything to treat fruits and vegetables when you wash/prepare them ?"
          )?.answer || "NA",

        BD:
          row?.questionnaireResponse?.response?.find(
            (item) =>
              item?.question === "Do you use one of them to treat vegetables?"
          )?.answer || "NA",

        BE:
          row?.questionnaireResponse?.response?.find(
            (item) =>
              item?.question ===
              "How long do you soak fruit and vegetable? Please input value in [0-6]hours and [0-60]minutes"
          )?.answer || "NA",

        BF:
          row?.questionnaireResponse?.response?.find(
            (item) =>
              item?.question ===
              "Do you rinse the fruit/vegetables after soaking?"
          )?.answer || "NA",

        BG:
          row?.questionnaireResponse?.response?.find(
            (item) =>
              item?.question ===
              "Have you suffered from any symptoms of food poisoning (e.g., diarrhea, vomiting, nausea) last year?"
          )?.answer || "NA",

        BH:
          row?.questionnaireResponse?.response?.find(
            (item) =>
              item?.question ===
              "How many times did you have food poisoning last year?"
          )?.answer || "NA",

        BI:
          row?.questionnaireResponse?.response?.find(
            (item) =>
              item?.question ===
              "What kind of food poisoning symptoms did you suffer from?"
          )?.answer || "NA",

        BJ:
          row?.questionnaireResponse?.response?.find(
            (item) =>
              item?.question ===
              "What kind of materials your cookware is made of?"
          )?.answer || "NA",

        BK:
          row?.questionnaireResponse?.response?.find(
            (item) =>
              item?.question ===
              "Who is the primary food shopper(s) in your household? The primary food shopper(s) is the person(s) who does the grocery shopping most often."
          )?.answer || "NA",

        BL:
          row?.questionnaireResponse?.response?.find(
            (item) =>
              item?.question ===
              "What was the single most frequently used food source in the past 30 days?"
          )?.answer || "NA",

        BM:
          row?.questionnaireResponse?.response?.find(
            (item) =>
              item?.question ===
              "In the past 30 days, on how many days did the primary food shopper(s) shop/purchase food? [0-30] Days"
          )?.answer || "NA",

        BN:
          row?.questionnaireResponse?.response?.find(
            (item) =>
              item?.question ===
              "What was the amount in AED spent on food purchase in the past 30 days?"
          )?.answer || "NA",

        BO:
          row?.questionnaireResponse?.response?.find(
            (item) =>
              item?.question ===
              "Which factors influence your food purchase decisions?"
          )?.answer || "NA",

        BP:
          row?.questionnaireResponse?.response?.find(
            (item) =>
              item?.question === "What is your preferred payment method?"
          )?.answer || "NA",

        BQ:
          row?.questionnaireResponse?.response?.find(
            (item) => item?.question === "I prefer fresh foods.."
          )?.answer || "NA",

        BR:
          row?.questionnaireResponse?.response?.find(
            (item) => item?.question === "I enjoy trying new foods."
          )?.answer || "NA",

        BS:
          row?.questionnaireResponse?.response?.find(
            (item) =>
              item?.question === "I prefer online food shopping/purchase."
          )?.answer || "NA",

        BT:
          row?.questionnaireResponse?.response?.find(
            (item) => item?.question === "I avoid wasting food."
          )?.answer || "NA",

        BU:
          row?.questionnaireResponse?.response?.find(
            (item) => item?.question === "I avoid storing/stacking food."
          )?.answer || "NA",

        BV:
          row?.questionnaireResponse?.response?.find(
            (item) =>
              item?.question === "What is your opinion about organic foods?"
          )?.answer || "NA",

        BW:
          row?.questionnaireResponse?.response?.find(
            (item) =>
              item?.question ===
              "What is your opinion about locally sourced foods?"
          )?.answer || "NA",

        BX:
          row?.questionnaireResponse?.response?.find(
            (item) =>
              item?.question === "What is your opinion about sustainable foods?"
          )?.answer || "NA",

        BY:
          row?.questionnaireResponse?.response?.find(
            (item) =>
              item?.question ===
              "How many hours per day did you use your smartphone for personal reasons (not for work) in the past 30 days during weekdays? (if you did not use smartphone, enter 0)"
          )?.answer || "NA",

        BZ:
          row?.questionnaireResponse?.response?.find(
            (item) =>
              item?.question ===
              "How many hours per day did you use your smartphone for personal reasons (not for work) in the past 30 days during weekends? (if you did not use smartphone, enter 0)"
          )?.answer || "NA",

        CA:
          row?.questionnaireResponse?.response?.find(
            (item) =>
              item?.question ===
              "What was the single most frequently used smartphone content type during the past 30 days?"
          )?.answer || "NA",

        CB:
          row?.questionnaireResponse?.response?.find(
            (item) =>
              item?.question ===
              "How many hours per day did you use a social media platform in the past 30 days during weekdays? (if you did not use social media, enter 0)"
          )?.answer || "NA",

        CC:
          row?.questionnaireResponse?.response?.find(
            (item) =>
              item?.question ===
              "How many hours per day did you use a social media platform in the past 30 days during weekends? (if you did not use social media, enter 0)"
          )?.answer || "NA",

        CD:
          row?.questionnaireResponse?.response?.find(
            (item) =>
              item?.question ===
              "What was the single most frequently used social media (e.g., Instagram, X (Twitter), Facebook) content type during the past 30 days?"
          )?.answer || "NA",


      
          CE:
          row?.questionnaireResponse?.response?.find(
            (item) =>
              item?.question ===
              "How many times you consumed fruits? [In the Past 7 Days]"
          )?.answer || "NA",
          
          CF:
          row?.questionnaireResponse?.response?.find(
            (item) =>
              item?.question ===
              "How many times you consumed vegetables? [In the Past 7 Days]"
          )?.answer || "NA",
          
          
          CG:
          row?.questionnaireResponse?.response?.find(
            (item) =>
              item?.question ===
              "How many times you consumed milk? [In the Past 7 Days]"
          )?.answer || "NA",
          
          CH:
          row?.questionnaireResponse?.response?.find(
            (item) =>
              item?.question ===
              "How many times you consumed Proteins (Meat, poultry, fish,legumes)?[In the Past 7 Days]"
          )?.answer || "NA",
          
          CI:
          row?.questionnaireResponse?.response?.find(
            (item) =>
              item?.question ===
              "How many times you ate breakfast? [In the Past 7 Days]"
          )?.answer || "NA",
          
          CJ:
          row?.questionnaireResponse?.response?.find(
            (item) =>
              item?.question ===
              "How many times you consumed energy drinks? [In the Past 7 Days]"
          )?.answer || "NA",
          
          
          CK:
          row?.questionnaireResponse?.response?.find(
            (item) =>
              item?.question ===
              "How many times you consumed sweetened beverages(juices, carbonateddrinks, …etc.)? [In the Past 7 Days]"
          )?.answer || "NA",
          
          
          CL:
          row?.questionnaireResponse?.response?.find(
            (item) =>
              item?.question ===
              "How many times you consumed fast food? [In the Past 7 Days]"
          )?.answer || "NA",
          
          

          CM:
          row?.questionnaireResponse?.response?.find(
            (item) =>
              item?.question ===
              "How many times you consumed snacks? [In the Past 7 Days]"
          )?.answer || "NA",


          CN:
          row?.questionnaireResponse?.response?.find(
            (item) =>
              item?.question ===
              "How many times you consumed grains (rice, wheat, …etc.)?[In the Past 7Days]"
          )?.answer || "NA",
          
          

          CO:
          row?.questionnaireResponse?.response?.find(
            (item) =>
              item?.question ===
              "Who is the primary food shopper(s) in your household? The primary food shopper(s) is the person(s) who does the grocery shopping most often"
          )?.answer || "NA",   
          
          


          CP:
          row?.questionnaireResponse?.response?.find(
            (item) =>
              item?.question ===
              "What was the single most frequently used food source in the past 30 days?"
          )?.answer || "NA", 
          
          

          CQ:
          row?.questionnaireResponse?.response?.find(
            (item) =>
              item?.question ===
              "In the past 30 days, on how many days did the primary food shopper(s) shop/purchase food? [0-30] Days"
          )?.answer || "NA", 
          
          
          CR:
          row?.questionnaireResponse?.response?.find(
            (item) =>
              item?.question ===
              "What was the amount in AED spent on food purchase in the past 30 days?"
          )?.answer || "NA", 
          
          
          CS:
          row?.questionnaireResponse?.response?.find(
            (item) =>
              item?.question ===
              "Which factors influence your food purchase decisions?"
          )?.answer || "NA", 
          
          
          CT:
          row?.questionnaireResponse?.response?.find(
            (item) =>
              item?.question ===
              "What is your preferred payment method?"
          )?.answer || "NA", 
          
          
          CU:
          row?.questionnaireResponse?.response?.find(
            (item) =>
              item?.question ===
              "I prefer fresh foods"
          )?.answer || "NA", 
          
          
          CV:
          row?.questionnaireResponse?.response?.find(
            (item) =>
              item?.question ===
              "I prefer online food shopping/purchase."
          )?.answer || "NA", 
          
          

          CW:
          row?.questionnaireResponse?.response?.find(
            (item) =>
              item?.question ===
              "I avoid wasting food."
          )?.answer || "NA", 
          
          

          CX:
          row?.questionnaireResponse?.response?.find(
            (item) =>
              item?.question ===
              "I avoid storing/stacking food."
          )?.answer || "NA", 
          
          
          CY:
          row?.questionnaireResponse?.response?.find(
            (item) =>
              item?.question ===
              "I enjoy trying new foods."
          )?.answer || "NA", 
          
          
          CZ:
          row?.questionnaireResponse?.response?.find(
            (item) =>
              item?.question ===
              "What is your opinion about organic foods?"
          )?.answer || "NA", 
          
          

          DA:
          row?.questionnaireResponse?.response?.find(
            (item) =>
              item?.question ===
              "What is your opinion about locally sourced foods?"
          )?.answer || "NA", 
          
          

          DB:
          row?.questionnaireResponse?.response?.find(
            (item) =>
              item?.question ===
              "What is your opinion about sustainable foods?"
          )?.answer || "NA", 
          
          
          DC:
          row?.questionnaireResponse?.response?.find(
            (item) =>
              item?.question ===
              "How many hours per day did you use your smartphone for personal reasons (not for work) in the past 30 days during weekdays? (if you did not use smartphone, enter 0)"
          )?.answer || "NA", 
          
          
          DD:
          row?.questionnaireResponse?.response?.find(
            (item) =>
              item?.question ===
              "What was the single most frequently used smartphone content type during the past 30 days?"
          )?.answer || "NA",   
          
       
          

          DE:
          row?.questionnaireResponse?.response?.find(
            (item) =>
              item?.question ===
              "How many hours per day did you use your smartphone for personal reasons (not for work) in the past 30 days during weekends? (if you did not use smartphone, enter 0)"
          )?.answer || "NA",   
          
          


          DF:
          row?.questionnaireResponse?.response?.find(
            (item) =>
              item?.question ===
              "How many hours per day did you use a social media platform in the past 30 days during weekdays? (if you did not use social media, enter 0)"
          )?.answer || "NA",   
          
          

          DG:
          row?.questionnaireResponse?.response?.find(
            (item) =>
              item?.question ===
              "How many hours per day did you use a social media platform in the past 30 days during weekends? (if you did not use social media, enter 0)"
          )?.answer || "NA",   
          
          

          DH:
          row?.questionnaireResponse?.response?.find(
            (item) =>
              item?.question ===
              "What was the single most frequently used social media (e.g., Instagram,X (Twitter), Facebook) content type during the past 30 days?"
          )?.answer || "NA", 
          
          

          DI:
          row?.questionnaireResponse?.response?.find(
            (item) =>
              item?.question ===
              "How many times you consumed fruits? [In the Past 7 Days]"
          )?.answer || "NA", 
          DJ:
          row?.questionnaireResponse?.response?.find(
            (item) =>
              item?.question ===
              "How many times you consumed vegetables? [In the Past 7 Days]"
          )?.answer || "NA", 
          
          DK:
          row?.questionnaireResponse?.response?.find(
            (item) =>
              item?.question ===
              "How many times you consumed milk? [In the Past 7 Days]"
          )?.answer || "NA",    

          DL:
          row?.questionnaireResponse?.response?.find(
            (item) =>
              item?.question ===
              "How many times you consumed Proteins (Meat, poultry, fish,legumes)?[In the Past 7 Days]"
          )?.answer || "NA", 
          
          DM:
          row?.questionnaireResponse?.response?.find(
            (item) =>
              item?.question ===
              "How many times you ate breakfast? [In the Past 7 Days]"
          )?.answer || "NA", 
          
          DN:
          row?.questionnaireResponse?.response?.find(
            (item) =>
              item?.question ===
              "How many times you consumed energy drinks? [In the Past 7 Days]"
          )?.answer || "NA",     

          DO:
          row?.questionnaireResponse?.response?.find(
            (item) =>
              item?.question ===
              "How many times you consumed sweetened beverages(juices, carbonateddrinks, …etc.)? [In the Past 7 Days]"
          )?.answer || "NA", 
          
          DP:
          row?.questionnaireResponse?.response?.find(
            (item) =>
              item?.question ===
              "How many times you consumed fast food? [In the Past 7 Days]"
          )?.answer || "NA", 
          
          DQ:
          row?.questionnaireResponse?.response?.find(
            (item) =>
              item?.question ===
              "How many times you consumed snacks? [In the Past 7 Days]"
          )?.answer || "NA",   

          DR:
          row?.questionnaireResponse?.response?.find(
            (item) =>
              item?.question ===
              "How many times you consumed grains (rice, wheat, …etc.)?[In the Past 7Days]"
          )?.answer || "NA",   
          
      });
    });

    const finalData = [
      { A: "", B: "", C: "", D: "", E: "", F: "ADAFSA REPORTS SUMMARY" },

      ...TimeStampp,
      {},

      ...HorizontalTable,
    ];

    const wb = XLSX.utils.book_new();

    const sheet = XLSX.utils.json_to_sheet(finalData, {
      skipHeader: true,
    });

    const dataInfo = {
      titleCell: "F1",
      titleRange: "A1:I2",
      timeStamp: "J2",
      tableHeader: "A4:N4",
      tbodyRange: `A5:N${finalData.length}`,
      serialNum: `A5:A${finalData.length}`, 
      visitNum: `I5:I${finalData.length}`,
    };

    XLSX.utils.book_append_sheet(wb, sheet, "ADAFSA");

    const workbookBlob = workbook2blob(wb);

    const headerIndexes = [];
    finalData.forEach((data, index) =>
      data["A"] === "Serial No" ? headerIndexes.push(index) : null
    );

    return addStyles(workbookBlob, dataInfo);
  });

  const createDownloadData = useCallback(() => {
    handleExport().then((url) => {
      const downloadAnchorNode = document.createElement("a");
      downloadAnchorNode.setAttribute("href", url);
      downloadAnchorNode.setAttribute("download", "ADAFSA");
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
    });
  }, [handleExport]);
  return (
    <div dir={lang === "ar" ? "rtl" : ""}>
      <Box>
        <Paper
          sx={{ backgroundColor: "white" }}
          elevation={3}
          style={{ overflowY: "hidden", marginBottom: "10px" }}
        >
          <Box
            display={"flex"}
            padding={"10px 20px"}
            style={{ borderBottom: "1.5px solid #CECECE" }}
            justifyContent={"space-between"}
          >
            <Typography fontWeight={"bold"} fontSize={"1.3rem"}>
              {t("Household list")}
            </Typography>

            <React.Fragment>
              <Box display={"flex"} gap={"1rem"}>
                <Button
                  variant="outlined"
                  onClick={() => {
                    createDownloadData();
                  }}
                >
                  {t("Export")}
                </Button>

                <Button variant="outlined" onClick={handleReset}>
                  {t("Refresh / Reset")}
                </Button>
                <Button variant="outlined" onClick={handleClickOpen}>
                  {t("open filters dialog")}
                </Button>
              </Box>
              <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                maxWidth={"sm"}
                fullWidth
              >
                <DialogTitle id="alert-dialog-title">
                  {t("Filters")}
                </DialogTitle>
                <DialogContent style={{ marginTop: "1rem" }}>
                  <Grid
                    container
                    rowSpacing={"1rem"}
                    columnSpacing={"1rem"}
                    paddingTop={"0.5rem"}
                  >
                    <Grid item xs={12} md={6}>
                      <TextField
                        size="small"
                        value={location}
                        onChange={(e) => {
                          setLocation(e.target.value);
                        }}
                        fullWidth
                        label={t("Location")}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth size="small">
                        <InputLabel>{t("Gender")}</InputLabel>
                        <Select
                          value={genderid}
                          onChange={(e) => {
                            setGender(e.target.value);
                          }}
                          fullWidth
                          size="small"
                          label={t("Gender")}
                        >
                          <MenuItem value={""}>{t("Select")}</MenuItem>
                          {appState?.types?.genderTypes?.map((city) => (
                            <MenuItem value={city?.genderId}>
                              {t(`${city?.genderName}`)}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    {appState?.loginInfo?.role === "Interviewer" &&
                    appState?.loginInfo?.role === "Interviewer" ? (
                      <></>
                    ) : (
                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth size="small">
                          <Autocomplete
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
                        </FormControl>
                      </Grid>
                    )}
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth size="small">
                        <InputLabel>{t("Pregnant")}</InputLabel>
                        <Select
                          value={pregnancy}
                          onChange={(e) => {
                            setPregnant(e.target.value);
                          }}
                          fullWidth
                          size="small"
                          label={t("Pregnant")}
                        >
                          <MenuItem value={""}>{t("Select")}</MenuItem>
                          <MenuItem value={"1"}>{t("Yes")}</MenuItem>
                          <MenuItem value={"0"}>{t("No")}</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth size="small">
                        <InputLabel>{t("Breast Feeding")}</InputLabel>
                        <Select
                          value={breastfeeding}
                          onChange={(e) => {
                            setBreastFeeding(e.target.value);
                          }}
                          fullWidth
                          size="small"
                          label={t("Breast Feeding")}
                        >
                          <MenuItem value={""}>{t("Select")}</MenuItem>
                          <MenuItem value={"1"}>{t("Yes")}</MenuItem>
                          <MenuItem value={"0"}>{t("No")}</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth size="small">
                        <InputLabel>{t("Age Range")}</InputLabel>
                        <Select
                          value={agerange}
                          onChange={(e) => {
                            setAge(e.target.value);
                          }}
                          fullWidth
                          size="small"
                          label={t("Age Range")}
                        >
                          <MenuItem value={""}>{t("Select")}</MenuItem>
                          <MenuItem value={"1-10"}>1-10</MenuItem>
                          <MenuItem value={"11-20"}>11-20</MenuItem>
                          <MenuItem value={"21-30"}>21-30</MenuItem>
                          <MenuItem value={"31-40"}>31-40</MenuItem>
                          <MenuItem value={"41-50"}>41-50</MenuItem>
                          <MenuItem value={"51-60"}>51-60</MenuItem>
                          <MenuItem value={"61-70"}>61-70</MenuItem>
                          <MenuItem value={"71-80"}>71-80</MenuItem>
                          <MenuItem value={"81-90"}>81-90</MenuItem>
                          <MenuItem value={"91-100"}>91-100</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth size="small">
                        <InputLabel>{t("Weight Range")}</InputLabel>
                        <Select
                          value={weightrange}
                          onChange={(e) => {
                            setWeight(e.target.value);
                          }}
                          fullWidth
                          size="small"
                          label={t("Weight Range")}
                        >
                          <MenuItem value={""}>{t("Select")}</MenuItem>
                          <MenuItem value={"25-50"}>25-50</MenuItem>
                          <MenuItem value={" 51-75"}>51-75</MenuItem>
                          <MenuItem value={"76-100"}>76-100</MenuItem>
                          <MenuItem value={"101-125"}>101-125</MenuItem>
                          <MenuItem value={"126-150"}>126-150</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth size="small">
                        <InputLabel>{t("Height Range")}</InputLabel>
                        <Select
                          value={heightrange}
                          onChange={(e) => {
                            setHeight(e.target.value);
                          }}
                          fullWidth
                          size="small"
                          label={t("Height Range")}
                        >
                          <MenuItem value={""}>{t("Select")}</MenuItem>
                          <MenuItem value={"60-100"}>60-100</MenuItem>
                          <MenuItem value={" 101-140"}>101-140</MenuItem>
                          <MenuItem value={"141-180"}>141-180</MenuItem>
                          <MenuItem value={"180-220"}>180-220</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth size="small">
                        <InputLabel>{t("BMI Range")}</InputLabel>
                        <Select
                          value={bmirange}
                          onChange={(e) => {
                            setBmi(e.target.value);
                          }}
                          fullWidth
                          size="small"
                          label={t("BMI Range")}
                        >
                          <MenuItem value={""}>{t("Select")}</MenuItem>
                          <MenuItem value={"18-25"}>18-25</MenuItem>
                          <MenuItem value={"26-30"}>26-30</MenuItem>
                          <MenuItem value={"31-40"}>31-40</MenuItem>
                          <MenuItem value={"41-50"}>41-50</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth size="small">
                        <InputLabel>{t("Visit Number")}</InputLabel>
                        <Select
                          value={visitno}
                          onChange={(e) => {
                            setVisit(e.target.value);
                          }}
                          fullWidth
                          size="small"
                          label={t("Visit Number")}
                        >
                          <MenuItem value={""}>{t("Select")}</MenuItem>
                          <MenuItem value={1}>{t("Visit Number 1")}</MenuItem>
                          <MenuItem value={2}>{t("Visit Number 2")}</MenuItem>
                          <MenuItem value={3}>{t("Visit Number 3")}</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          size="small"
                          sx={{ width: "16.5rem" }}
                          value={startDatee}
                          disableFuture
                          format="DD/MM/YYYY"
                          label={t("Start Date")}
                          onChange={(newValue) => {
                            if (newValue) {
                              setStartDate(newValue);
                            } else {
                              setStartDate(null);
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
                              error={false}
                            />
                          )}
                        />
                      </LocalizationProvider>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          size="small"
                          sx={{ width: "16.5rem" }}
                          value={endDatee}
                          format="DD/MM/YYYY"
                          disableFuture
                          label={t("End Date")}
                          onChange={(newValue) => {
                            if (newValue) {
                              setEndDate(newValue);
                            } else {
                              setEndDate(null);
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
                              error={false}
                            />
                          )}
                        />
                      </LocalizationProvider>
                    </Grid>
                  </Grid>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose}>{t("Cancel")}</Button>
                  <Button onClick={handleSubmit} autoFocus>
                    {t("Submit")}
                  </Button>
                </DialogActions>
              </Dialog>
            </React.Fragment>
          </Box>
          <TableContainer style={{ maxHeight: "calc(100vh - 200px)" }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow style={{ whiteSpace: "nowrap" }}>
                  <TableCell
                    align={"center"}
                    style={{ fontWeight: "bold", fontSize: "1rem" }}
                  >
                    {t("HouseHold ID")}
                  </TableCell>
                  <TableCell
                    align={"center"}
                    style={{ fontWeight: "bold", fontSize: "1rem" }}
                  >
                    {t("Family code")}
                  </TableCell>
                  <TableCell
                    align={lang === "ar" ? "right" : "left"}
                    style={{ fontWeight: "bold", fontSize: "1rem" }}
                  >
                    {t("City Name")}
                  </TableCell>
                  <TableCell
                    align={lang === "ar" ? "right" : "left"}
                    style={{ fontWeight: "bold", fontSize: "1rem" }}
                  >
                    {t("Phone number")}
                  </TableCell>
                  <TableCell
                    align={"center"}
                    style={{ fontWeight: "bold", fontSize: "1rem" }}
                  >
                    {t("House number")}
                  </TableCell>
                  <TableCell
                    align={lang === "ar" ? "right" : "left"}
                    style={{ fontWeight: "bold", fontSize: "1rem" }}
                  >
                    {t("Building name")}
                  </TableCell>
                  <TableCell
                    align={"center"}
                    style={{ fontWeight: "bold", fontSize: "1rem" }}
                  >
                    {t("View Participants")}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.map((user, index) => (
                  <Row user={user} key={index} />
                ))}

                {!data?.length && (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      align="center"
                      style={{
                        padding: "20px",
                        fontWeight: "bold",
                        fontSize: "1.1rem",
                      }}
                    >
                      {t("No data found")}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <CacheProvider value={cacheRtl}>
            <ThemeProvider theme={lang === "ar" ? themeRtl : themeLtr}>
              <div
                dir={lang === "ar" ? "rtl" : ""}
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "row-reverse",
                  gap: "20px",
                }}
              >
                <TablePagination
                  rowsPerPageOptions={[10, 15, 25]}
                  component="div"
                  sx={{
                    ".MuiInputBase-root": {
                      marginTop: "-14px",
                      marginRight: "5px",
                    },

                    ".MuiTablePagination-toolbar": {
                      color: "rgb(41, 39, 39)",
                      height: "35px",
                    },
                    ".MuiBox-root": {
                      color: "black",
                      "& .MuiSvgIcon-root": {
                        color: "black",
                      },
                    },
                    ".MuiTablePagination-actions": {
                      marginTop: "-12px",
                      marginLeft: "2px",
                    },
                    marginTop: "10px",
                    marginBottom: "-10px",
                  }}
                  count={response?.totalCount}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  labelRowsPerPage={t("Rows Per Page")}
                  labelDisplayedRows={({ from, to, count }) =>
                    lang === "ar"
                      ? `${to}-${from} من ${count}`
                      : `${from}-${to} of ${count}`
                  }
                />
              </div>
            </ThemeProvider>
          </CacheProvider>
        </Paper>
      </Box>
    </div>
  );
};

export default Index;
