import {
  Box,
  Grid,
  Paper,
  Tab as MuiTab,
  Tabs,
  TextField,
  Typography,
  useMediaQuery,
  Button,
  Autocomplete,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import React, { useEffect, useState, useCallback, useRef } from "react";

import axios from "../../api/axios";
import { useDispatch, useSelector } from "react-redux";

import { setApiErrorStatusCode } from "../../store/slices/app.tsx";
import { useTheme } from "@mui/styles";

import { useTranslation } from "react-i18next";
import "jspdf-autotable";

import SearchIcon from "@mui/icons-material/Search";

import { toast } from "react-toastify";
const Foods = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const downLg = useMediaQuery(theme.breakpoints.down("md"));

  const { t } = useTranslation();

  const lang = sessionStorage.getItem("lang");

  const [searchValue, setSearchValue] = useState("");
  const [foodOptions, setFoodOptions] = useState([]);
  const [selectedFood, setSelectedFood] = useState(null);
  const [demoEdit, setDemoEdit] = useState(false);
  const handleDemoEdit = () => {
    setDemoEdit(!demoEdit);
  };
  const appState = useSelector((state) => state.app); // Adjust according to your state structure
  const debounceTimeout = useRef(null);
  const [loading, setLoading] = useState(false);
  const fetchFoodOptions = useCallback(async () => {
    if (searchValue.length >= 3) {
      setLoading(true);
      setLoading(true);
      try {
        const res = await axios.get("/api/food/search", {
          headers: { authorization: `Bearer ${appState?.accessToken}` },
          params: {
            search: searchValue,
            pageSize: 8217,
            pageNumber: 1,
          },
        });
        setFoodOptions(res.data.data.items);
      } catch (err) {
        dispatch(setApiErrorStatusCode(err?.response?.status));
        toast.error(err?.response?.data?.Errors[0]);
      } finally {
        setLoading(false);
      }
    } else {
      setFoodOptions([]);
    }
  }, [searchValue, dispatch, appState]);

  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(fetchFoodOptions, 1500);

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [searchValue, fetchFoodOptions]);
  const [fooddata, setFooddata] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedFood) {
      setFooddata(selectedFood.foodId);
    } else {
      toast.error(t("Please select a food item"));
    }
  };
  const [ndata, SetNdata] = useState([]);

  useEffect(() => {
    if (fooddata) {
      axios
        .get(`/api/food/nutritionalComponent/${fooddata}`, {
          headers: { authorization: `Bearer ${appState?.accessToken}` },
        })
        .then((nutritionresponse) => {
          SetNdata(nutritionresponse?.data?.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [appState?.accessToken, fooddata]);

  const handleQuantityChange = (e, index) => {
    const newValue = e.target.value;
    const updatedNdata = [...ndata];
    updatedNdata[index].quantity = newValue;
    SetNdata(updatedNdata);
  };
  const [isLoading, setIsLoading] = useState(false);
  const handleUpdate = async () => {
    try {
      setIsLoading(true);
      const payload = ndata.map((item) => ({
        nutrientId: item.nutrientId,
        quantity: item.quantity,
      }));
      const response = await axios.post(
        `/api/food/updateNutritionalComponent/${fooddata}`,
        payload,
        {
          headers: { authorization: `Bearer ${appState?.accessToken}` },
        }
      );
      console.log(response);
      toast.success("Data updated successfully");
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      toast.error("Failed to update data");
    }
  };
  const [key, setKey] = useState(0);
  const handleClear = () => {
    setSearchValue("");
    setSelectedFood(null);
    SetNdata([]);
    setDemoEdit(false);
    setKey((prevKey) => prevKey + 1); // Force re-render
  };
  return (
    <>
      <div dir={lang === "ar" ? "rtl" : "ltr"}>
        <Paper sx={{ mb: "1rem" }}>
          <Box
            p={5}
            display="flex"
            justifyContent="space-evenly"
            width="100%"
            //   borderBottom="1px solid #CECECE"
            //   padding="0px 10px"
            alignItems="center"
            gap={"3rem"}
          >
            <Box pl={4}>
              {" "}
              <Typography fontWeight="bold" fontSize="1.3rem">
                {t("Foods")}
              </Typography>
            </Box>
            <Box
              display="flex"
              justifyContent="flex-end"
              alignItems="flex-end"
              sx={{ width: "100vw" }}
            >
              <Box flex={1}>
                <form
                  onSubmit={handleSubmit}
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    width: "100%",
                  }}
                >
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={8} lg={8}>
                      <Autocomplete
                        size="small"
                        fullWidth
                        id="combo-box-demo"
                        value={selectedFood}
                        onInputChange={(e, v) => setSearchValue(v)}
                        getOptionLabel={(item) => item.name || ""}
                        options={foodOptions}
                        isOptionEqualToValue={(option, value) =>
                          option?.name === value?.name
                        }
                        onChange={(e, v) => setSelectedFood(v)}
                        clearOnEscape
                        loading={loading}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            size="small"
                            placeholder={t("Search")}
                            //   label={t("Search Food Item")}
                            InputProps={{
                              ...params.InputProps,
                              startAdornment: (
                                <InputAdornment position="start">
                                  <SearchIcon />
                                </InputAdornment>
                              ),
                            }}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} lg={4}>
                      <Button
                        type="submit"
                        sx={{ fontSize: "1rem" }}
                        size="medium"
                        variant="text"
                        color="primary"
                      >
                        {t("Search")}
                      </Button>
                      <Button
                        type="button"
                        sx={{ fontSize: "1rem" }}
                        size="medium"
                        variant="text"
                        color="secondary"
                        onClick={handleClear}
                      >
                        {t("CLEAR")}
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </Box>
            </Box>
          </Box>
          <Box sx={{ width: "100%" }} marginTop={"1rem"} p={2}>
            <Grid container columnSpacing={"1rem"} rowSpacing={"1.5rem"}>
              {selectedFood ? (
                <>
                  {" "}
                  {ndata?.map((nitem1, nindex1) => (
                    <Grid
                      item
                      key={nindex1}
                      xs={12}
                      sm={12}
                      md={6}
                      lg={4}
                      display={"flex"}
                      justifyContent={"space-between"}
                      alignItems={"center"}
                      width={"100%"}
                    >
                      <Typography fontWeight={"bold"}>
                        {t(nitem1?.nutrient?.name)}{" "}
                      </Typography>
                      <TextField
                        value={nitem1?.quantity}
                        onChange={(e) => handleQuantityChange(e, nindex1)}
                        size="small"
                        edit={false}
                        disabled={!demoEdit}
                        style={{ width: "50%" }}
                      />
                    </Grid>
                  ))}
                </>
              ) : (
                <></>
              )}
            </Grid>
            {ndata.length ? (
              <>
                <Box
                  pt={3}
                  display={"flex"}
                  alignContent={"center"}
                  justifyContent={"center"}
                  gap={"20px"}
                >
                  <Box>
                    <Button
                      size="medium"
                      fullWidth
                      variant="contained"
                      onClick={handleDemoEdit}
                    >
                      {" "}
                      {t("Edit")}
                    </Button>
                  </Box>
                  <Box>
                    <Button
                      size="medium"
                      fullWidth
                      variant="contained"
                      onClick={handleUpdate}
                    >
                      {" "}
                      {isLoading ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        t("Update")
                      )}
                    </Button>
                  </Box>
                </Box>
              </>
            ) : (
              <></>
            )}
          </Box>
        </Paper>
      </div>
    </>
  );
};

export default Foods;
