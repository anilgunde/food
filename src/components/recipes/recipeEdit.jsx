import {
  Box,
  Button,
  Grid,
  IconButton,
  Paper,
  TextField as MuiTextField,
  Typography,
  InputAdornment,
  useMediaQuery,
} from "@mui/material";
import React, { useState } from "react";

import { Delete, Edit } from "@mui/icons-material";
import axios from "../../api/axios";
import { toast } from "react-toastify";
import {
  addNewIngredient,
  deleteIngredient,
  setIngredientQuantity,
  setLoading,
  setNutrientValue,
  setRecipeFoodImage,
  setRecipeFoodName,
} from "../../store/slices/app.tsx";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { useTheme } from "@emotion/react";

const TextField = styled(MuiTextField)(({ theme }) => ({}));

const RecipeEdit = () => {
  const [disabled, setDisabled] = useState(true);
  const handleDisable = () => {
    setDisabled(!disabled);
  };
  const [scannedImage, setScannedImage] = useState(null);

  const handleUpload = (event) => {
    if (event?.target?.files?.length) {
      const reader = new FileReader();
      const image = new Image();
      // setFile(event?.target?.files[0])
      reader.readAsDataURL(event?.target?.files[0]);
      reader.onload = () => {
        // reader?.result?.toString().replace(/^data:(.*,)?/, '')

        if (reader?.result?.toString()) {
          image.src = reader?.result?.toString();

          if (image) {
            image.onload = () => {
              setScannedImage(image?.src);
              dispatch(
                setRecipeFoodImage(
                  image.src?.startsWith("data:image/webp;base64")
                    ? image?.src.replace("data:image/webp;base64,", "")
                    : image.src?.startsWith("data:image/png;base64")
                    ? image?.src.replace("data:image/png;base64,", "")
                    : image.src?.startsWith("data:image/jpeg;base64")
                    ? image?.src.replace("data:image/jpeg;base64,", "")
                    : image?.src.replace("data:image/svg+xml;base64,", "")
                )
              );
            };
          }
        }
      };
    }
  };

  const appState = useSelector((state) => state.app);

  const dispatch = useDispatch();
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const id = queryParams?.get("id");
  const navigate = useNavigate();
  const page = queryParams?.get("page") || 0;

  const handleSave = () => {
    dispatch(setLoading(true));
    axios
      .post(
        `/api/food/UpdateRecipe/${id}`,
        {
          ...appState?.recipeDetails,
          Nutrients: appState?.recipeDetails?.Nutrients?.map((nu) => ({
            nutrientId: nu.nutrientId,
            nutrientValue: nu.nutrientValue,
          })),
          Ingredients: appState?.recipeDetails?.Ingredients?.map((int) => ({
            ingredientId: int.ingredientId,
            quantity: int.quantity,
            measurement: int.measurement,
          })),
          approveRequest: true,
        },
        {
          headers: { authorization: `Bearer ${appState?.accessToken}` },
        }
      )
      .then(() => {
        dispatch(setLoading(false));
        toast.success(t("Recipe updated successfully"));
        navigate("/recipes");
      })
      .catch((err) => {
        dispatch(setLoading(false));
        toast.success(err?.response?.data?.Errors[0]);
      });
  };
  const lang = sessionStorage.getItem("lang");
  const { t } = useTranslation();
  const theme = useTheme();
  const downLg = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <div dir={lang === "ar" ? "rtl" : ""}>
      <Paper style={{ padding: "20px" }}>
        <Typography
          fontWeight={"bold"}
          fontSize={"1.2rem"}
          style={{ textDecoration: "underline" }}
          marginBottom={"1rem"}
        >
          {t("Recipe details")} :
        </Typography>
        <Grid container alignItems={"center"}>
          <Grid item sm={6} xs={12}>
            <Box
              display={"flex"}
              flexDirection={"column"}
              gap={"10px"}
              justifyContent={"flex-start"}
              alignItems={"center"}
            >
              <img
                title={t("Food/Drink Image")}
                src={`data:image/jpeg;base64,${appState?.recipeDetails?.foodImage?.displayImage}`}
                alt={t("Food/Drink Image")}
                width={"100px"}
                height={"100px"}
              />
              <label htmlFor="image">
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  id="image"
                  onChange={(event) => handleUpload(event)}
                />
                <Button component={"span"} id="image" title={t("Edit")}>
                  {t("Edit Food Image")}
                  <Edit />
                </Button>
              </label>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box
              display={"flex"}
              flexDirection={"column"}
              gap={"10px"}
              justifyContent={"flex-start"}
              alignItems={"center"}
            >
              <TextField
                disabled={disabled}
                value={appState?.recipeDetails?.foodName}
                size="small"
                onChange={(e) => {
                  dispatch(setRecipeFoodName(e.target.value));
                }}
              />
              <Button
                title={t("Edit")}
                onClick={() => {
                  handleDisable();
                }}
              >
                {t("Edit Food Name")}
                <Edit />
              </Button>
            </Box>
          </Grid>
        </Grid>
        <Grid
          container
          columnSpacing={{ lg: "4rem", md: "4rem", sm: "4rem" }}
          rowSpacing={"2rem"}
          marginTop={"0.1rem"}
          marginBottom={"2rem"}
        >
          <Grid item sm={6} xs={12}>
            <Box
              textAlign={"center"}
              fontSize={"1.2rem"}
              fontWeight={"bold"}
              style={{ textDecoration: "underline" }}
              marginBottom={"1rem"}
            >
              {t("Ingredients")}
            </Box>
            {appState?.recipeDetails?.Ingredients?.map((ing, index) => (
              <Box
                marginBottom={"10px"}
                display={"flex"}
                justifyContent={"space-between"}
                key={index}
              >
                <TextField
                  autoComplete={"off"}
                  size="small"
                  placeholder={t("Ingredient Id")}
                  value={ing.ingredientName}
                  style={{ width: "40%" }}
                />
                <TextField
                  placeholder={t("Quantity")}
                  autoComplete={"off"}
                  size="small"
                  value={ing.quantity}
                  style={{ width: "40%" }}
                  InputProps={{
                    style: { paddingLeft: 10 },
                    endAdornment: (
                      <InputAdornment>{ing?.measurement}</InputAdornment>
                    ),
                  }}
                  onChange={(event) => {
                    dispatch(
                      setIngredientQuantity({
                        index: index,
                        value: event.target.value,
                      })
                    );
                  }}
                />
                <IconButton
                  onClick={() => {
                    dispatch(deleteIngredient(index));
                  }}
                >
                  <Delete color="danger" />
                </IconButton>
              </Box>
            ))}
            <Box display={"flex"} justifyContent={"center"}>
              <Button
                onClick={() => {
                  dispatch(addNewIngredient());
                }}
              >
                {t("Add Ingredient")}
              </Button>
            </Box>
          </Grid>
          <Grid item sm={6} xs={12}>
            <Box
              textAlign={"center"}
              fontSize={"1.2rem"}
              fontWeight={"bold"}
              style={{ textDecoration: "underline" }}
              marginBottom={"1rem"}
            >
              {t("Nutrients")}
            </Box>
            {appState?.recipeDetails?.Nutrients?.map((nut, index) => (
              <Box
                marginBottom={"10px"}
                display={"flex"}
                justifyContent={"space-between"}
                key={index}
              >
                <TextField
                  size="small"
                  placeholder={t("Nutrient Id")}
                  value={nut.nutrientName}
                  style={{ width: "45%" }}
                />
                <TextField
                  size="small"
                  placeholder={t("Nutrient Value")}
                  value={nut.nutrientValue}
                  style={{ width: "45%" }}
                  onChange={(event) => {
                    dispatch(
                      setNutrientValue({
                        index: index,
                        value: event.target.value,
                      })
                    );
                  }}
                />
                {/* <IconButton onClick={()=>{
                  dispatch(deleteNutrient(index))
                }}>
                  <Delete color="danger"/>
                </IconButton> */}
              </Box>
            ))}
            {/* <Box display={'flex'} justifyContent={'center'}>
            <Button  onClick={()=>{
              dispatch(addNewNutrient())
            }}>{t('Add Nutrient')}</Button>
            </Box> */}
          </Grid>
        </Grid>
        <Box display={"flex"} justifyContent={"center"} gap={3}>
          <Button
            variant="contained"
            style={{ width: "120px" }}
            onClick={() => {
              navigate(`/recipes?page=${page}`);
            }}
          >
            {t("Cancel")}
          </Button>
          <Button
            variant="contained"
            style={{ width: "120px" }}
            onClick={() => {
              handleSave();
            }}
          >
            {t("Save")}
          </Button>
        </Box>
      </Paper>
    </div>
  );
};

export default RecipeEdit;
