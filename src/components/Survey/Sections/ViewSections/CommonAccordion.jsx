import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from '@mui/icons-material/Edit';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Box,
  
  FormControl,
  IconButton,
  InputLabel,
  MenuItem as MuiMenuItem,
  Select,
  TextField
} from "@mui/material";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import makeStyles from "@mui/styles/makeStyles";
import * as React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import {
  addQuestion,
  removeSection,
  setAdultStatus,
  setGenderStatus,
  setLabelNum,
  setOptionNum,
  setSectionAndQuestionNum,
  setSectionNumber,
  setSectionTitle
} from "../../../../store/slices/app.tsx";
import Question from "../ViewSections/Question.jsx";
import { useTranslation } from "react-i18next";
import DoneIcon from '@mui/icons-material/Done';
import createCache from "@emotion/cache";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
const useStyles = makeStyles(() => ({
  input: {
    border: "1px solid #C1C1C1",
    borderRadius: "5px",
    outline: "none",
  },
  focused: {
    // background: "red"
    border: "none",
  },
}));

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1.5px solid #45AEAE`,
  "&:not(:last-child)": {
   
  },
  "&:before": {
    display: "none",
  },
  marginBottom:'6px',
    '&.Mui-expanded':{
      '&.MuiAccordion-root':{marginBottom:'6px'}
    }
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
  '&:focus-within':{
    backgroundColor: "transparent"
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  // padding: theme.spacing(2,6,3,5),
  // borderTop: '1px solid rgba(0, 0, 0, .125)',
}));



const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});
const cacheLtr = createCache({
  key: 'mui-ltr',
  stylisPlugins: [prefixer],
});

