import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  FormControlLabel,
  TextField,
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
  setNext,
  setOptionNum,
  setSectionAndQuestionNum,
  setSectionNumber,
  setnewSections,
} from "../../store/slices/app.tsx";
import CommonAccordion from "./CommonAccordion.jsx";
import axios from "../../api/axios.js";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import createCache from "@emotion/cache";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import { useTranslation } from "react-i18next";
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

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

const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});
const cacheLtr = createCache({
  key: "mui-ltr",
  stylisPlugins: [prefixer],
});

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

function Survey() {
  const classes = useStyles();

  const handleAdd = () => {
    //code commented for future reference
    //   let showToast = true;
    //   let optionToast = true;
    //   let addToast = true;
    //   if(appState?.survey?.survey?.sections?.length && appState?.survey?.survey?.sections[appState?.sectionNum]?.questions?.length){
    //     appState?.survey?.survey?.sections[appState?.sectionNum]?.questions?.map((quest,index)=>{
    //       if(!quest?.caption?.length && showToast){
    //         toast(`Please Enter Question Number ${index+1} in the previous section`, {
    //           position: "top-center",
    //           autoClose: 4000,
    //           hideProgressBar: false,
    //           pauseOnHover: true,
    //           draggable: true,
    //           type:'error'
    //           });
    //         showToast = false;
    //         return;
    //       }
    //      else if(showToast && quest.inputType==='dropDownMenu' || quest.inputType==='radiogroup' || quest.inputType==='checkBoxGroup'){
    //           if(!quest?.values.length && addToast){
    //             toast(`Please Add Atleast One Option and Label for Question Number ${index+1} in the previous section`, {
    //               position: "top-center",
    //               autoClose: 4000,
    //               hideProgressBar: false,
    //               pauseOnHover: true,
    //               draggable: true,
    //               type:'error'
    //               });
    //               addToast = false
    //               return;
    //           }
    //           quest.values?.map((vals)=>{
    //             if((!vals?.label?.length || !vals?.option?.length)&&optionToast){
    //               toast(`Please Enter Values for Option and Label for Question Number ${index+1} in the previous section`, {
    //                 position: "top-center",
    //                 autoClose: 4000,
    //                 hideProgressBar: false,
    //                 pauseOnHover: true,
    //                 draggable: true,
    //                 type:'error'
    //                 });
    //                 optionToast = false
    //                 return;
    //             }
    //           })
    //       }
    //       else{
    //         return
    //       }
    //     })
    //     if(showToast && optionToast && addToast){
    //       dispatch(setSectionNumber(appState?.sectionNum+1))
    //       dispatch(
    //         addSection({
    //             section_id: (appState?.sectionNum+2).toString(),
    //             title: "",
    //             conditions: [],
    //             header: true,
    //             questions:[]
    //         })
    //       );
    //       toast('Section Added Successfully', {
    //         position: "top-center",
    //         autoClose: 4000,
    //         hideProgressBar: false,
    //         pauseOnHover: true,
    //         draggable: true,
    //         type:'success'
    //         });
    //     }
    //   }
    //   else if(appState?.survey?.survey?.sections?.length && appState?.survey?.survey?.sections[appState?.sectionNum]?.questions?.length==0){
    //     toast('Pleae Add Atleast One Question in the previous section before adding another section', {
    //       position: "top-center",
    //       autoClose: 4000,
    //       hideProgressBar: false,
    //       pauseOnHover: true,
    //       draggable: true,
    //       type:'error'
    //       });
    //   }
    //   else {
    //     dispatch(setSectionNumber(appState?.sectionNum+1))
    //     dispatch(
    //       addSection({
    //           section_id: '1',
    //           title: "",
    //           conditions: [],
    //           header: true,
    //           questions:[]
    //       })
    //     );
    //     toast('Section Added Successfully', {
    //       position: "top-center",
    //       autoClose: 4000,
    //       hideProgressBar: false,
    //       pauseOnHover: true,
    //       draggable: true,
    //       type:'success'
    //       });
    //   }
    // let showToast = true;
    // let optionToast = true;
    // let addToast = true;
    // if(!appState?.survey?.survey?.sections?.length){
    //   toast('Please Add Atleast One Section', {
    //   position: "top-center",
    //   autoClose: 4000,
    //   hideProgressBar: false,
    //   pauseOnHover: true,
    //   draggable: true,
    //   type:'error'
    //   });
    //   return;
    // }
    // if(appState?.survey?.survey?.sections?.length){
    //   appState?.survey?.survey?.sections?.map((sect,index)=>{
    //     if(!sect?.questions?.length && showToast){
    //       toast(`Please Add Atleast One question in ${sect?.title} section ${sect?.title?.length ?'': index+1}`, {
    //         position: "top-center",
    //         autoClose: 4000,
    //         hideProgressBar: false,
    //         pauseOnHover: true,
    //         draggable: true,
    //         type:'error'
    //         });
    //         showToast = false;
    //         return
    //     }
    //     sect?.questions?.map((que,queIndex)=>{
    //       if(!que.caption?.length && showToast){
    //         toast(`Please Enter Question Number ${queIndex+1} in ${sect?.title} section ${sect?.title?.length ?'': index+1}`, {
    //           position: "top-center",
    //           autoClose: 4000,
    //           hideProgressBar: false,
    //           pauseOnHover: true,
    //           draggable: true,
    //           type:'error'
    //           });
    //         showToast = false;
    //         return;
    //       }
    //       if(showToast && que.inputType==='dropDownMenu' || que.inputType==='radiogroup' || que.inputType==='checkBoxGroup'){
    //       if(!que?.values?.length && showToast){
    //         toast(`Please Add Atleast One Option and Label for Question Number ${queIndex+1} in ${sect?.title} section ${sect?.title?.length ?'': index+1}`, {
    //           position: "top-center",
    //           autoClose: 4000,
    //           hideProgressBar: false,
    //           pauseOnHover: true,
    //           draggable: true,
    //           type:'error'
    //           });
    //         showToast = false;
    //         return;
    //       }
    //       que?.values?.map((vals,valIndex)=>{
    //         if((!vals?.label?.length || !vals?.option?.length)&&showToast){
    //           toast(`Please Enter Values for Option and Label for Question Number ${queIndex+1} in ${sect?.title} section ${sect?.title?.length ?'': index+1}`, {
    //             position: "top-center",
    //             autoClose: 4000,
    //             hideProgressBar: false,
    //             pauseOnHover: true,
    //             draggable: true,
    //             type:'error'
    //             });
    //             showToast = false
    //             return;
    //           }
    //           else{
    //             return
    //           }
    //       })
    //     }
    //     })

    //   })
    //   if(showToast){
    dispatch(setSectionNumber(appState?.sectionNum + 1));
    dispatch(
      addSection({
        sectionId: 0,
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
    toast(t("Section Added Successfully"), {
      position: "top-center",
      autoClose: 4000,
      hideProgressBar: false,
      pauseOnHover: true,
      draggable: true,
      type: "success",
    });
    //   }
    // }
  };
  const handleSave = () => {
    let showToast = true;
    let optionToast = true;
    let addToast = true;
    // let uniqueSectionTitles = new Set();
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
          toast(`${t("Please Enter section name for section")} ${index + 1}`, {
            position: "top-center",
            autoClose: 4000,
            hideProgressBar: false,
            pauseOnHover: true,
            draggable: true,
            type: "error",
          });
          setOpenAccordion(index);
          showToast = false;
          return;
        }
        if (
          (!sect.conditions[0]?.adult_status ||
            !sect.conditions[0]?.gender_status) &&
          !appState?.defaultSections?.includes(sect?.title) &&
          showToast
        ) {
          toast(
            `${t("Please Select Age and Gender Status for section")} ${
              index + 1
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
          setOpenAccordion(index);
          showToast = false;
          return;
        }
        if (!sect?.questions?.length && showToast) {
          toast(
            `${t("Please Add Atleast One question in section")} ${
              sect?.title
            } ${sect?.title?.length ? "" : index + 1}`,
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
          setOpenAccordion(index);
          return;
        }
        sect?.questions?.map((que, queIndex) => {
          if (!que.caption?.length && showToast) {
            toast(
              lang === "en"
                ? `Please Enter Question Number ${queIndex + 1} in section ${
                    sect?.title
                  } ${sect?.title?.length ? "" : index + 1}`
                : `الرجاء إدخال السؤال رقم ${queIndex + 1} في القسم ${
                    sect?.title
                  } ${sect?.title?.length ? "" : index + 1}`,
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
            setOpenAccordion(index);
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
                    } in section ${sect?.title} ${
                      sect?.title?.length ? "" : index + 1
                    }`
                  : `يرجى إضافة خيار واحد على الأقل وتسمية للسؤال رقم ${
                      queIndex + 1
                    } في القسم ${sect?.title} ${
                      sect?.title?.length ? "" : index + 1
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
              setOpenAccordion(index);
              return;
            }
            que?.values?.map((vals, valIndex) => {
              if (!vals?.label?.length && !vals?.option?.length && showToast) {
                toast(
                  lang === "en"
                    ? `Please Enter Values for Option and Label for Question Number ${
                        queIndex + 1
                      } in section ${sect?.title} ${
                        sect?.title?.length ? "" : index + 1
                      }`
                    : `الرجاء إدخال قيم الخيار والتسمية للسؤال رقم ${
                        queIndex + 1
                      } في القسم ${sect?.title} ${
                        sect?.title?.length ? "" : index + 1
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
                setOpenAccordion(index);
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
                setOpenAccordion(index);
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
                setOpenAccordion(index);
                return;
              } else {
                return;
              }
            });
          }
          // if (uniqueSectionTitles.has(sect.title) && showToast) {
          //   toast(`Section title "${sect.title}" is duplicated. Please use unique titles.`, {
          //     position: "top-center",
          //     autoClose: 4000,
          //     hideProgressBar: false,
          //     pauseOnHover: true,
          //     draggable: true,
          //     type: 'error'
          //   });
          //   showToast = false;
          //   setOpenAccordion(index);
          //   return;
          // } else {
          //   uniqueSectionTitles.add(sect.title);
          // }
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
          .post("/api/survey/addSurvey", Request, {
            // {...appState?.survey?.survey,sections:appState?.survey?.survey?.sections?.map((sec)=>({...sec,conditions:[...sec.conditions,{adult_status:1,gender_status:1}]}))}
            headers: { authorization: `Bearer ${appState?.accessToken}` },
          })
          .then((res) => {
            toast(t(`Survey Data has been Saved Successfully`), {
              position: "top-center",
              autoClose: 4000,
              hideProgressBar: false,
              pauseOnHover: true,
              draggable: true,
              type: "success",
            });
            navigate("/survey/viewSurvey");
          })
          .catch((err) => {
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
      }
    }
  };
  //code commented for future reference
  // if(showToast){
  //   let sceName='';
  //   // appState?.survey?.survey?.sections?.map((sec,index)=>{
  //     if(sceName === sect.title){
  //       toast(`Sections cannot have same name please change the name of section number${index}`, {
  //         position: "top-center",
  //         autoClose: 4000,
  //         hideProgressBar: false,
  //         pauseOnHover: true,
  //         draggable: true,
  //         type:'error'
  //         });
  //         showToast=false
  //     }
  //     sceName = sect.title
  //     return;
  //   // })
  // }
  const dispatch = useDispatch();
  const appState = useSelector((state) => state?.app);
  const location = useLocation();
  const navigate = useNavigate();
  React.useEffect(() => {
    if (appState?.surveyClick === false) {
      navigate("/survey/createSurvey");
    }
  }, [appState?.surveyClick]);
  const [openAccordion, setOpenAccordion] = React.useState(null);
  const handleAccordionChange = (index) => {
    setOpenAccordion((prev) => (prev === index ? null : index));
  };
  const [sections, setSections] = React.useState([]);

  React.useEffect(() => {
    axios
      .get("/api/survey/getAllSections", {
        headers: { authorization: `Bearer ${appState?.accessToken}` },
      })
      .then((res) => {
        setSections(res?.data?.data);

        dispatch(setDefaultSections(res?.data?.data?.map((tit) => tit.title)));
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
  }, []);

  const handleSection = (title, id, index) => {
    if (
      appState?.survey?.survey?.sections
        ?.map((secc) => secc?.title)
        .includes(title)
    ) {
      dispatch(removeSectionByTitle(title));
    } else {
      const newSec = {
        ...sections[index],
        sectionId: id,
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
          <Box
            mb={2}
            pb={1}
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Typography fontWeight={600}></Typography>

            <CacheProvider value={lang === "ar" ? cacheRtl : cacheLtr}>
              <Autocomplete
                key={appState?.autocompleteRefresh}
                multiple
                id="checkboxes-tags-demo"
                options={sections}
                size="small"
                defaultValue={appState?.survey?.survey?.sections?.filter(
                  (dem) => dem?.sectionId != 0
                )}
                isOptionEqualToValue={(option, value) =>
                  option.title === value.title
                }
                disableCloseOnSelect
                getOptionLabel={(option) => option.title}
                onChange={(e, value) => {
                  const parsedSections = value.map((ques) => ({
                    title: ques.title,
                    questions:
                      typeof ques.questions === "string"
                        ? JSON.parse(ques.questions)
                        : ques.questions,
                    sectionId: ques.id,
                    conditions:
                      typeof ques.conditions === "string"
                        ? JSON.parse(ques.conditions)
                        : ques.conditions,
                    header: ques.header,
                  }));

                  const filterSections =
                    appState?.survey?.survey?.sections?.filter(
                      (dem) => dem.sectionId == 0
                    );

                  const newSections = [...parsedSections, ...filterSections];

                  dispatch(setnewSections(newSections));
                }}
                renderOption={(props, option, { selected }) => (
                  <li {...props} dir={lang === "ar" ? "rtl" : ""}>
                    <Checkbox
                      icon={icon}
                      checkedIcon={checkedIcon}
                      style={{ marginRight: 8 }}
                      checked={selected}
                    />
                    {option.title}
                  </li>
                )}
                style={{ width: 400 }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={`${t("Select Existing Sections")}`}
                  />
                )}
              />
            </CacheProvider>
          </Box>

          {appState?.survey?.survey?.sections?.map((_, index) => (
            <CommonAccordion
              memberIndex={index}
              key={index}
              expanded={openAccordion === index ? true : false}
              onChange={() => handleAccordionChange(index)}
            />
          ))}
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
            <div>{t("Add Custom Section")}</div>
            <div style={{ fontSize: "22px" }}>+</div>
          </Box>

          <Box
            display={"flex"}
            marginTop={"50px"}
            justifyContent={{ md: "flex-end", xs: "center" }}
          >
            <Button
              variant="contained"
              style={{ color: "white", width: "100px" }}
              // color='white'
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

export default Survey;
