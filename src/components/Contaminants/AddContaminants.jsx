import { useEffect, useCallback, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  CircularProgress,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  ListItemText,
  Stack,
  TextField,
  Typography,
  styled,
  useTheme,
} from "@mui/material";

import OutlinedInput from "@mui/material/OutlinedInput";
import MuiMenuItem from "@mui/material/MenuItem";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import { toast } from "react-toastify";
// import useResponse from "../../helper";
// import useLocalStorage from "../../hooks/useLocalStorage";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { setApiErrorStatusCode } from "../../store/slices/app.tsx";
import {
  CheckCircleOutline,
  HighlightOff,
  SettingsCell,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import createCache from "@emotion/cache";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import { useTranslation } from "react-i18next";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});
const cacheLtr = createCache({
  key: "mui-ltr",
  stylisPlugins: [prefixer],
});
const names = ["USER_MANAGER", "hello", "hii"];

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}
const AddContaminants = () => {
  const theme = useTheme();

  const navigate = useNavigate();

  const lang = sessionStorage.getItem("lang");

  const handleKeyPress = (e) => {
    if (e.key === " ") {
      e.preventDefault(); // Prevent space from being entered
    }
  };
  const appState = useSelector((state) => state?.app);

  const ltrPlugin = (
    context,
    content,
    selectors,
    parent,
    line,
    column,
    length
  ) => rtlPlugin(context, content, selectors, parent, line, column, length);

  const MenuItem = styled((props) => (
    <div dir={lang === "ar" ? "rtl" : ""}>
      <MuiMenuItem {...props} />
    </div>
  ))(({ theme }) => ({}));
  const { t } = useTranslation();

  const [contaminantName, setContaminantName] = useState("");
  const [contaminantNameArabic, setContaminantNameArabic] = useState("");
  const [unitOfMeasureId, setUnitOfMeasureId] = useState("");
  const [uiDisplay, setUiDisplay] = useState("");
  const [contaminantClassificationId, setContaminantClassificationId] =
    useState("");

  const HandelSubmit = (e) => {
    if (!contaminantName) {
      toast.error(`${t("Enter the ContaminantName")}`);
    } else if (!contaminantNameArabic) {
      toast.error(`${t("Enter the ContaminantNameArabic ")}`);
    } else if (!measureid) {
      toast.error(`${t("Enter the UnitOfMeasureId ")}`);
    } else if (!uiDisplay) {
      toast.error(`${t("Enter the UiDisplay ")}`);
    } else if (!contaminantClassificationId) {
      toast.error(`${t("Enter the ContaminantClassificationId ")}`);
    } else {
      axios
        .post(
          "/api/food/addContaminant",
          {
            contaminantName: contaminantName,
            contaminantNameArabic: contaminantNameArabic,
            unitOfMeasureId: measureid,
            // uiDisplay: uiDisplay,
            // contaminantClassificationId: contaminantClassificationId

            uiDisplay: 1,
            contaminantClassificationId: 1,
          },
          {
            headers: { authorization: `Bearer ${appState?.accessToken}` },
          }
        )
        .then((res) => {
        
          if (res?.data?.isSuccess === true) {
            toast(t("Contaminant Add Successfully"), {
              position: "top-center",
              autoClose: 4000,
              hideProgressBar: false,
              pauseOnHover: true,
              draggable: true,
              type: "success",
            });
          }
          navigate("/Contaminants");
        })
        .catch((err) => {
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
        });
    }
  };

  const [measure, SetMeasure] = useState([]);
  const [measureid, SetMeasureid] = useState();

  useEffect(() => {
    axios
      .get(`/api/food/unitOfMeasure`, {
        headers: { authorization: `Bearer ${appState?.accessToken}` },
      })
      .then((res) => {
        
        SetMeasure(res?.data?.data);
      })
      .catch((err) => {});
  }, []);



  return (
    <Box>
      <Stack justifyContent="center" alignItems={"center"}>
        <Card
          sx={{
            maxWidth: 450,
            minHeight: 400,
            bordertop: `3px solid ${theme.palette.primary.main}`,
            paddingX: 2,
          }}
        >
          <CardContent>
            <Grid container spacing={2} position={"relative"}>
              <Grid item xs={12} sm={12}>
                <Stack justifyContent="center" alignItems="center">
                  <PersonAddAltOutlinedIcon
                    sx={{
                      fontSize: "4rem",
                      color: `${theme.palette.grey[500]}`,
                      borderRadius: "5%",
                      fontSizeAdjust: 4,
                    }}
                  />
                  <Typography
                    variant="h5"
                    color={(theme) => theme.palette.grey[500]}
                    component="h2"
                    guttertop={"true"}
                    textTransform={"uppercase"}
                    fontWeight={600}
                    letterSpacing={3}
                  >
                    {t("Add Contaminant")}
                  </Typography>
                </Stack>
              </Grid>
              <Box pt={2}>
                <CacheProvider value={lang === "ar" ? cacheRtl : cacheLtr}>
                  <Grid container spacing={2} position={"relative"}>
                    <Grid item xs={12} sm={12}>
                      <div dir={lang === "ar" ? "rtl" : ""}>
                        <TextField
                          size="small"
                          name="ContaminantName"
                          placeholder={t("ContaminantName")}
                          label={t("ContaminantName")}
                          fullWidth
                          value={contaminantName}
                          onChange={(e) => setContaminantName(e.target.value)}
                        />
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                      <div dir={lang === "ar" ? "rtl" : ""}>
                        <TextField
                          size="small"
                          name="ContaminantNameArabic"
                          placeholder={t("ContaminantNameArabic")}
                          label={t("ContaminantNameArabic")}
                          fullWidth
                          value={contaminantNameArabic}
                          onChange={(e) =>
                            setContaminantNameArabic(e.target.value)
                          }
                        />
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={12}>
                      <div dir={lang === "ar" ? "rtl" : ""}>
                        <FormControl fullWidth>
                          <InputLabel id="demo-simple-select-label">
                            {t("Uinit of Measure")}
                          </InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={measureid}
                            label={t("Uinit of Measure")}
                            size="small"
                            //onChange={handleChange}
                            onChange={(e) => SetMeasureid(e.target.value)}
                          >
                            {measure.map((mdata) => (
                              <MenuItem key={mdata.id} value={mdata.id}>
                                {mdata?.description}({mdata?.name})
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </div>
                    </Grid>
                    {/* <Grid item xs={12} sm={12}>
                  <div dir={lang==='ar'?"rtl":''}>
                    <TextField
                      size="small"
                      placeholder={t('UiDisplay')}
                      name="UiDisplay"
                      label={t('UiDisplay')}
                      fullWidth
                      value={uiDisplay}
                      onChange={(e) =>setUiDisplay(e.target.value)}
                    />
                    </div>
                  </Grid> */}
                    {/* <Grid item xs={12} sm={12}>
                  <div dir={lang==='ar'?"rtl":''}>
                    <TextField
                      size="small"
                      placeholder={t('ContaminantClassificationId')}
                      name="ContaminantClassificationId"
                      label={t('ContaminantClassificationId')}
                      fullWidth
                      value={contaminantClassificationId}
                      onChange={(e) =>setContaminantClassificationId(e.target.value)}
                    />
                    </div>
                  </Grid> */}

                    <Grid item xs={12} sm={12}>
                      <div dir={lang === "ar" ? "rtl" : ""}>
                        <Stack
                          display={"flex"}
                          flexDirection={"row"}
                          justifyContent={"center"}
                          gap={1}
                        >
                          <Button
                            fullWidth
                            
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            style={{ color: "white" }}
                           
                            onClick={() => {
                              navigate("/Contaminants");
                            }}
                          >
                            {t("Cancel")}
                          </Button>
                          <Button
                            fullWidth
                            type="submit"
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            style={{ color: "white" }}
                            onClick={HandelSubmit}
                          >
                            {t("Submit")}
                          </Button>
                        </Stack>
                      </div>
                    </Grid>
                  </Grid>
                </CacheProvider>
              </Box>
            </Grid>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
};

export default AddContaminants;
