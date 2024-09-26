import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from '@mui/icons-material/Edit';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
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
  setSectionTitle
} from "../../../store/slices/app.tsx";
import Question from "./Question.jsx";
import { useTranslation } from "react-i18next";
import DoneIcon from '@mui/icons-material/Done';

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
    // borderBottom: 0,
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





const CommonAccordion = ({ memberIndex,...props  }) => {
  const dispatch = useDispatch();
  const location = useLocation()

  const appState = useSelector((state) => state?.app);
  const{t}=useTranslation()
  const handleRemove = (ind) => {
    dispatch(removeSection(ind));
    // toast('Section Removed Successfully', {
    //   position: "top-center",
    //   autoClose: 4000,
    //   hideProgressBar: false,
    //   pauseOnHover: true,
    //   draggable: true,
    //   type:'success'
    //   });
  };
  const [questionType, setQuestionType] = useState('');
   const handleChange =(e) =>{
    // setQuestionType(e.target.value);
    dispatch(addQuestion({
        index:memberIndex,
        quest:{
            "id": "",
            "required": true,
            "inputType": e.target.value,
            "caption": "",
            "values": []
        }
    }))
   }
   const[edit,SetEdit] = useState(false)
   const handleSave = () =>{
    let showToast = true;
    let optionToast = true;
    let addToast = true
    appState?.responseSurvey?.survey?.sections[memberIndex]?.questions?.map((quest)=>{
      if(!quest?.caption?.length && showToast){
        toast(t('Please Enter All Questions'), {
          position: "top-center",
          autoClose: 4000,
          hideProgressBar: false,
          pauseOnHover: true,
          draggable: true,
          type:'error'
          });
        showToast = false;
        return;
      }
     else if(quest?.caption?.length && quest.inputType==='dropDownMenu' || quest.inputType==='radiogroup' || quest.inputType==='checkBoxGroup'){
          if(!quest?.values.length && addToast){
            toast(t('Please Add Atleast One Option and Label'), {
              position: "top-center",
              autoClose: 4000,
              hideProgressBar: false,
              pauseOnHover: true,
              draggable: true,
              type:'error'
              });
              addToast = false
              return;
          }
          quest.values?.map(()=>{
            if((!quest?.label?.length || !quest?.option?.length)&&optionToast){
              toast(t('Please Enter Values for Option and Label'), {
                position: "top-center",
                autoClose: 4000,
                hideProgressBar: false,
                pauseOnHover: true,
                draggable: true,
                type:'error'
                });
                optionToast = false
            }
          })
          

      }
    })
   }
   const handleKeyDown = (event) => {
    if (event.keyCode === 13) {
      SetEdit(false)
    }
  };

  // useEffect(() => {
  //   document.addEventListener("keydown", handleKeyDown);
  //   return () => {
  //     document.removeEventListener("keydown", handleKeyDown);
  //   };
  // }, []);
  
  return (
    <div>
      <Accordion sx={{ mb: 1 }}
      //  {...props}
       >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
          
          sx={{ marginTop: "-2px", marginBottom: "-2px" }}
        >
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            width={"100%"}
            alignItems={"center"}
          >{edit ? <Box>
            <TextField size="small" value={appState.responseSurvey?.survey?.sections[memberIndex]?.title} onKeyDown={handleKeyDown} onChange={(e)=>{
            dispatch(setSectionTitle({
                index:memberIndex,
                message:e?.target?.value
            }));
            e.stopPropagation();
        }}
        onClick={(e)=>{ e.stopPropagation();}} 
        />
        <IconButton  onClick={(e)=>{
            e.stopPropagation();
            SetEdit(!edit);
        }}>{!edit ? <EditIcon />:<DoneIcon/>}</IconButton>
        </Box> : <Typography fontWeight={"bold"}>
              {appState.responseSurvey?.survey?.sections[memberIndex]?.title
                ? appState.responseSurvey?.survey?.sections[memberIndex]?.title
                : "Section Name"}
                <IconButton size="small" style={location.pathname === '/survey/viewSurvey/view' ? {display:'none'}:{}} onClick={(e)=>{
            e.stopPropagation();
            SetEdit(!edit);
        }}>{!edit ? <EditIcon />:<DoneIcon/>}</IconButton>
            </Typography>}
          </Box>
          <IconButton
            onClick={(e) => {
              handleRemove(memberIndex);
              e.stopPropagation();
            }}
            size="small"
            style={location.pathname === '/survey/viewSurvey/view' ? {display:'none'}:{}}
          >
            <DeleteIcon color="danger" />
          </IconButton>
        </AccordionSummary>
        <AccordionDetails>
          {location?.pathname === '/survey/viewSurvey/view' ? '' : 
         <Box style={{display:'flex',justifyContent:'flex-end'}}>
         <FormControl size="small">
  <InputLabel id="demo-simple-select-label">Add Question Type</InputLabel>
  <Select
    labelId="demo-simple-select-label"
    id="demo-simple-select"
    size="small"
    value={questionType}
    label="Add Question Type"
    sx={{
        width:'14rem'
    }}
    onChange={handleChange}
  >
    <MenuItem value={'editText'}>Edit Text</MenuItem>
    <MenuItem value={'dropDownMenu'}>Drop Down Menu</MenuItem>
    <MenuItem value={'radiogroup'}>Radio Group</MenuItem>
    <MenuItem value={'checkBoxGroup'}>Check Box Group</MenuItem>
    <MenuItem value={'date'}>Date Picker</MenuItem>
    <MenuItem value={'timePicker'}>Time Picker</MenuItem>
  </Select>
</FormControl>
         </Box>
         }
{appState?.responseSurvey?.survey?.sections?.[memberIndex]?.questions?.map((val,index)=>(
    <Question key={index} type={questionType} sectionIndex={memberIndex} questionIndex={index} />
))}  
{appState?.responseSurvey?.survey?.sections?.[memberIndex]?.questions?.length ? <Box
              display={"flex"}
              justifyContent={{ md: "flex-end", xs: "center" }}
            >
               {location?.pathname === '/survey/viewSurvey/view' ? '' : 
              <Button
                variant="contained"
                style={{
                  color: "white",
                  width: "80px",
                  color: "black",
                  border: "1.5px solid black",
                  borderRadius: "8px",
                  marginTop:'20px'
                }}
                color="white"
                type="submit"
                onClick={()=>{
                  handleSave()
                }}
              >
                Save
              </Button>}
            </Box>:""}
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default CommonAccordion;
