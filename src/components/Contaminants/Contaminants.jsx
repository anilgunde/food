import {
  Box,
  Grid,
  Paper,
  Tab as 
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

import axios from "../../api/axios.js";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setApiErrorStatusCode } from "../../store/slices/app.tsx";
import {  useTheme } from "@mui/styles";

import { useTranslation } from "react-i18next";
import "jspdf-autotable";


import SearchIcon from "@mui/icons-material/Search";

import { toast } from "react-toastify";
const Contaminants = () => {
 
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

    debounceTimeout.current = setTimeout(fetchFoodOptions, 1500); // Reduced debounce time for faster response

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
      //   console.log(selectedFood.foodId);
    } else {
      toast.error(t("Please select a food item"));
    }
  };
  const [ndata, SetNdata] = useState([]);

  useEffect(() => {
    if (fooddata) {
      axios
        .get(`/api/food/contaminantComponent/${fooddata}`, {
          headers: { authorization: `Bearer ${appState?.accessToken}` },
        })
        .then((nutritionresponse) => {
         
          SetNdata(nutritionresponse?.data?.data);
          Object.entries(ndata).forEach(([key, value]) => {
            if (typeof value === "object" && value !== null) {
              console.log(`${key}:`, value);
            } else {
              console.log(`${key}: ${value}`);
            }
          });

          
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [appState?.accessToken, fooddata]);

  const [isLoading, setIsLoading] = useState(false);

  const [key, setKey] = useState(0);
  const handleClear = () => {
    setSearchValue("");
    setSelectedFood(null);
    SetNdata([]);
    setDemoEdit(false);
    setKey((prevKey) => prevKey + 1); 
  };

  const fieldsToDisplay = [
    "contaminantName",
    "quantity",
    "contaminant.contaminantId",
  ];

  
  const [quantityToUpdate, setQuantityToUpdate] = useState();
  const [contaminantIdToUpdate, setContaminantIdToUpdate] = useState();
  const handleQuantityChange = (e, nindex) => {
    const newValue = e.target.value;

   
    const updatedNdata = [...ndata];
    updatedNdata[nindex].quantity = newValue;

   
    SetNdata(updatedNdata);

   
    setQuantityToUpdate(newValue);
    setContaminantIdToUpdate(updatedNdata[nindex].contaminantId);
  };

  
  const handleUpdate = async () => {
    try {
      // Show loading state
      setIsLoading(true);

      // Prepare the payload
      const payload = [
        {
          contaminantId: contaminantIdToUpdate,
          quantity: quantityToUpdate,
        },
      ];

      
      const response = await axios.put(
        `/api/food/updateContaminantComponent/${fooddata}`,
        payload,
        {
          headers: { authorization: `Bearer ${appState?.accessToken}` },
        }
      );

     
      console.log("Update successful:", response.data);
      toast.success("Quantity updated successfully");
      axios
        .get(`/api/food/contaminantComponent/${fooddata}`, {
          headers: { authorization: `Bearer ${appState?.accessToken}` },
        })
        .then((nutritionresponse) => {
          console.log(nutritionresponse?.data?.data);
          SetNdata(nutritionresponse?.data?.data);
          Object.entries(ndata).forEach(([key, value]) => {
            if (typeof value === "object" && value !== null) {
              console.log(`${key}:`, value);
            } else {
              console.log(`${key}: ${value}`);
            }
          });
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
     
      console.error("Error updating data:", error);
      toast.error("Failed to update quantity");
    } finally {
      
      setIsLoading(false);
    }
  };
  return (
    <>
      <div dir={lang === "ar" ? "rtl" : "ltr"}>
        {/* <Box p={1} display={'flex'} alignItems={'flex-end'} justifyContent={'flex-end'}><Button variant="contained"  onClick={() => {
                          navigate("/AddContaminats");
                        }}>Add</Button></Box> */}
        <Paper sx={{ mb: "1rem" }}>
          <Box
            p={5}
            display="flex"
            justifyContent="space-evenly"
            width="100%"
            
            alignItems="center"
            gap={"3rem"}
          >
            <Box pl={4}>
              {" "}
              <Typography
                fontWeight="bold"
                fontSize="1.3rem"
               
              >
                {t("Contaminants")}
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
              {selectedFood && ndata
                ? ndata.map((nitem, nindex) => (
                    <React.Fragment key={nindex}>
                      {() => {
                        console.log("newhello", nitem);
                      }}
                      {/* Display contaminantName */}
                      {/* {["contaminantName"].map((key) => (
            <Grid
              item
              key={key}
              xs={12}
              sm={12}
              md={6}
              lg={4}
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}
              width={"100%"}
            >
              <Typography fontWeight={"bold"}>{nitem.contaminant[key] || "N/A"}:</Typography>
              <TextField
                value={nitem.contaminant[key] || "N/A"}
                size="small"
                edit={false}
                disabled={!demoEdit}
                style={{ width: "65%" }}
              />
            </Grid>
          ))} */}

                      {/* Display and handle quantity change */}
                      <Grid
                        item
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
                          {nitem?.contaminant?.contaminantName}
                        </Typography>
                        <TextField
                          value={nitem.quantity}
                          onChange={(e) => handleQuantityChange(e, nindex)}
                          size="small"
                          style={{ width: "50%" }}
                        />
                      </Grid>
                    </React.Fragment>
                  ))
                : null}
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
                  {/* <Box><Button size="medium" fullWidth variant="contained" onClick={handleDemoEdit}> {t("Edit")}</Button></Box> */}
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

export default Contaminants;
