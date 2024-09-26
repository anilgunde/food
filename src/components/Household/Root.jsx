import React, {useEffect } from "react";

import {
  Box,
  Button,
 
  IconButton,
  Paper,
  Stack,
  TextField,
  ThemeProvider,
  Tooltip,
  Typography,
  outlinedInputClasses,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import homeicon from "../../../src/assets/homeicon.svg";
import NoteAltIcon from "@mui/icons-material/NoteAlt";
import Grid from "@mui/material/Grid";
import { TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import moment from "moment/moment";
import { useState } from "react";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";
import Edit from "@mui/icons-material/Edit";
import { useDispatch, useSelector } from "react-redux";
import {
  resetHouseHolds,
  setApiErrorStatusCode,
  setCompleteClear,
  setLoading,
} from "../../store/slices/app.tsx";
import { Visibility } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { createTheme } from "@mui/material";
import { toast } from "react-toastify";

const themeRtl = createTheme({
  direction: "rtl", 
});
const themeLtr = createTheme({
  direction: "ltr", 
});

const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

function stableSort(array) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  return stabilizedThis.map((el) => el[0]);
}

function EnhancedTableHead(props) {
  const lang = sessionStorage.getItem("lang");
  const { t } = useTranslation();
  const appState = useSelector((state) => state.app);

  
  const headCells = [
    {
      id: `${t("Name of head of the family")}`,
      numeric: false,
      disablePadding: true,
    },
    
    {
      id: `${t("Family code")}`,
      numeric: true,
      disablePadding: false,
    },
    {
      id: `${t("HouseHold ID")}`,
      numeric: true,
      disablePadding: false,
    },

    {
      id: `${t("Phone number")}`,
      numeric: true,
      disablePadding: false,
    },
    {
      id: `${t("Created at")}`,
      numeric: true,
      disablePadding: false,
    },
    {
      id: `${t("Survey Status")}`,
      numeric: true,
      disablePadding: false,
    },
    {
      id: `${t("Participants")}`,
      numeric: true,
      disablePadding: false,
    },
    {
      id: `${t("View")}`,
      numeric: true,
      disablePadding: false,
    },
    {
      id: `${t("Edit")}`,
      numeric: true,
      disablePadding: false,
      display: appState?.loginInfo?.role === "Administrator" ? "none" : "flex",
    },
    {
      id: `${t("Assign")}`,
      numeric: true,
      disablePadding: false,
      display: appState?.loginInfo?.role === "Administrator" ? "none" : "flex",
    },
    {
      id: `${t("Delete")}`,
      numeric: true,
      disablePadding: false,
      display: appState?.loginInfo?.role === "Administrator" ? "none" : "flex",
    
    },
  ];
 

  return (
    <TableHead style={{ height: "45px" }}>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={lang === "ar" ? "right" : "left"}
            padding={"normal"}
            style={{
              fontSize: "1rem",
              fontWeight: "bold",
              border: "0",
              backgroundColor: "#EEEEEE",
              whiteSpace: "nowrap",
              position: "sticky",
              left: 0,
              zIndex:
                headCell?.id === `${t("Name of head of the family")}` ? 2 : 1,
            }}
            sx={
              !appState?.roleinfo?.role?.includes("Recruiter") &&
              (headCell.id === t("Edit") || headCell.id === t("Assign"))
                ? { display: "none" }
                : {} &&
              !appState?.roleinfo?.role?.includes("Administrator") &&
              (headCell.id === t("Delete"))
                ? { display: "none" }
                : {} 
            }
          > 
            {headCell.id}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

const Index = () => {
  const lang = sessionStorage.getItem("lang");

  const appState = useSelector((state) => state?.app);  
  const dispatch = useDispatch();

  
  const [page, setPage] = useState(() => {
  
    return parseInt(sessionStorage.getItem("householdPageNumber"), 10) || 0;
  });
     
  const [rowsPerPage, setRowsPerPage] = useState(() => {
    
    const savedRowsPerPage = sessionStorage.getItem("reportRowsPerPage1");
    return savedRowsPerPage ? +savedRowsPerPage : 100;
  });
  const [searchValue, setSearchValue] = useState("");
  const [data, setData] = useState([]);
  const [response, setResponse] = useState({});

  useEffect(() => {
    if (searchValue === "") {
      dispatch(setLoading(true));
    }

    const debounce = setTimeout(
      () => {
        axios
          .get("/api/household/getAllHouseholdWithparticipants", {
            headers: { authorization: `Bearer ${appState?.accessToken}` },
            params: {
              ...(searchValue && { search: searchValue }),
              pageSize: rowsPerPage,
              pageNumber: page + 1,
            },
          })
          .then((res) => {
            dispatch(setLoading(false));
            setData(res?.data?.data?.items);
            setResponse(res?.data?.data);
          })
          .catch((err) => {
            dispatch(setLoading(false));
            dispatch(setApiErrorStatusCode(err?.response?.status));
            toast.error(err?.response?.data?.Errors[0]);
          });
      },
      searchValue === "" ? 10 : 500
    );

    return () => {
      clearTimeout(debounce);
    };
  }, [searchValue, rowsPerPage, page, dispatch, appState?.accessToken]);

  const [selected, setSelected] = React.useState([]);

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = data?.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };
  const navigate = useNavigate();
  const handleClick = (event, id) => {
    navigate(`/household/viewHouseHold?id=${id}&page=edit`);
  };

  useEffect(() => {
    
    sessionStorage.setItem("householdPageNumber", page);
  }, [page]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleViewClick = (event, id) => {
    navigate(`/household/viewHouseHold?id=${id}&page=view`);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = +event.target.value;
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    sessionStorage.setItem("reportRowsPerPage1", newRowsPerPage);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    
    navigate("/household/addHousehold");
    dispatch(resetHouseHolds());
    dispatch(setCompleteClear([]));
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [age, setAge] = React.useState("");
  const [fromdate, setFromdate] = React.useState("");

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  const [displaytime, setDisplaytime] = useState(null);

  const handleTimeChange = (newTime) => {
    
    setDisplaytime(moment(newTime["$d"]).format("hh:mm:ss a"));
  };
  const { t } = useTranslation();


 



  const [open1, setOpen1] = React.useState(false);
  const [delectid, setDelectid] = React.useState('');
  const handleClickOpen1 = (id) => {
    setOpen1(true);
    setDelectid(id)
    
  };

  const handleClose1 = () => {
    setOpen1(false);
  };

  const handleDelete = (id) => {
    dispatch(setLoading(true));
    axios
      .delete(`/api/household/deleteHouseholdWithparticipants/${delectid}`, {
        headers: { authorization: `Bearer ${appState?.accessToken}` },
      })
      .then((res) => {
        dispatch(setLoading(false));
        if (res?.data?.isSuccess === true) {
          setOpen1(false);
          toast(t("Record deleted successfully"), {
            position: "top-center",
            autoClose: 4000,
            hideProgressBar: false,
            pauseOnHover: true,
            draggable: true,
            type: "success",
          });
          axios
          .get("/api/household/getAllHouseholdWithparticipants", {
            headers: { authorization: `Bearer ${appState?.accessToken}` },
            params: {
              ...(searchValue && { search: searchValue }),
              pageSize: rowsPerPage,
              pageNumber: page + 1,
            },
          })
          .then((res) => {
            dispatch(setLoading(false));
            setData(res?.data?.data?.items);
            setResponse(res?.data?.data);
          })
          .catch((err) => {
            dispatch(setLoading(false));
            dispatch(setApiErrorStatusCode(err?.response?.status));
            toast.error(err?.response?.data?.Errors[0]);
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
  return (
    <>
       <React.Fragment>
      
      <Dialog
        open={open1}
        onClose={handleClose1}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
       
        <DialogContent>
         <Typography variant="h5" >{t('Do you  want to  Delete Entire HouseHould?')}</Typography>
        </DialogContent>
       
         <Box p={3} display={'flex'} alignContent={'center'} justifyContent={'center'} flexDirection={'row'} gap={3}>
         <Button variant="contained" size="small" onClick={handleClose1}>{t('NO')}</Button>
          <Button variant="contained" size="small" onClick={handleDelete} autoFocus>
            {t('YES')}
          </Button>
         </Box>
        
      </Dialog>
    </React.Fragment>
      <Box p={3}>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle
            id="alert-dialog-title"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#45AEAE",
              color: "white",
            }}
          >
            {"Schedule Interview"}
          </DialogTitle>
          <Box>
            <DialogContent>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={12} lg={4} md={4}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="demo-select-small-label">
                      Occupation
                    </InputLabel>
                    <Select
                      labelId="demo-select-small-label"
                      id="demo-select-small"
                      value={age}
                      label="Occupation"
                      onChange={handleChange}
                    >
                      <MenuItem value={"age"}>Age</MenuItem>
                      <MenuItem value={"Education"}>Education</MenuItem>
                      <MenuItem value={"Gender"}>Gender</MenuItem>
                      <MenuItem value={"Region"}>Region</MenuItem>
                      <MenuItem value={"Marital status"}>
                        Marital status
                      </MenuItem>
                    </Select>
                  </FormControl>
                  <Box pt={1}>
                    {" "}
                    <Typography
                      height={"33px"}
                      display={"flex"}
                      justifyContent={"center"}
                      alignItems={"center"}
                      backgroundColor={"lightgrey"}
                    >
                      {age}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={12} lg={4} md={4}>
                  <FormControl fullWidth>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        size="small"
                        
                        format="DD/MM/YYYY"
                        fullWidth
                        style={{ width: "100%" }}
                        onChange={(newValue) => {
                          if (newValue) {
                            setFromdate(
                              moment(newValue["$d"])?.format("YYYY-MM-DD")
                            );
                          } else {
                            setFromdate("");
                          }
                        }}
                        slotProps={{ textField: { size: "small" } }}
                        renderInput={(params) => (
                          <TextField
                            fullWidth
                            style={{ width: "100%" }}
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
                  </FormControl>
                  <Box pt={1}>
                    {" "}
                    <Typography
                     
                      height={"33px"}
                      display={"flex"}
                      justifyContent={"center"}
                      alignItems={"center"}
                      backgroundColor={"lightgrey"}
                    >
                      {moment(fromdate).format("DD-MM-YYYY")}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={12} lg={4} md={4}>
                  <FormControl fullWidth>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <TimePicker
                       
                        timeSteps={{ hours: 1, minutes: 1, seconds: 1 }}
                        fullWidth
                        style={{ width: "100%" }}
                        slotProps={{
                          textField: {
                            sx: {
                              

                              [`.${outlinedInputClasses.root}`]: {
                                height: 40,
                                width: 150,
                              },

                              "& .MuiInputLabel-root": { lineHeight: 1 },
                            },
                          },
                        }}
                        renderInput={(params) => (
                          <TextField
                            fullWidth
                            style={{ width: "100%" }}
                            sx={{
                              "& .MuiInputBase-input": {
                                height: "10px",
                              },
                            }}
                            {...params}
                          />
                        )}
                        value={displaytime}
                        onChange={handleTimeChange}
                      />
                    </LocalizationProvider>
                  </FormControl>
                  <Box pt={1}>
                    {" "}
                    <Typography
                      height={"33px"}
                      display={"flex"}
                      justifyContent={"center"}
                      alignItems={"center"}
                      backgroundColor={"lightgrey"}
                    >
                      {displaytime}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
          </Box>

          <Box
            pt={1}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
            pb={1}
          >
            <Button
              variant="contained"
              style={{ color: "white", width: "9rem" }}
            >
              Confirm
            </Button>
          </Box>
        </Dialog>
      </Box>

      <Box marginTop={"-3rem"}>
        <Paper
          sx={{ backgroundColor: "white", border: "none", borderRadius: "0%" }}
          elevation={1}
          style={{ overflowY: "hidden", marginBottom: "10px" }}
        >
          <div dir={lang === "ar" ? "rtl" : ""}>
            <Stack
              p={1}
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
              alignItems={"center"}
              flexWrap={"wrap"}
            >
              <Box
                display={"flex"}
                pl={2}
                flexDirection={"row"}
                gap={1}
                alignItems={"center"}
                justifyContent={"flex-start"}
              >
                <Box>
                  <img src={homeicon} alt="icon" width={"28px"} />
                </Box>
                <Box>
                  <Typography
                    style={{
                      color: "#1D2420",
                      fontWeight: "bold",
                      fontSize: "1.3rem",
                    }}
                    pt={0.5}
                  >
                    {t("List of all households")} {response?.totalCount || 10}
                  </Typography>
                </Box>
              </Box>

              <Box>
                <Box
                  flexDirection={"row"}
                  gap={2}
                  display={"flex"}
                  alignItems={"center"}
                  justifyContent={"flex-start"}
                >
                  
                  <Box display={"flex"} alignItems={"center"}>
                    <TextField
                      size="small"
                      placeholder={t("Search...")}
                      value={searchValue}
                      onChange={(e) => {
                        setSearchValue(e?.target?.value);
                      }}
                    />
                    <Button
                      variant="text"
                      onClick={handleClickOpen}
                      style={{
                        color: "#3487E5",
                        fontWeight: "bold",
                        textTransform: "none",
                        fontSize: "20px",
                      }}
                      pt={0.5}
                      sx={
                        !appState?.roleinfo?.role?.includes("Recruiter")
                          ? { display: "none" }
                          : { display: "block" }
                      }
                    >
                      {t("Add HouseHold")}
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Stack>
          </div>

          <Stack
            flexDirection={{ md: "row", sm: "column" }}
            justifyContent={"space-between"}
            display={"flex"}
            alignItems={"center"}
            
            p={1.5}
          >
            <Box sx={{ width: "100%" }}>
              <div dir={lang === "ar" ? "rtl" : ""}>
                <TableContainer style={{ maxHeight: "calc(100vh - 200px)" }}>
                  <Table
                    sx={{ minWidth: 750 }}
                    aria-labelledby="tableTitle"
                    
                    stickyHeader
                    size="small"
                  >
                    <EnhancedTableHead
                   
                    />
                    <TableBody>
                      {data.map((row, index) => (
                        <TableRow
                          hover
                         
                          role="checkbox"
                          
                          tabIndex={-1}
                          key={row.householdId}
                         
                          sx={{
                            cursor: "pointer",
                            "&:hover": { background: "red" },
                          }}
                          style={
                            index % 2 !== 0
                              ? { backgroundColor: "#F1F4F4" }
                              : {}
                          }
                        >
                          <TableCell
                            component="th"
                            
                            scope="row"
                            
                            style={{
                              border: "0",
                              position: "sticky",
                              left: 0,
                              backgroundColor:
                                index % 2 === 0 ? "white" : "#F1F4F4",
                            }}
                            align={lang === "ar" ? "right" : "left"}
                          >
                            <span
                              style={{
                                fontSize: "0.9rem",
                                fontWeight: "bold",
                                color: "#5A6670",
                              }}
                            >
                              {row.participants[0]?.firstName} &nbsp;
                            </span>
                            <span
                              style={{
                                fontSize: "0.9rem",
                                fontWeight: "bold",
                                color: "#5A6670",
                              }}
                            >
                              {row.participants[0]?.familyName}
                            </span>
                            <Typography fontSize={"0.85rem"} color={"#1D2420"}>
                              {row?.buildingName +
                                ", " +
                                row?.streetName +
                                ", " +
                                row?.houseNumber +
                                ", " +
                                row?.cityName}
                            </Typography>
                          </TableCell>
                          
                          <TableCell align={"center"} style={{ border: "0" }}>
                            {row.familyCode}
                          </TableCell>
                          <TableCell align={"center"} style={{ border: "0" }}>
                            {row.householdId}
                          </TableCell>
                          <TableCell
                            align={lang === "ar" ? "right" : "left"}
                            style={{ border: "0" }}
                          >
                            {row.phoneNumber}
                          </TableCell>
                          <TableCell
                            align={lang === "ar" ? "right" : "left"}
                            style={{ border: "0", whiteSpace: "nowrap" }}
                          >
                            {moment(row.createdDate).format("DD-MM-YYYY")}
                          </TableCell>
                          <TableCell align={"center"} style={{ border: "0" }}>
                            {row?.status}
                          </TableCell>
                          <TableCell align={"center"} style={{ border: "0" }}>
                            {row?.participants.length}
                          </TableCell>
                          <TableCell align="left" style={{ border: "0" }}>
                            <IconButton
                              onClick={(event) =>
                                handleViewClick(event, row.householdId)
                              }
                            >
                              <Tooltip title={t("View")}>
                                <Visibility color="primary" />
                              </Tooltip>
                            </IconButton>
                          </TableCell>
                          <TableCell
                            align="left"
                            style={{ border: "0" }}
                            sx={
                              !appState?.roleinfo?.role?.includes(
                                "Recruiter"
                              ) ||
                              !appState?.roleinfo?.role?.includes("Recruiter")
                                ? { display: "none" }
                                : {}
                            }
                          >
                            <IconButton
                              onClick={(event) =>
                                handleClick(event, row.householdId)
                              }
                              disabled={
                                row.householdSurveyAssignment?.length &&
                                row.householdId !== 220887
                              }
                            >
                            
                              <Tooltip title={t("Edit")}>
                                <Edit
                                  color={
                                    row.householdSurveyAssignment?.length
                                      ? "lightgrey"
                                      : "secondary"
                                  }
                                />
                              </Tooltip>
                            </IconButton>
                          </TableCell>
                          <TableCell
                            align="left"
                            style={{ border: "0" }}
                            sx={
                              !appState?.roleinfo?.role?.includes(
                                "Recruiter"
                              ) ||
                              !appState?.roleinfo?.role?.includes("Recruiter")
                                ? { display: "none" }
                                : {}
                            }
                          >
                            <IconButton
                              onClick={(event) =>
                                navigate(
                                  `/household/assignSurvey?id=${row.householdId}`
                                )
                              }
                              disabled={
                                row.householdSurveyAssignment?.length === 3
                              }
                            >
                              <Tooltip title={t("Assign")}>
                                <NoteAltIcon />
                              </Tooltip>
                            </IconButton>
                          </TableCell>

                          <TableCell
                            align="left"
                            style={{ border: "0" }}
                          >

                          
                            <IconButton
                              // onClick={(event) =>
                              //   handleDelete(event, row.householdId)
                              // }
                              sx={
                                  !appState?.roleinfo?.role?.includes("Administrator")
                                  ? { display: "none" }
                                  : {}
                              }
                              onClick={()=>{handleClickOpen1(row.householdId)}}
                            >
                              <Tooltip title={t("Delete")}>
                                <DeleteIcon color="danger"/>
                              </Tooltip>
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                      {!data?.length && (
                        <TableRow>
                          <TableCell
                            colSpan={10}
                            align={"center"}
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
              </div>
              <CacheProvider value={cacheRtl}>
                <ThemeProvider theme={lang === "ar" ? themeRtl : themeLtr}>
                  <div dir={lang === "ar" ? "rtl" : ""}>
                    <TablePagination
                      rowsPerPageOptions={[10, 25, 100]}
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
                        marginBottom: "-20px",
                      }}
                      count={response?.totalCount || 10}
                      rowsPerPage={rowsPerPage}
                      labelRowsPerPage={t("Rows Per Page")}
                      labelDisplayedRows={({ from, to, count }) =>
                        lang === "ar"
                          ? `${to}-${from} من ${count}`
                          : `${from}-${to} of ${count}`
                      }
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                  </div>
                </ThemeProvider>
              </CacheProvider>
            
            </Box>
          </Stack>
        </Paper>
      </Box>
    </>
  );
};

export default Index;
