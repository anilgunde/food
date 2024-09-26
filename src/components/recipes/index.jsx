import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  InputBase,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  ThemeProvider,
  Tooltip,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { Delete, Edit } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "../../api/axios";
import { toast } from "react-toastify";
import {
  InsertFoodImageObj,
  setApiErrorStatusCode,
  setLoading,
  setRecipeDetails,
  setRecipeFoodImage,
} from "../../store/slices/app.tsx";
import { useDispatch, useSelector } from "react-redux";
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

const Recipe = () => {
  const navigate = useNavigate();
  const lang = sessionStorage.getItem("lang");
  const { t } = useTranslation();
  const [recipe, setRecipe] = useState([]);
  const [response, setResponse] = useState([]);
  const appState = useSelector((state) => state.app);
  const [page, setPage] = useState(() => {
    return parseInt(sessionStorage.getItem("receipsPageNumber"), 10) || 0;
  });

  const [rowsPerPage, setRowsPerPage] = useState(() => {
    const savedRowsPerPage = sessionStorage.getItem("receipsRowsPerPage");
    return savedRowsPerPage ? +savedRowsPerPage : 25;
  });
  const dispatch = useDispatch();
  const call = () => {
    dispatch(setLoading(true));
    axios
      .get("/api/food/recipes", {
        headers: { authorization: `Bearer ${appState?.accessToken}` },
        params: { pageNumber: page + 1, pageSize: rowsPerPage },
      })
      .then((res) => {
        dispatch(setLoading(false));
        setRecipe(res?.data?.data?.items);
        setResponse(res?.data?.data);
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

  useEffect(() => {
    call();
  }, [page, rowsPerPage]);

  useEffect(() => {
    sessionStorage.setItem("receipsPageNumber", page);
  }, [page]);

  const handleEdit = (id) => {
    dispatch(setLoading(true));
    axios
      .get(`/api/food/recipe/${id}  `, {
        headers: { authorization: `Bearer ${appState?.accessToken}` },
      })
      .then((res) => {
        const vals2 = Object.fromEntries(
          Object.entries(res?.data?.data).filter(
            ([key, value]) =>
              key !== "requestedBy" &&
              key !== "status" &&
              key !== "FoodImageId" &&
              key !== "approvedBy"
          )
        );

        dispatch(setRecipeDetails({ ...vals2, approveRequest: false }));
        axios
          .get(`/api/food/recipe/image/${res?.data?.data?.FoodImageId}`, {
            headers: { authorization: `Bearer ${appState?.accessToken}` },
            // params: { pageNumber: page + 1, pageSize: rowsPerPage },
          })
          .then((res) => {
            dispatch(setLoading(false));
            const vals2 = Object.fromEntries(
              Object.entries(res?.data?.data).filter(
                ([key, value]) =>
                  key !== "foodRequest" && key !== "foodRequestId"
              )
            );
            dispatch(InsertFoodImageObj({ foodImage: vals2 }));
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
    navigate(`./recipeEdit?id=${id}`, page + 1);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = +event.target.value;
    setRowsPerPage(newRowsPerPage);
    setPage(0);

    sessionStorage.setItem("receipsRowsPerPage", newRowsPerPage);
  };
  return (
    <div dir={lang === "ar" ? "rtl" : ""}>
      <Paper style={{ overflowY: "hidden", marginBottom: "10px" }}>
        <div dir={lang === "ar" ? "rtl" : ""}>
          <Box
            fontWeight={"bold"}
            fontSize={"1.3rem"}
            padding={"10px 20px"}
            style={{ borderBottom: "1.5px solid #CECECE" }}
          >
            {t("Recipe list")}
          </Box>
          <TableContainer style={{ maxHeight: "calc(100vh - 200px)" }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow style={{ whiteSpace: "nowrap" }}>
                  <TableCell
                    align={"center"}
                    style={{ fontWeight: "bold", fontSize: "1rem" }}
                  >
                    {t("Recipe ID")}
                  </TableCell>
                  <TableCell
                    align={lang === "ar" ? "right" : "left"}
                    style={{ fontWeight: "bold", fontSize: "1rem" }}
                  >
                    {t("Food name")}
                  </TableCell>
                  <TableCell
                    align={lang === "ar" ? "right" : "left"}
                    style={{ fontWeight: "bold", fontSize: "1rem" }}
                  >
                    {t("Status")}
                  </TableCell>
                  <TableCell
                    align={"center"}
                    style={{ fontWeight: "bold", fontSize: "1rem" }}
                  >
                    {t("Weight")}
                  </TableCell>

                  <TableCell
                    align={"center"}
                    style={{ fontWeight: "bold", fontSize: "1rem" }}
                  >
                    {t("Requested by")}
                  </TableCell>
                  <TableCell
                    align={"center"}
                    style={{ fontWeight: "bold", fontSize: "1rem" }}
                  >
                    {t("No of Ingredients")}
                  </TableCell>
                  <TableCell
                    align={"center"}
                    style={{ fontWeight: "bold", fontSize: "1rem" }}
                  >
                    {t("No of Nutrients")}
                  </TableCell>
                  <TableCell
                    align={lang === "ar" ? "right" : "left"}
                    style={{ fontWeight: "bold", fontSize: "1rem" }}
                  >
                    {t("Edit")}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recipe.map((recipe, index) => (
                  <TableRow key={index}>
                    <TableCell align={"center"}>{recipe?.id}</TableCell>
                    <TableCell align={lang === "ar" ? "right" : "left"}>
                      {recipe?.foodName}
                    </TableCell>
                    <TableCell align={lang === "ar" ? "right" : "left"}>
                      {recipe?.status}
                    </TableCell>
                    <TableCell align={"center"}>{recipe?.weight}</TableCell>
                    <TableCell align={"center"}>
                      {recipe?.requestedBy}
                    </TableCell>
                    <TableCell align={"center"}>
                      {recipe?.Ingredients?.length}
                    </TableCell>
                    <TableCell align={"center"}>
                      {recipe?.Nutrients?.length}
                    </TableCell>
                    <TableCell align={lang === "ar" ? "right" : "left"}>
                      <IconButton
                        size="small"
                        onClick={() => {
                          handleEdit(recipe?.id);
                        }}
                      >
                        <Tooltip title={t("Edit")}>
                          <Edit />
                        </Tooltip>
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}

                {!recipe?.length && (
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
              <div dir={lang === "ar" ? "rtl" : ""}>
                <TablePagination
                  rowsPerPageOptions={[10, 25, 100]}
                  component="div"
                  size="small"
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
                  count={response?.totalCount || 10}
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
        </div>
      </Paper>
    </div>
  );
};

export default Recipe;
