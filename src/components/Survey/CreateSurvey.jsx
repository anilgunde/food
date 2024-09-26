import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  setSection,
  setSurveyClick,
  setSurveyDetails,
  setSurveyType,
} from "../../store/slices/app.tsx";
import createCache from "@emotion/cache";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";

import { useTranslation } from "react-i18next";

const useStyles = makeStyles(() => ({
  input: {
    border: "1px solid #C1C1C1",
    borderRadius: "6px",
    outline: "none",
  },
  focused: {
    border: "none",
  },
}));
const CreateSurvey = () => {
  const [file, setFile] = useState();
  const [scannedImage, setScannedImage] = useState("");
  const lang = sessionStorage.getItem("lang");
  const { t } = useTranslation();
  const handleUpload = (event) => {
    if (event?.target?.files?.length) {
      const reader = new FileReader();
      const image = new Image();
      setFile(event?.target?.files[0]);
      reader.readAsDataURL(event?.target?.files[0]);
      reader.onload = () => {
        if (reader?.result?.toString()) {
          image.src = reader?.result?.toString();

          if (image) {
            image.onload = () => {
              setScannedImage(image?.src);
            };
          }
        }
      };
    }
  };
  const classes = useStyles();
  const [title, setTitle] = useState({ title: "", error: "" });
  const [description, setDescription] = useState({
    description: "",
    error: "",
  });
  const [surveyImage, setImage] = useState({ image: "", error: "" });
  const dispatch = useDispatch();
  const handleTitleChange = (title) => {
    setTitle({
      title: title,
      error: title.length ? "" : `${t("Title is required")}`,
    });
    dispatch(setSurveyType(title));
  };
  const handleDescChange = (description) => {
    setDescription({
      description: description,
      error: description.length ? "" : `${t("Description is required")}`,
    });
    dispatch(setSurveyDetails(description));
  };
  const handleChange = (surveyImage) => {
    setImage({
      surveyImage: surveyImage,
      error: surveyImage.length ? "" : `${t("Title is required")}`,
    });
  };
  const navigate = useNavigate();
  const handleSubmit = () => {
    dispatch(setSurveyClick(true));
    dispatch(setSection());
    navigate("/survey/createSurvey/section");
  };

  return (
    <div dir={lang === "ar" ? "rtl" : ""}>
      <Card>
        <CardHeader
          sx={{
            borderBottom: "1.5px solid #00000024",
            ".MuiCardHeader-title": { fontWeight: "600" },
            ".MuiCardHeader-subheader": {
              fontWeight: "600",
              fontSize: "0.9rem",
            },
          }}
          title={t("Let's get started")}
          subheader={t(
            "Add the basic details about your survey, you would be able to add questions in the next section"
          )}
        ></CardHeader>
        <CardContent>
          <Grid container gap={"1px"}>
            <Grid item md={6} xs={12} marginBottom={"1rem"}>
              <Typography color={"#5A6670"}>{t("Survey title")}</Typography>

              <TextField
                size="small"
                style={{ width: "100%" }}
                multiline
                sx={
                  lang === "ar"
                    ? {
                        ".MuiFormHelperText-root": {
                          position: "absolute",
                          right: 0,
                          bottom: "-25px",
                        },
                        ".Mui-error": {
                          marginBottom: "15px",
                        },
                      }
                    : {}
                }
                error={Boolean(title?.error?.length)}
                helperText={title?.error}
                value={title.title}
                onChange={(e) => {
                  handleTitleChange(e?.target?.value);
                }}
                InputProps={{
                  className: classes.input,
                  classes: {
                    focused: classes.focused,
                  },
                }}
              />
            </Grid>
            <Grid item md={6} xs={12} marginBottom={"1rem"}>
              <Typography color={"#5A6670"}>
                {t("Survey description")}
              </Typography>

              <TextField
                size="small"
                multiline
                rows={4}
                sx={
                  lang === "ar"
                    ? {
                        ".MuiFormHelperText-root": {
                          position: "absolute",
                          right: 0,
                          bottom: "-25px",
                        },
                      }
                    : {}
                }
                style={{ width: "100%" }}
                value={description.description}
                error={Boolean(description?.error?.length)}
                helperText={description?.error}
                onChange={(e) => {
                  handleDescChange(e?.target?.value);
                }}
                InputProps={{
                  className: classes.input,
                  classes: {
                    focused: classes.focused,
                  },
                }}
              />
            </Grid>
          </Grid>
          <Box
            display={"flex"}
            justifyContent={{ md: "flex-end", xs: "center" }}
          >
            <Button
              variant="contained"
              style={{ color: "white", width: "90px" }}
              onClick={() => {
                handleSubmit();
              }}
              disabled={
                !title?.title?.length || !description?.description?.length
              }
            >
              {t("Next")}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateSurvey;
