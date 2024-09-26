import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";

import DialogTitle from "@mui/material/DialogTitle";
import { t } from "i18next";
import {
    Box,
  FormControl,
  Grid,
  InputLabel,
  MenuItem as MuiMenuItem,
  Select,
  TextField,
} from "@mui/material";
import { styled } from "@mui/styles";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";

import axios from "../../api/axios";
import { setApiErrorStatusCode, setLoading, setParticipantData } from "../../store/slices/app.tsx";

const lang = sessionStorage.getItem("lang");

const MenuItem = styled((props) => (
  <div dir={lang === "ar" ? "rtl" : ""}>
    <MuiMenuItem {...props} />
  </div>
))(({ theme }) => ({}));

export default function FilterDialog({ sendDataToParent }) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const [location,setLocation] = useState('')
  const [gender,setGender] = useState('')
  const [pregnancy,setPregnant] = useState('')
  const [breastfeeding,setBreastFeeding] = useState('')
  const [agerange,setAge] = useState('')
  const [weightrange,setWeight] = useState('')
  const [heightrange,setHeight] = useState('')
  const [bmirange,setBmi] = useState('')
  const dispatch = useDispatch()
  const appState = useSelector((state) => state.app);

const handleSubmit=()=>{
    handleClose();
    dispatch(setLoading(true))
    axios
        .get("/api/household/getAllHouseholdsDemograhics", {
          headers: { authorization: `Bearer ${appState?.accessToken}` },
          params: {
            ...(location && {location:location}),
            ...(gender && {gender:gender}),
            ...(pregnancy && {pregnancy:pregnancy}),
            ...(breastfeeding && {breastfeeding:breastfeeding}),
            ...(agerange && {agerange:agerange}),
            ...(weightrange && {weightrange:weightrange}),
            ...(heightrange && {heightrange:heightrange}),
            ...(bmirange && {bmirange:bmirange}),
          },
        })
        .then((res) => {
          dispatch(setLoading(false));
          dispatch(setParticipantData(res?.data?.data?.items))
        })
        .catch((err) => {
          dispatch(setApiErrorStatusCode(err?.response?.status));
          dispatch(setLoading(false))
        })
}


    const handleReset=()=>{
      dispatch(setLoading(true))
    axios
        .get("/api/household/getAllHouseholdsDemograhics", {
          headers: { authorization: `Bearer ${appState?.accessToken}` },
          params:{pageNumber:1,pageSize:100}
        })
        .then((res) => {
          dispatch(setLoading(false))
          dispatch(setParticipantData(res?.data?.data?.items))
        })
        .catch((err) => {
          dispatch(setApiErrorStatusCode(err?.response?.status))
          dispatch(setLoading(false))
        })
}
    

  return (
    <React.Fragment>
      <Box display={'flex'} gap={'1rem'}>
      <Button variant="outlined" onClick={handleReset}>
        Refresh / Reset
      </Button>
      <Button variant="outlined" onClick={handleClickOpen}>
        Open Filters dialog
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
        <DialogTitle id="alert-dialog-title">{t("Filters")}</DialogTitle>
        <DialogContent style={{ marginTop: "1rem" }}>
          <Grid
            container
            rowSpacing={"1rem"}
            columnSpacing={"1rem"}
            paddingTop={"0.5rem"}
          >
            <Grid item xs={12} md={6}>
              
              <TextField size="small" onChange={(e)=>{setLocation(e.target.value)}} fullWidth label={t("Location")}/>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth size="small">
                <InputLabel>{t("Gender")}</InputLabel>
                <Select onChange={(e)=>{setGender(e.target.value)}} fullWidth size="small" label={t("Gender")}>
                  {appState?.types?.genderTypes?.map((city) => (
                    <MenuItem value={city?.genderId}>
                      {city?.genderName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth size="small">
                <InputLabel>{t("Pregnant")}</InputLabel>
                <Select onChange={(e)=>{setPregnant(e.target.value)}} fullWidth size="small" label={t("Pregnant")}>
                  <MenuItem value={1}>{t("Yes")}</MenuItem>
                  <MenuItem value={0}>{t("No")}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth size="small">
                <InputLabel>{t("Breast Feeding")}</InputLabel>
                <Select onChange={(e)=>{setBreastFeeding(e.target.value)}} fullWidth size="small" label={t("Breast Feeding")}>
                <MenuItem value={1}>{t("Yes")}</MenuItem>
                  <MenuItem value={0}>{t("No")}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth size="small">
                <InputLabel>{t("Age Range")}</InputLabel>
                <Select onChange={(e)=>{setAge(e.target.value)}} fullWidth size="small" label={t("Age Range")}>
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
                <Select onChange={(e)=>{setWeight(e.target.value)}} fullWidth size="small" label={t("Weight Range")}>
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
                <Select onChange={(e)=>{setHeight(e.target.value)}} fullWidth size="small" label={t("Height Range")}>
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
                <Select onChange={(e)=>{setBmi(e.target.value)}} fullWidth size="small" label={t("BMI Range")}>
                  <MenuItem value={"18-25"}>18-25</MenuItem>
                  <MenuItem value={"26-30"}>26-30</MenuItem>
                  <MenuItem value={"31-40"}>31-40</MenuItem>
                  <MenuItem value={"41-50"}>41-50</MenuItem>
                </Select>
              </FormControl>
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
  );
}