const CommonAccordion = ({ memberIndex,errorIndex,...props }) => {
  const dispatch = useDispatch();
  const location = useLocation()

  const appState = useSelector((state) => state?.app);

 
  const [questionType, setQuestionType] = useState('');
   const handleChange =(e) =>{
  
    if(e.target.value === 'dropDownMenu' || e.target.value === 'checkBoxGroup' || e.target.value === 'radiogroup'){
      dispatch(addQuestion({
        index:memberIndex,
        quest:{
            "id": "",
            "required": true,
            "inputType": e.target.value,
            "caption": "",
            "values": [{
              option:'',
              label:'',
              next:''
            }]
        }
    }))
    return;
    }
    
    dispatch(addQuestion({
        index:memberIndex,
        quest:{
            "id": "",
            "required": true,
            "inputType": e.target.value,
            "caption": "",
            "values": [{
              next:''
            }]
        }
    }))
   }
   const handleChange1 = (e)=>{
    dispatch(setAdultStatus({
      secIndex:memberIndex,
      message:e.target.value
    }))
 }
 const handleChange2 = (e)=>{
  dispatch(setGenderStatus({
    secIndex:memberIndex,
    message:e.target.value
  }))
 }
   const[edit,SetEdit] = useState(false)
   
  


  const lang = sessionStorage.getItem('lang')
  const { t } = useTranslation();
  const MenuItem = styled((props) => (
    <div dir={lang==='ar' ? "rtl":''}><MuiMenuItem {...props}/></div>
  ))(({ theme }) => ({}));
  return (
    <div>
      <Accordion  {...props}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
          sx={{ marginTop: "-10px", marginBottom: "-10px" }}
        >
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            width={"100%"}
            alignItems={"center"}
          >{edit ? <Box>
            <TextField size="small" value={appState?.survey?.survey?.sections[memberIndex]?.title} 
            // onKeyDown={handleKeyDown} 
            onChange={(e)=>{
            dispatch(setSectionTitle({
                index:memberIndex,
                message:e?.target?.value
            }));
            e.stopPropagation();
        }}
        onClick={(e)=>{ e.stopPropagation();}} 
        />
        <IconButton disabled size="small" onClick={(e)=>{
            e.stopPropagation();
            SetEdit(!edit);
        }}>{!edit ? <EditIcon />:<DoneIcon/>}</IconButton>
        </Box> : <Typography fontWeight={"bold"}>
              {appState?.survey?.survey?.sections[memberIndex]?.title
                ? appState?.survey?.survey?.sections[memberIndex]?.title
                : `${t('Section')}`}
                <IconButton disabled  onClick={(e)=>{
            e.stopPropagation();
            SetEdit(!edit);
        }}>{!edit ? <EditIcon />:<DoneIcon/>}</IconButton>
            </Typography>}
          </Box>
          {/* <IconButton
            onClick={(e) => {
              handleRemove(memberIndex);
              e.stopPropagation();
            }}
            size="small"
          >
            <DeleteIcon color="danger" />
          </IconButton> */}
        </AccordionSummary>
        <AccordionDetails>
        <CacheProvider value={lang==='ar'?cacheRtl:cacheLtr}>
         <Box style={{display:'flex',justifyContent:'flex-end',gap:'10px',flexWrap:'wrap'}}>
         <FormControl size="small" >
  <InputLabel id="demo-simple-select-label">{t('Add Question Type')}</InputLabel>
  <Select
    labelId="demo-simple-select-label"
    id="demo-simple-select"
    size="small"
    disabled
    value={questionType}
    label={t('Add Question Type')}
    sx={{
        width:'14rem'
    }}
    onChange={handleChange}
  >
    <MenuItem value={'editText'}>{t('Edit Text')}</MenuItem>
    <MenuItem value={'dropDownMenu'}>{t('Drop Down Menu')}</MenuItem>
    <MenuItem value={'radiogroup'}>{t('Radio Group')}</MenuItem>
    <MenuItem value={'checkBoxGroup'}>{t('Check Box Group')}</MenuItem>
    <MenuItem value={'date'}>{t('Date Picker')}</MenuItem>
    <MenuItem value={'timePicker'}>{t('Time Picker')}</MenuItem>
  </Select>
</FormControl>
<div dir={lang==='ar'?"rtl":''}>
         <FormControl size="small" >
  <InputLabel id="demo-simple-select-label">{t('Select Age Status')}</InputLabel>
  <Select
    labelId="demo-simple-select-label"
    id="demo-simple-select"
    disabled
    size="small"
    value={appState.survey.survey.sections[memberIndex]?.conditions[0]?.adult_status}
    label={t('Select Age Status')}
    sx={{
        width:'14rem'
    }}
    onChange={handleChange1}
  >
    <MenuItem value={"1"}>{t('Adult')}</MenuItem>
    <MenuItem value={"2"}>{t('Child')}</MenuItem>
    <MenuItem value={"0"}>{t('All')}</MenuItem>
  </Select>
</FormControl>
</div>
         <div dir={lang==='ar'?"rtl":''}>
         <FormControl size="small"  >
  <InputLabel id="demo-simple-select-label">{t('Select Gender Status')}</InputLabel>
  <Select
  disabled
    labelId="demo-simple-select-label"
    id="demo-simple-select"
    size="small"
    value={appState.survey.survey.sections[memberIndex]?.conditions[0]?.gender_status}
    label={t('Select Gender Status')}
    sx={{
        width:'14rem'
    }}
    onChange={handleChange2}
  >
    <MenuItem value={"1"}>{t('Male')}</MenuItem>
    <MenuItem value={"2"}>{t('Female')}</MenuItem>
    <MenuItem value={"0"}>{t('All')}</MenuItem>
  </Select>
</FormControl>
</div>
         </Box>
{appState?.survey?.survey?.sections?.[memberIndex]?.questions?.map((val,index)=>(
    <Question key={index} type={questionType} sectionIndex={memberIndex} questionIndex={index} error={true}/>
))}  
{appState?.survey?.survey?.sections?.[memberIndex]?.questions?.length ? <Box
              display={"flex"}
              justifyContent={{ md: "flex-end", xs: "center" }}
            >
             
            </Box>:""}
            </CacheProvider>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default CommonAccordion;
