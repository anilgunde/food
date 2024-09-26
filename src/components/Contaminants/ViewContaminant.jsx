import {
  Box,
  Paper,
  Tab as MuiTab,
  Typography,
  useMediaQuery,
  Button,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "../../api/axios";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import { styled, useTheme } from "@mui/styles";

import { useTranslation } from "react-i18next";
import "jspdf-autotable";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
      style={{ width: "100%" }}
    >
      {value === index && (
        <Box padding={{ xs: "0.8rem", lg: "1.5rem 1.2rem 1.2rem 1.2rem" }}>
          <Typography component={"div"}>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
const Tab = styled(MuiTab)({
  fontWeight: "600",
});
const ViewContaminant = () => {
  
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const id = queryParams?.get("id");

  const appState = useSelector((state) => state.app);
  const [data, setData] = useState();
  const theme = useTheme();
  const navigate = useNavigate();
  const downLg = useMediaQuery(theme.breakpoints.down("md"));

  const { t } = useTranslation();

  const lang = sessionStorage.getItem("lang");

  useEffect(() => {
    axios
      .get(`/api/food/contaminants/${id}`, {
        headers: { authorization: `Bearer ${appState?.accessToken}` },
      })
      .then((res) => {
        
        setData(res?.data?.data);
      })
      .catch((err) => {});
  }, []);

  return (
    <div dir={lang === "ar" ? "rtl" : "ltr"}>
      <Paper>
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          width={"100%"}
          borderBottom={"1px solid #CECECE"}
          padding={"0px 10px"}
          alignItems={"center"}
        >
          <Typography
            fontWeight={"bold"}
            fontSize={"1.3rem"}
            style={{ padding: "10px" }}
          >
            {t("View Contaminant")}
          </Typography>
        </Box>
        <Box>
          <Box
            p={1}
            style={{
              width: "100%",
              height: "calc(100vh - 220px)",
              overflow: "auto",
              maxHeight: "35rem",
            }}
          >
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              p={2}
            >
              <Typography fontWeight={"bold"} fontSize={"1rem"}>
                Contaminant Id : {data?.contaminantId}
              </Typography>
              <Typography fontWeight={"bold"} fontSize={"1rem"}>
                Contaminant Name : {data?.contaminantName}
              </Typography>
              <Typography fontWeight={"bold"} fontSize={"1rem"}>
                ContaminantNameArabic : {data?.contaminantNameArabic}
              </Typography>
              <Typography fontWeight={"bold"} fontSize={"1rem"}>
                UnitOfMeasure : {data?.unitOfMeasure}
              </Typography>
            </Box>

            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              p={2}
            >
              <Typography fontWeight={"bold"} fontSize={"1rem"}>
                UiDisplay : {data?.uiDisplay}
              </Typography>
              <Typography fontWeight={"bold"} fontSize={"1rem"}>
                UnitOfMeasureId : {data?.unitOfMeasureId}
              </Typography>
              <Typography fontWeight={"bold"} fontSize={"1rem"}>
                ContaminantClassification : {data?.contaminantClassification}
              </Typography>
              <Typography fontWeight={"bold"} fontSize={"1rem"}>
                ContaminantClassificationId :{" "}
                {data?.contaminantClassificationId}
              </Typography>
            </Box>
            <Box display={"flex"} pt={2} justifyContent={"center"} gap={"10px"}>
              <Button
                variant="contained"
                onClick={() => {
                  navigate("/Contaminants");
                }}
              >
                {t("Cancel")}
              </Button>
            </Box>
          </Box>
        </Box>
      </Paper>
    </div>
  );
};

export default ViewContaminant;
