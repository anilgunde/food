import { Delete } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import { Box, Grid, IconButton, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addValues,
  setLabelNum,
  setOptionNum,
  setOptionsLabel,
  setOptionsOption,
  setQuestionTitle,
  setSectionAndQuestionNum,
} from "../../../../store/slices/app.tsx";
import createCache from "@emotion/cache";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import { useTranslation } from "react-i18next";
import Modall from "../../../Modal/index.jsx";
const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});
const cacheLtr = createCache({
  key: "mui-ltr",
  stylisPlugins: [prefixer],
});

const Option = ({ ...props }) => {
  const dispatch = useDispatch();
  const appState = useSelector((state) => state?.app);

  const lang = sessionStorage.getItem("lang");
  const { t } = useTranslation();

  const [open, setOpen] = React.useState(false);
  const [types, setType] = React.useState("");
  const [ind, setIndex] = React.useState("");
  const handleClose = () => setOpen(false);

  return (
    <Grid container>
      <CacheProvider value={lang === "ar" ? cacheRtl : cacheLtr}>
        <Modall
          open={open}
          type={types}
          ind={ind}
          handleClose={() => {
            handleClose();
          }}
        />
        <Grid item lg={3}>
          <TextField
            style={{ marginTop: "10px" }}
            error={
              appState?.errorSectionLab === props.secindex &&
              appState?.errorQuestionLab === props.questindex &&
              appState?.errorLabel === props?.valindex
            }
            value={
              appState?.survey?.survey?.sections?.[props.secindex]?.questions?.[
                props.questindex
              ].values?.[props.valindex]?.label
            }
            {...props}
            label={t("Label")}
            onChange={(e) => {
              dispatch(
                setOptionsLabel({
                  secIndex: props.secindex,
                  questIndex: props.questindex,
                  valIndex: props.valindex,
                  message: e.target.value,
                })
              );
              if (
                appState?.errorSectionLab === props.secindex &&
                appState?.errorQuestionLab === props.questindex &&
                appState?.errorLabel === props?.valindex &&
                e?.target?.value?.length
              ) {
                dispatch(
                  setLabelNum({
                    secNum: null,
                    quesNum: null,
                    LabNum: null,
                  })
                );
                return;
              }
              if (e?.target?.value?.length === 0) {
                dispatch(
                  setLabelNum({
                    secNum: props.secindex,
                    quesNum: props.questindex,
                    LabNum: props.valindex,
                  })
                );
              }
            }}
          />
        </Grid>
        <Grid item lg={3} display={"flex"}>
          <TextField
            style={{ marginTop: "10px" }}
            error={
              appState?.errorSectionOpt === props.secindex &&
              appState?.errorQuestionOpt === props.questindex &&
              appState?.errorOption === props?.valindex
            }
            {...props}
            value={
              appState?.survey?.survey?.sections?.[props.secindex]?.questions?.[
                props.questindex
              ]?.values?.[props.valindex]?.option
            }
            label={t("Option")}
            onChange={(e) => {
              dispatch(
                setOptionsOption({
                  secIndex: props.secindex,
                  questIndex: props.questindex,
                  valIndex: props.valindex,
                  message: e.target.value,
                })
              );
              if (
                appState?.errorSectionOpt === props.secindex &&
                appState?.errorQuestionOpt === props.questindex &&
                appState?.errorOption === props?.valindex &&
                e?.target?.value?.length
              ) {
                dispatch(
                  setOptionNum({
                    secNum: null,
                    quesNum: null,
                    OptNum: null,
                  })
                );
                return;
              }
              if (e?.target?.value?.length === 0) {
                dispatch(
                  setOptionNum({
                    secNum: props.secindex,
                    quesNum: props.questindex,
                    OptNum: props.valindex,
                  })
                );
              }
            }}
          />
          <IconButton
            onClick={() => {
              setOpen(true);
              setType("Options");
              setIndex([props.secindex, props.questindex, props.valindex]);
            }}
            color="danger"
          >
            <Delete />
          </IconButton>
        </Grid>
      </CacheProvider>
    </Grid>
  );
};

