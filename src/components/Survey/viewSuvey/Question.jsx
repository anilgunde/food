import { Delete } from '@mui/icons-material';
import AddIcon from '@mui/icons-material/Add';
import { Box, Grid, IconButton, TextField as MuiTextField , Typography } from '@mui/material';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { addValues, removeOption, removeQuestion, setOptionsLabel, setOptionsOption, setQuestionTitle } from '../../../store/slices/app.tsx';
import createCache from "@emotion/cache";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import { useTranslation } from 'react-i18next';
import { t } from 'i18next';
import styled from '@emotion/styled';



const TextField = styled(MuiTextField)(({ theme }) => ({
}));



const Option =({...props})=>{
    const dispatch = useDispatch()
    const appState = useSelector((state) => state?.app);
    const location = useLocation()
    const cacheRtl = createCache({
        key: "muirtl",
        stylisPlugins: [prefixer, rtlPlugin],
      });
      const cacheLtr = createCache({
        key: 'mui-ltr',
        stylisPlugins: [prefixer],
      });
      const lang = sessionStorage.getItem('lang')
    return(
        <Grid container>
            {/* <CacheProvider value={lang==='ar'?cacheRtl:cacheLtr}> */}
            <Grid item lg={3}>
            <TextField disabled style={{'marginTop':'10px'}}sx={lang==='ar'?{
            "& label": {
              left: "unset",
              right: "1.75rem",
              transformOrigin: "right",
              fontSize: "1rem",
              marginTop:'-0.15rem'
            },
            "& legend": {
              textAlign: "right",
              fontSize: "0.75rem",
              paddingBottom:'0.2rem'
            }}:{}} value={appState?.responseSurvey?.survey?.sections?.[props.secindex]?.questions?.[props.questindex].values?.[props.valindex]?.label} {...props} label={t('Label')} onChange={(e)=>{
                dispatch(setOptionsLabel({
                    secIndex:props.secindex,
                    questIndex:props.questindex,
                    valIndex:props.valindex,
                    message:e.target.value
                }))
            }}/>
            </Grid>
            <Grid item lg={3} display={'flex'}>
            <TextField disabled style={{'marginTop':'10px'}} sx={lang==='ar'?{
            "& label": {
              left: "unset",
              right: "1.75rem",
              transformOrigin: "right",
              fontSize: "1rem",
              marginTop:'-0.15rem'
            },
            "& legend": {
              textAlign: "right",
              fontSize: "0.75rem",
              paddingBottom:'0.2rem'
            }}:{}} {...props} value={appState?.responseSurvey?.survey?.sections?.[props.secindex]?.questions?.[props.questindex]?.values?.[props.valindex]?.option} label={t('Option')}
            onChange={(e)=>{
                dispatch(setOptionsOption({
                    secIndex:props.secindex,
                    questIndex:props.questindex,
                    valIndex:props.valindex,
                    message:e.target.value
                }))
            }}
            />
            <IconButton onClick={()=>{
                dispatch(removeOption({
                    secIndex:props.secindex,
                    questIndex:props.questindex,
                    valIndex:props.valindex,
                }))
            }} color="danger" style={location.pathname === '/survey/viewSurvey/view' ? {display:'none'}:{}}><Delete/></IconButton>
            </Grid>
            {/* </CacheProvider> */}
        </Grid>
    )
}

const Question = (props) => {
    const {sectionIndex,questionIndex} = props
    const appState = useSelector((state) => state?.app);
    const dispatch = useDispatch()
    const location = useLocation()
    const cacheRtl = createCache({
        key: "muirtl",
        stylisPlugins: [prefixer, rtlPlugin],
      });
      const cacheLtr = createCache({
        key: 'mui-ltr',
        stylisPlugins: [prefixer],
      });
      const lang = sessionStorage.getItem('lang')
      const {t} = useTranslation()
        return (
            <Box style={{border:'1px solid rgba(0,0,0,0.5)'}} padding={'1rem'} margin={'1rem 0rem'}>
                 {/* <CacheProvider value={lang==='ar'?cacheRtl:cacheLtr}> */}
                <Typography margin={'0px 0px 10px 0px'} fontWeight={'bold'} >{questionIndex + 1}. &nbsp;{t(appState?.responseSurvey?.survey?.sections?.[sectionIndex]?.questions?.[questionIndex]?.inputType?.replace(/([a-z])([A-Z])/g, '$1 $2') // Add space before each capital letter
    .toLowerCase() // Convert the entire string to lowercase
    .replace(/(?:^|\s)\S/g, match => match.toUpperCase()))}</Typography>
            <Box style={{display:'flex',justifyContent:'center'}} >
            <TextField sx={lang==='ar'?{
            "& label": {
              left: "unset",
              right: "1.75rem",
              transformOrigin: "right",
              fontSize: "1rem",
              marginTop:'-0.15rem'
            },
            "& legend": {
              textAlign: "right",
              fontSize: "0.75rem",
              paddingBottom:'0.2rem'
            }}:{}} label={t('Question')} disabled value={appState?.responseSurvey?.survey?.sections?.[sectionIndex]?.questions?.[questionIndex]?.caption} fullWidth onChange={(e)=>{
                dispatch(setQuestionTitle({
                    index:sectionIndex,
                    questIndex:questionIndex,
                    message:e.target.value
                }))
            }}/>
            
            {/* <IconButton onClick={()=>{
                SetEdit(!edit)
            }}><EditIcon/></IconButton> */}
            <IconButton onClick={()=>{
                dispatch(removeQuestion({
                    secIndex:sectionIndex,
                    questIndex:questionIndex,
                }))
            }} color="danger" style={location.pathname === '/survey/viewSurvey/view' ? {display:'none'}:{}}><Delete/></IconButton>
            </Box>
            <Box>
            {appState?.responseSurvey?.survey?.sections?.[sectionIndex]?.questions?.[questionIndex]?.inputType === 'dropDownMenu' ||  appState?.responseSurvey?.survey?.sections?.[sectionIndex]?.questions?.[questionIndex]?.inputType === 'radiogroup' || appState?.responseSurvey?.survey?.sections?.[sectionIndex]?.questions?.[questionIndex]?.inputType === 'checkBoxGroup'?<>
            
            {appState?.responseSurvey?.survey?.sections?.[sectionIndex]?.questions?.[questionIndex]?.values?.map((vals,index)=>(
                <Option size='small' option={vals.option} label={vals.label} key={index} valindex={index} secindex={sectionIndex} questindex={questionIndex} />
            ))}
            <IconButton style={location.pathname === '/survey/viewSurvey/view' ? {display:'none'}:{}} onClick={()=>{
                    dispatch(addValues({
                        secIndex:sectionIndex,
                        index:questionIndex,
                        opts:{
                            option: "",
                            label: "",
                        }
                    }))
                }}><AddIcon/></IconButton>
            </>:''}
            </Box>
            {/* </CacheProvider> */}
            </Box>
        )
  
}

export default Question