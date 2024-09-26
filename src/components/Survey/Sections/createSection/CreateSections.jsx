import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Typography,
} from "@mui/material";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import { styled } from "@mui/material/styles";
import makeStyles from "@mui/styles/makeStyles";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  addSection,
  removeSectionByTitle,
  setApiErrorStatusCode,
  setDefaultSections,
  setLabelNum,
  setOptionNum,
  setSection,
  setSectionAndQuestionNum,
  setSectionNumber,
  setSurvey,
  setViewSection,
} from "../../../../store/slices/app.tsx";
import CommonAccordion from "./CommonAccordion.jsx";
import axios from "../../../../api/axios.js";
import { useTranslation } from "react-i18next";
const useStyles = makeStyles(() => ({
  input: {
    border: "1px solid #C1C1C1",
    borderRadius: "5px",
    outline: "none",
  },
  focused: {
    border: "none",
  },
}));

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1.5px solid #45AEAE`,
  "&:not(:last-child)": {
    // borderBottom: 0,
  },
  "&:before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon style={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiAccordionSummary-expandIconWrapper": {
    color: "#45AEAE",
  },
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    color: "#45AEAE",
  },
  "& .MuiAccordionSummary-content": {},
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({}));

function Sections() {
  const classes = useStyles();

  const handleSave = () => {
    let showToast = true;
    let optionToast = true;
    let addToast = true;
    if (!appState?.survey?.survey?.sections?.length) {
      toast(t("Please Add Atleast One Section"), {
        position: "top-center",
        autoClose: 4000,
        hideProgressBar: false,
        pauseOnHover: true,
        draggable: true,
        type: "error",
      });
      return;
    }
    if (appState?.survey?.survey?.sections?.length) {
      appState?.survey?.survey?.sections?.map((sect, index) => {
        if (!sect.title && showToast) {
          toast(t(`Please Enter section name`), {
            position: "top-center",
            autoClose: 4000,
            hideProgressBar: false,
            pauseOnHover: true,
            draggable: true,
            type: "error",
          });
          showToast = false;
          return;
        }
        if (
          (!sect.conditions[0]?.adult_status ||
            !sect.conditions[0]?.gender_status) &&
          !appState?.defaultSections?.includes(sect?.title) &&
          showToast
        ) {
          toast(`${t("Please Select Age and Gender Status for section")}`, {
            position: "top-center",
            autoClose: 4000,
            hideProgressBar: false,
            pauseOnHover: true,
            draggable: true,
            type: "error",
          });
          showToast = false;
          return;
        }
        if (!sect?.questions?.length && showToast) {
          toast(t(`Please Add Atleast One question`), {
            position: "top-center",
            autoClose: 4000,
            hideProgressBar: false,
            pauseOnHover: true,
            draggable: true,
            type: "error",
          });
          showToast = false;
          return;
        }
        sect?.questions?.map((que, queIndex) => {
          if (!que.caption?.length && showToast) {
            toast(
              lang === "en"
                ? `Please Enter Question Number ${queIndex + 1}`
                : `الرجاء إدخال السؤال رقم ${queIndex + 1}`,
              {
                position: "top-center",
                autoClose: 4000,
                hideProgressBar: false,
                pauseOnHover: true,
                draggable: true,
                type: "error",
              }
            );
            showToast = false;
            dispatch(
              setSectionAndQuestionNum({
                secNum: index,
                quesNum: queIndex,
              })
            );
            return;
          }
          if (
            (showToast && que.inputType === "dropDownMenu") ||
            que.inputType === "radiogroup" ||
            que.inputType === "checkBoxGroup"
          ) {
            if (!que?.values?.length && showToast) {
              toast(
                lang === "en"
                  ? `Please Add Atleast One Option and Label for Question Number ${
                      queIndex + 1
                    }`
                  : `الرجاء إضافة خيار واحد على الأقل وتسمية للسؤال رقم ${
                      queIndex + 1
                    }`,
                {
                  position: "top-center",
                  autoClose: 4000,
                  hideProgressBar: false,
                  pauseOnHover: true,
                  draggable: true,
                  type: "error",
                }
              );
              showToast = false;
              return;
            }
            que?.values?.map((vals, valIndex) => {
              if (!vals?.label?.length && !vals?.option?.length && showToast) {
                toast(
                  lang === "en"
                    ? `Please Enter Values for Option and Label for Question Number ${
                        queIndex + 1
                      }`
                    : `الرجاء إدخال قيم الخيار والتسمية للسؤال رقم ${
                        queIndex + 1
                      }`,
                  {
                    position: "top-center",
                    autoClose: 4000,
                    hideProgressBar: false,
                    pauseOnHover: true,
                    draggable: true,
                    type: "error",
                  }
                );
                dispatch(
                  setOptionNum({
                    secNum: index,
                    quesNum: queIndex,
                    OptNum: valIndex,
                  })
                );
                dispatch(
                  setLabelNum({
                    secNum: index,
                    quesNum: queIndex,
                    LabNum: valIndex,
                  })
                );
                showToast = false;
                return;
              } else if (
                !vals?.label?.length &&
                vals?.option?.length &&
                showToast
              ) {
                dispatch(
                  setLabelNum({
                    secNum: index,
                    quesNum: queIndex,
                    LabNum: valIndex,
                  })
                );
                showToast = false;
                return;
              } else if (
                !vals?.option?.length &&
                vals?.label?.length &&
                showToast
              ) {
                dispatch(
                  setOptionNum({
                    secNum: index,
                    quesNum: queIndex,
                    OptNum: valIndex,
                  })
                );
                showToast = false;
                return;
              } else {
                return;
              }
            });
          }
        });
      });
      if (showToast) {
        const Request = {
          ...appState.survey.survey,
          sections: appState.survey.survey.sections.map((sects) => ({
            ...sects,
            questions: sects?.questions?.map((ques, index) => ({
              ...ques,
              values: ques?.values?.map((val, ind) => ({
                ...val,
                next:
                  index + 1 === sects?.questions?.length
                    ? null
                    : (index + 2).toString(),
              })),
            })),
          })),
        };
        axios
          .post("/api/survey/addSection", Request?.sections[0], {
            headers: { authorization: `Bearer ${appState?.accessToken}` },
          })
          .then((res) => {
            toast(t(`Section has been Saved Successfully`), {
              position: "top-center",
              autoClose: 4000,
              hideProgressBar: false,
              pauseOnHover: true,
              draggable: true,
              type: "success",
            });
            navigate("/survey/section");
            dispatch(setSection());
          })
          .catch((err) => {
            if (err?.response?.status != 401) {
              toast(
                err?.response?.status == "500"
                  ? "error"
                  : err?.response?.data?.Errors[0],
                {
                  position: "top-center",
                  autoClose: 4000,
                  hideProgressBar: false,
                  pauseOnHover: true,
                  draggable: true,
                  type: "error",
                }
              );
            }
            dispatch(setApiErrorStatusCode(err?.response?.status));
          });
      }
    }
  };

  const handleAdd = () => {
    dispatch(setSectionNumber(appState?.sectionNum + 1));
    dispatch(
      addSection({
        sectionid: 0,
        title: "",
        conditions: [
          {
            adult_status: "",
            gender_status: "",
          },
        ],
        header: true,
        questions: [],
      })
    );
    // toast('Section Added Successfully', {
    //   position: "top-center",
    //   autoClose: 4000,
    //   hideProgressBar: false,
    //   pauseOnHover: true,
    //   draggable: true,
    //   type:'success'
    //   });
    //   }
    // }
  };
  const dispatch = useDispatch();
  const appState = useSelector((state) => state?.app);
  const navigate = useNavigate();
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const id = queryParams?.get("id");

  const [sections, setSections] = React.useState([]);

  const handleSection = (title, index) => {
    if (
      appState?.survey?.survey?.sections
        ?.map((secc) => secc?.title)
        .includes(title)
    ) {
      dispatch(removeSectionByTitle(title));
    } else {
      const newSec = {
        ...sections[index],
        sectionid: 0,
        questions: JSON.parse(sections[index].questions),
        conditions: JSON.parse(sections[index].conditions),
      };
      const newSec2 = Object.fromEntries(
        Object.entries(newSec).filter(
          ([key, value]) =>
            key !== "id" && key != "createdBy" && key != "updatedBy"
        )
      );
      dispatch(
        addSection({
          ...newSec2,
        })
      );
    }
  };
  const lang = sessionStorage.getItem("lang");
  const { t } = useTranslation();

  return (
    <div dir={lang === "ar" ? "rtl" : ""}>
      <Card sx={{ mb: 4 }}>
        <CardContent>
          {appState?.survey?.survey?.sections?.map((_, index) => (
            <CommonAccordion memberIndex={index} key={index} expanded={true} />
          ))}
          {appState?.survey?.survey?.sections?.length == 1 ? (
            ""
          ) : (
            <Box
              width={"100%"}
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}
              height={"30px"}
              border={"1.5px solid #45AEAE"}
              padding={"21px 23px 21px 15px"}
              color={"#45AEAE"}
              style={{ cursor: "pointer" }}
              fontWeight={"bold"}
              onClick={() => {
                handleAdd();
              }}
            >
              <div>{t("Add Section")}</div>
              <div style={{ fontSize: "22px" }}>+</div>
            </Box>
          )}
          <Box
            display={"flex"}
            marginTop={"50px"}
            justifyContent={{ md: "flex-end", xs: "center" }}
            gap={1}
          >
            <Button
              variant="contained"
              style={{ color: "white", width: "100px" }}
              onClick={() => {
                navigate("/survey/section");
              }}
            >
              {t("Cancel")}
            </Button>
            <Button
              variant="contained"
              style={{ color: "white", width: "100px" }}
              onClick={() => {
                handleSave();
              }}
            >
              {t("Save")}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
}

export default Sections;
