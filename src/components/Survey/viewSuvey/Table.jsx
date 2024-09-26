import { Box, Button, IconButton, ThemeProvider, styled } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import list from "../../../assets/list.svg";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import MuiTableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import axios from "../../../api/axios";
import { useDispatch, useSelector } from "react-redux";
import Edit from "@mui/icons-material/Edit";
import Delete from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import { setApiErrorStatusCode, setLoading, setResponseSurvey, setSection, setSurvey, setViewSection } from "../../../store/slices/app.tsx";
import { Visibility } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import {createTheme} from '@mui/material'
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
const TableCell = styled((props) => <MuiTableCell {...props} />)(
  ({ theme }) => ({
    borderBottom: "1.5px solid #CECECE",
  })
);

const SurveyTable = () => {
  const navigate = useNavigate();
  const lang = sessionStorage.getItem('lang')
  function createData(name, code, population, size) {
    const density = population / size;
    return { name, code, population, size, density };
  }
  const dispatch = useDispatch()
  const appState = useSelector((state) => state?.app);
  const [sections, setSections] = useState([]);
  const call =()=>{ axios
  .get(
    "/api/survey/getAllSurveys",
    {
      headers: { authorization: `Bearer ${appState?.accessToken}` },
    //   params: { pageNumber: page + 1, pageSize: rowsPerPage },
    },
    
  )
  .then((res) => {
    console.log(res?.data);
    setSections(res?.data?.data);
  }).catch((err)=>{
    if(err?.response?.status !=401){
      toast(err?.response?.data?.Errors[0], {
        position: "top-center",
        autoClose: 4000,
        hideProgressBar: false,
        pauseOnHover: true,
        draggable: true,
        type: "error",
      });
    }
    
    dispatch(setApiErrorStatusCode(err?.response?.status))
  })
}

  useEffect(() => {
    call();
  }, []);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

const handleDelete =(id)=>{
  axios.delete(`/api/survey/deleteSection/${id}`,{
    headers:{authorization: `Bearer ${appState?.accessToken}`}
  }).then((res)=>{
    if(res?.data?.isSuccess===true){
      toast(t("Section Deleted Successfully"), {
        position: "top-center",
        autoClose: 4000,
        hideProgressBar: false,
        pauseOnHover: true,
        draggable: true,
        type: "success",
      });
      call();
    }
  }).catch((err)=>{
    if(err?.response?.status !=401){
    toast(`${err?.response?.data?.Errors[0]}`, {
      position: "top-center",
      autoClose: 4000,
      hideProgressBar: false,
      pauseOnHover: true,
      draggable: true,
      type: "error",
    })
  }
  
    dispatch(setApiErrorStatusCode(err?.response?.status))
  })
}
const handleEdit = (id)=>{
  navigate(`/survey/viewSurvey/view?id=${id}`)
  dispatch(setLoading(true))
    setTimeout(()=>{
    axios.get(`/api/survey/getSurvey/${id}`,{
        headers:{authorization:`Bearer ${appState?.accessToken}`}
      }).then((res)=>{
        dispatch(setLoading(false))
        dispatch(setResponseSurvey({survey:{...res.data?.data,sections:res.data.data.sections.map((ques)=>({...ques,questions:JSON.parse(ques.questions)}))}}))
      }).catch((err)=>{
        if(err?.response?.status !=401){
        toast(err?.response?.status =='500' ? 'error' :err?.response?.data?.Errors[0] , {
          position: "top-center",
          autoClose: 4000,
          hideProgressBar: false,
          pauseOnHover: true,
          draggable: true,
          type:'error'
          });
        }
        dispatch(setApiErrorStatusCode(err?.response?.status))
        dispatch(setLoading(false))
      })
        dispatch(setSection());
    },100)
    
}
const { t } = useTranslation();
  return (
    <Paper style={{ overflowY: "hidden", marginBottom: "10px" }}>
      <div dir={lang==='ar'?"rtl":''}>
      <Box
        padding={"10px 20px"}
        style={{ borderBottom: "1.5px solid #CECECE" }}
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Box fontWeight={"bold"} fontSize={"1.3rem"}>
        {t('Survey list')}
        </Box>

        {/* <Button
          size="small"
          style={{
            color: "#3487E5",
            fontWeight: "bold",
            textTransform: "none",
            fontSize: "1.2rem",
          }}
          onClick={() => {
            navigate("/survey/createSurvey");
            // dispatch(setSection())
          }}
        >
          {t('Add New Survey')}
        </Button> */}
      </Box>
      </div>
      <div dir={lang==='ar'?"rtl":''}>
      <TableContainer style={{maxHeight:'calc(100vh - 200px)'}}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell align={'center'} style={{ fontWeight: "bold", fontSize: "1rem" }}>
              {t('Survey ID')}
              </TableCell>
              <TableCell align={lang==='ar'?"right":'left'} style={{ fontWeight: "bold", fontSize: "1rem" }}>
              {t('Type')}
              </TableCell>
              <TableCell align={lang==='ar'?"right":'left'} style={{ fontWeight: "bold", fontSize: "1rem" }}>
              {t('Details')}
              </TableCell>
              <TableCell align={lang==='ar'?"right":'left'} style={{ fontWeight: "bold", fontSize: "1rem" }}>
              {t('Created by')}
              </TableCell>
              {/* <TableCell style={{ fontWeight: "bold", fontSize: "1rem" }}>
                Updated By
              </TableCell> */}
              <TableCell align={'center'} style={{ fontWeight: "bold", fontSize: "1rem" }}>
              {t('No of sections')}
              </TableCell>
              {/* <TableCell style={{ fontWeight: "bold", fontSize: "1rem" }}>
                Last Name
              </TableCell>
              <TableCell style={{ fontWeight: "bold", fontSize: "1rem" }}>
                Email
              </TableCell>
              <TableCell style={{ fontWeight: "bold", fontSize: "1rem" }}>
                Phone Number
              </TableCell>
              <TableCell style={{ fontWeight: "bold", fontSize: "1rem" }}>
                Role(s)
              </TableCell> */}
               <TableCell align={lang==='ar'?"right":'left'} style={{ fontWeight: "bold", fontSize: "1rem" }}>
               {t('View')}
              </TableCell>
              {/*<TableCell style={{ fontWeight: "bold", fontSize: "1rem" }}>
                Delete
              </TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
              ? sections?.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                )
              : sections
            ).map((user, index) => (
              <TableRow key={index}>
                <TableCell align={'center'}>{user?.id}</TableCell>
                <TableCell align={lang==='ar'?"right":'left'}>{user?.type}</TableCell>
                <TableCell align={lang==='ar'?"right":'left'}>{user?.details}</TableCell>
                <TableCell align={lang==='ar'?"right":'left'}>{user?.createdBy}</TableCell>
                {/* <TableCell>{user?.updatedBy}</TableCell> */}
                <TableCell  align='center'>{user?.sections?.length}</TableCell>
                {/* <TableCell>{user?.lastName}</TableCell>
                <TableCell>{user?.email}</TableCell>
                <TableCell>{user?.phoneNumber}</TableCell>
                <TableCell>{userRoles?.filter(roles=>user?.roles?.includes(roles.id)).map((roles,index)=>(index===0 ? roles.roleName:', ' + roles.roleName))}</TableCell> */}
                 <TableCell align={lang==='ar'?"right":'left'}><IconButton size="small" onClick={()=>{ handleEdit(user?.id)}}><Visibility color="primary"/></IconButton></TableCell>
                {/*<TableCell><IconButton size="small" onClick={()=>{handleDelete(user?.id)}}><Delete/></IconButton></TableCell> */}
              </TableRow>
            ))}

              {!sections?.length && (
                      <TableRow
                      >
                        <TableCell colSpan={9} align="center" style={{padding:'20px',fontWeight:'bold',fontSize:'1.1rem'}}>{t('No data found')}</TableCell>
                      </TableRow>
                    )}
          </TableBody>
        </Table>
      </TableContainer>
      </div>
      {/* <div dir={lang==='ar'?"rtl":''}> */}
      <CacheProvider value={cacheRtl}>
              <ThemeProvider theme={lang === "ar" ? themeRtl : themeLtr}>
                <div dir={lang==='ar'?"rtl":''}>
      <TablePagination
        rowsPerPageOptions={[10,25,100]}
        component="div"
        sx={{
          ".MuiInputBase-root": {
            marginTop: "-14px",
            marginRight: "5px",
          },
          ".MuiTablePagination-toolbar": {
            color: "rgb(41, 39, 39)",
            height: "35px",
          },
          ".MuiBox-root": {
            color: "black",
            "& .MuiSvgIcon-root": {
              color: "black",
            },
          },
          ".MuiTablePagination-actions": {
            marginTop: "-12px",
            marginLeft: "2px",
          },
          marginTop: "10px",
          marginBottom: "-10px",
        }}
        count={sections.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage={t("Rows Per Page")}
                labelDisplayedRows={({ from, to, count }) => (lang === "ar" ?`${to}-${from} من ${count}`:`${from}-${to} of ${count}`)}
      />
      </div>
              </ThemeProvider>
              </CacheProvider>
      {/* </div> */}
    </Paper>
  );
};

export default SurveyTable;
