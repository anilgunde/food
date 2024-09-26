import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import {
  Backdrop,
  Box,
  Button,
  Card,
  CardContent,
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
  setApiErrorStatusCode,
  setLoading,
  setResponseSurvey,
} from "../../../store/slices/app.tsx";
import { survey } from "../../../utils/constants.js";
import Heart from "../../Common/Heart.jsx";
import CommonAccordion from "./commonAccordion.jsx";
import axios from "../../../api/axios.js"; 
import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import {createTheme} from '@mui/material'
import { useTranslation } from "react-i18next";
const themeRtl = createTheme({
  direction: "rtl" // Both here and <body dir="rtl">
});
const themeLtr = createTheme({
  direction: "ltr" // Both here and <body dir="ltr">
});
// Create rtl cache
const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin]
});
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

  const handleAdd = () => {
    dispatch(
      addSection({
        sectionid: 0,
        title: "",
        conditions: [],
        header: true,
        questions: [],
      })
    );
    toast("Section Added Successfully", {
      position: "top-center",
      autoClose: 4000,
      hideProgressBar: false,
      pauseOnHover: true,
      draggable: true,
      type: "success",
    });
  };
  const dispatch = useDispatch();
  const appState = useSelector((state) => state?.app);
  const location = useLocation();
  const navigate = useNavigate();
  React.useEffect(() => {
    setTimeout(() => {
      // dispatch(setResponseSurvey(survey))
    }, 800);
  }, []);
  // const memoizedMapQuestions = React.useMemo(() => {
  //   return appState?.responseSurvey?.survey?.sections?.map((_, index) => (
  //     <CommonAccordion memberIndex={index} key={index} />
  //   ));
  // }, [appState?.responseSurvey?.survey?.sections]);
  const [openAccordion, setOpenAccordion] = React.useState(null);
  const [details, setDetails] = React.useState(null);
  const handleAccordionChange = (index) => {
    setOpenAccordion((prev) => (prev === index ? null : index));
  };
  // React.useEffect(()=>{
  //   dispatch(setLoading(true))
  //   axios.get('/api/interviewer/survey?surveyId=60',{
  //     headers: {authorization : `Bearer ${appState?.accessToken}`},}).then((res)=>{
  //     dispatch(setResponseSurvey({survey:{...res.data?.data,sections:res.data.data.sections.map((ques)=>({...ques,questions:JSON.parse(ques.questions)}))}}))
  //     dispatch(setLoading(false))
  //     setDetails(JSON.parse(res?.data?.data?.details))
  //   }).catch((err)=>{
  //     if(err?.response?.status !=401){
  //     toast(err?.response?.data?.Errors[0], {
  //       position: "top-center",
  //       autoClose: 4000,
  //       hideProgressBar: false,
  //       pauseOnHover: true,
  //       draggable: true,
  //       type:'error'
  //       });
  //     }
  //     dispatch(setLoading(false))
  //     dispatch(setApiErrorStatusCode(err?.response?.status))
  //   }).finally(()=>{
  //     dispatch(setLoading(false))
  //   })
  // },[])
  const Loader = () => {
    return (
      <Backdrop open={true}>
        <Heart />
      </Backdrop>
    );
  };
  const lang = sessionStorage.getItem('lang')
  const {t} = useTranslation()
  return (
    <div dir={lang==='ar'?"rtl":''}>
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box display={'flex'} >
          <Typography fontWeight={600}>{t('Type')} : </Typography>
          <Typography fontWeight={600}> &nbsp;{appState?.responseSurvey?.survey?.type}</Typography>
          </Box>
          <Box display={'flex'} mb={1}>
          <Typography fontWeight={600}>{t('Details')} : </Typography>
          <Typography fontWeight={600}>&nbsp;{appState?.responseSurvey?.survey?.details}</Typography>
          </Box>
          {/* <Typography fontWeight={600}>Description : {details?.description}</Typography> */}
          {location.pathname === "/survey/viewSurvey" ? (
            <Box
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginBottom: "10px",
              }}
            >
              <Button
                style={{
                  color: "#3487E5",
                  fontWeight: "bold",
                  textTransform: "none",
                  fontSize: "1.2rem",
                }}
                onClick={() => {
                  navigate("/survey/createSurvey");
                }}
              >
                {t('Create New Survey')}
              </Button>
            </Box>
          ) : (
            ""
          )}
          {/* <FixedSizeList height={1000} itemSize={9} itemCount={appState?.responseSurvey?.survey?.sections?.length}>
          {
            CommonAccordion 
          }
          </FixedSizeList> */}
          {appState?.responseSurvey?.survey?.sections?.map((_, index) => (
            <CommonAccordion
              memberIndex={index}
              key={index}
              // expanded={openAccordion === index ? true : false} onChange={() => handleAccordionChange(index)}
            />
          ))}
          {/* {memoizedMapQuestions} */}
          {/* <Box
            width={"100%"}
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
            height={"40px"}
            border={"1.5px solid #45AEAE"}
            padding={"23px 23px 23px 15px"}
            color={"#45AEAE"}
            style={{ cursor: "pointer" }}
            fontWeight={"bold"}
            onClick={() => {
              handleAdd();
            }}
          >
            <div>Add Section</div>
            <div style={{ fontSize: "22px" }}>+</div>
          </Box> */}

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
                navigate("/survey/viewSurvey");
              }}
            >
              {t('Back')}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
}

export default Sections;