const Question = ({ ...props }) => {
  const { sectionIndex, questionIndex } = props;
  const appState = useSelector((state) => state?.app);
  const dispatch = useDispatch();

  const lang = sessionStorage.getItem("lang");
  const { t } = useTranslation();

  const [open, setOpen] = React.useState(false);
  const [types, setType] = React.useState("");
  const [ind, setIndex] = React.useState("");
  const handleClose = () => setOpen(false);

  return (
    <Box
      style={{ border: "1px solid rgba(0,0,0,0.5)" }}
      padding={"1rem"}
      margin={"1rem 0rem"}
    >
      <CacheProvider value={lang === "ar" ? cacheRtl : cacheLtr}>
        <Modall
          open={open}
          type={types}
          ind={ind}
          handleClose={() => {
            handleClose();
          }}
        />
        <Typography margin={"0px 0px 10px 0px"} fontWeight={"bold"}>
          {questionIndex + 1}. &nbsp;
          {t(
            appState?.survey?.survey?.sections?.[sectionIndex]?.questions?.[
              questionIndex
            ]?.inputType
              .replace(/([a-z])([A-Z])/g, "$1 $2")
              .toLowerCase()
              .replace(/(?:^|\s)\S/g, (match) => match.toUpperCase())
          )}
        </Typography>
        <Box style={{ display: "flex", justifyContent: "center" }}>
          <TextField
            label={t("Enter Your Question")}
            error={
              appState?.errorSection === sectionIndex &&
              appState?.errorQuestion === questionIndex
            }
            value={
              appState?.survey?.survey?.sections?.[sectionIndex]?.questions?.[
                questionIndex
              ]?.caption
            }
            fullWidth
            onChange={(e) => {
              dispatch(
                setQuestionTitle({
                  index: sectionIndex,
                  questIndex: questionIndex,
                  message: e.target.value,
                })
              );
              if (
                appState?.errorSection === sectionIndex &&
                appState?.errorQuestion === questionIndex &&
                e?.target?.value?.length
              ) {
                dispatch(
                  setSectionAndQuestionNum({
                    secNum: null,
                    quesNum: null,
                  })
                );
                return;
              }
              if (e?.target?.value?.length === 0) {
                dispatch(
                  setSectionAndQuestionNum({
                    secNum: sectionIndex,
                    quesNum: questionIndex,
                  })
                );
              }
            }}
          />

          {/* <IconButton onClick={()=>{
                SetEdit(!edit)
            }}><EditIcon/></IconButton> */}
          <IconButton
            onClick={() => {
              setOpen(true);
              setType("Question");
              setIndex([sectionIndex, questionIndex]);
              // dispatch(
              //   removeQuestion({
              //     secIndex: sectionIndex,
              //     questIndex: questionIndex,
              //   })
              // );
            }}
            color="danger"
          >
            <Delete />
          </IconButton>
        </Box>
        <Box>
          {appState?.survey?.survey?.sections?.[sectionIndex]?.questions?.[
            questionIndex
          ]?.inputType === "dropDownMenu" ||
          appState?.survey?.survey?.sections?.[sectionIndex]?.questions?.[
            questionIndex
          ]?.inputType === "radiogroup" ||
          appState?.survey?.survey?.sections?.[sectionIndex]?.questions?.[
            questionIndex
          ]?.inputType === "checkBoxGroup" ? (
            <>
              {appState?.survey?.survey?.sections?.[sectionIndex]?.questions?.[
                questionIndex
              ]?.values?.map((vals, index) => (
                <Option
                  size="small"
                  option={vals.option}
                  label={vals.label}
                  key={index}
                  valindex={index}
                  secindex={sectionIndex}
                  questindex={questionIndex}
                />
              ))}
              <IconButton
                onClick={() => {
                  // SetEdit(!edit)
                  dispatch(
                    addValues({
                      secIndex: sectionIndex,
                      index: questionIndex,
                      opts: {
                        option: "",
                        label: "",
                      },
                    })
                  );
                }}
              >
                <AddIcon />
              </IconButton>
            </>
          ) : (
            ""
          )}
        </Box>
      </CacheProvider>
    </Box>
  );
};

export default Question;
