import {
  Box,
  Button,
  Modal,
  TextField,
  ThemeProvider,
  styled,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import MuiTableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import axios from "../../api/axios";
import { useDispatch, useSelector } from "react-redux";
import Edit from "@mui/icons-material/Edit";
import Delete from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import { setApiErrorStatusCode } from "../../store/slices/app.tsx";
import { useTranslation } from "react-i18next";
import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { createTheme } from "@mui/material";

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
const TableCell = styled((props) => <MuiTableCell {...props} />)(
  ({ theme }) => ({
    borderBottom: "1.5px solid #CECECE",
  })
);

const Roles = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const appState = useSelector((state) => state?.app);
  const [searchValue, setSearchValue] = useState("");
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const call = () => {
    axios
      .get("/api/role/getRoles", {
        headers: { authorization: `Bearer ${appState?.accessToken}` },
      })
      .then((res) => {
        setUsers(res?.data?.data);
      })
      .catch((err) => {
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
  };

  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    call();
  }, [open]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleAddRole = () => {
    if (!searchValue) {
      toast.error(t("Please Enter Role Name"));
      return;
    }
    axios
      .post(
        "/api/role/addRole",
        { roleName: searchValue },
        { headers: { authorization: `Bearer ${appState?.accessToken}` } }
      )
      .then((res) => {
        if (res?.data?.isSuccess === true) {
          toast.success(t("Role Added successfully"));
          setOpen(false);
          call();
        }
      })
      .catch((err) => {
        toast.error(err?.response?.data?.Errors[0]);
      });
    setSearchValue("");
  };

  const lang = sessionStorage.getItem("lang");
  const { t } = useTranslation();

  const paginatedUsers = users.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Paper style={{ overflowY: "hidden", marginBottom: "10px" }}>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <h3 align="center">{t("Add Role")}</h3>
          <div dir={lang === "ar" ? "rtl" : ""}>
            <TextField
              size="small"
              placeholder={t("Role Name")}
              value={searchValue}
              fullWidth
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
          <Box
            align="center"
            mt={3}
            gap={2}
            display={"flex"}
            alignContent={"center"}
            justifyContent={"center"}
          >
            <Box>
              <Button
                variant="contained"
                style={{ color: "white" }}
                onClick={() => setOpen(false)}
              >
                {t("Cancel")}
              </Button>
            </Box>
            <Box>
              <Button
                variant="contained"
                style={{ color: "white" }}
                onClick={handleAddRole}
              >
                {t("Add Role")}
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
      <div dir={lang === "ar" ? "rtl" : ""}>
        <Box
          padding={"10px 20px"}
          style={{ borderBottom: "1.5px solid #CECECE" }}
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Box fontWeight={"bold"} fontSize={"1.3rem"}>
            {t("Roles list")}
          </Box>
          <Button
            variant="text"
            style={{
              color: "#3487E5",
              fontWeight: "bold",
              textTransform: "none",
              fontSize: "20px",
            }}
            onClick={() => setOpen(true)}
          >
            {t("Add Role")}
          </Button>
        </Box>
      </div>
      <div dir={lang === "ar" ? "rtl" : ""}>
        <TableContainer style={{ maxHeight: "calc(100vh - 200px)" }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow style={{ whiteSpace: "nowrap" }}>
                <TableCell
                  align="center"
                  style={{ fontWeight: "bold", fontSize: "1rem" }}
                >
                  {t("User ID")}
                </TableCell>
                <TableCell
                  align={lang === "ar" ? "right" : "left"}
                  style={{ fontWeight: "bold", fontSize: "1rem" }}
                >
                  {t("Role name")}
                </TableCell>
                <TableCell
                  align="center"
                  style={{ fontWeight: "bold", fontSize: "1rem" }}
                >
                  {t("Created by")}
                </TableCell>
                <TableCell
                  align="center"
                  style={{ fontWeight: "bold", fontSize: "1rem" }}
                >
                  {t("Updated by")}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedUsers.map((user, index) => (
                <TableRow key={index}>
                  <TableCell align="center">{user?.id}</TableCell>
                  <TableCell align={lang === "ar" ? "right" : "left"}>
                    {user?.roleName}
                  </TableCell>
                  <TableCell align="center">{user?.createdBy}</TableCell>
                  <TableCell align="center">{user?.updatedBy}</TableCell>
                </TableRow>
              ))}

              {!users.length && (
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
                  "& .MuiSvgIcon-root": { color: "black" },
                },
                ".MuiTablePagination-actions": {
                  marginTop: "-12px",
                  marginLeft: "2px",
                },
                marginTop: "10px",
                marginBottom: "-10px",
              }}
              count={users.length}
              labelRowsPerPage={t("Rows Per Page")}
              labelDisplayedRows={({ from, to, count }) =>
                lang === "ar"
                  ? `${to}-${from} من ${count}`
                  : `${from}-${to} of ${count}`
              }
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </div>
        </ThemeProvider>
      </CacheProvider>
    </Paper>
  );
};

export default Roles;
