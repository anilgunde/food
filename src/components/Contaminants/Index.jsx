import { Box, Button, IconButton, TextField, ThemeProvider, Tooltip, styled } from "@mui/material";
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
import axios from "../../api/axios";
import { useDispatch, useSelector } from "react-redux";
import Edit from "@mui/icons-material/Edit";
import Delete from "@mui/icons-material/Delete";
import { toast } from "react-toastify";
import { setApiErrorStatusCode } from "../../store/slices/app.tsx";
import { useTranslation } from "react-i18next";
import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import {createTheme} from '@mui/material'
import { Visibility } from "@mui/icons-material";
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

const Index = () => {
  const navigate = useNavigate();

  function createData(name, code, population, size) {
    const density = population / size;
    return { name, code, population, size, density };
  }
  const dispatch = useDispatch()
  const appState = useSelector((state) => state?.app);
  const [searchValue,setSearchValue] = useState('')
  const [users, setUsers] = useState([]);
  const [response, setResponse] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const call =()=>{ axios
  .get(
    "/api/food/contaminants",
    {
      headers: { authorization: `Bearer ${appState?.accessToken}` },
      params: { pageNumber: page + 1, pageSize: rowsPerPage },
    },
  )
  .then((res) => {
    setUsers(res?.data?.data?.items);
    setResponse(res?.data?.data);
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
useEffect(()=>{
  
  if(searchValue?.length){
    const debounce = setTimeout(()=>{
    setPage(0)
      axios
      .get(
        "/api/food/contaminants",
        {
          headers: { authorization: `Bearer ${appState?.accessToken}` },
          params:{search:searchValue}
        }).then((res) => {
        // console.log(res?.data);
        setUsers(res?.data?.data?.items);
        setResponse(res?.data?.data);
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
    },500)
  
    return()=>{
      clearTimeout(debounce)
    }
  }
  },[page,rowsPerPage,searchValue])
const [userRoles, setUserRoles] = useState([]);

  useEffect(() => {
    if(searchValue===''){
      axios
    .get(
      "/api/food/contaminants",
      {
        headers: { authorization: `Bearer ${appState?.accessToken}` },
        params: { pageNumber: page+1, pageSize: rowsPerPage },
      },
    )
    .then((res) => {
      // console.log(res?.data);
      setUsers(res?.data?.data?.items);
      setResponse(res?.data?.data);
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
      return;
    }
  }, [page,rowsPerPage,searchValue]);

  // useEffect(() => {
  //   axios({
  //     method: "get",
  //     url: `/api/user/getUserRoles`,
  //     headers: {
  //       "Content-Type": "application/json",
  //       authorization: `Bearer ${appState?.accessToken}`,
  //     },
  //   }).then((res) => {
  //     setUserRoles(res?.data?.data);
  //   }).catch((err)=>{
  //     if(err?.response?.status != 401){
  //     toast(`${err?.response?.data?.Errors[0]}`, {
  //       position: "top-center",
  //       autoClose: 4000,
  //       hideProgressBar: false,
  //       pauseOnHover: true,
  //       draggable: true,
  //       type: "error",
  //     });
  //   }
  //     dispatch(setApiErrorStatusCode(err?.response?.status))
  //   })
  // }, []);


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    // console.log(newPage)
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
// const handleDelete =(id)=>{
//   axios.delete(`/api/user/deleteUser/${id}`,{
//     headers:{authorization: `Bearer ${appState?.accessToken}`}
//   }).then((res)=>{
//     if(res?.data?.isSuccess===true){
//       toast(t("User Deleted Successfully"), {
//         position: "top-center",
//         autoClose: 4000,
//         hideProgressBar: false,
//         pauseOnHover: true,
//         draggable: true,
//         type: "success",
//       });
//       call();
//     }
//   }).catch((err)=>{
//     if(err?.response?.status !=401){
//     toast(`User cannot be deleted as he is assigned to conduct surveys`, {
//       position: "top-center",
//       autoClose: 4000,
//       hideProgressBar: false,
//       pauseOnHover: true,
//       draggable: true,
//       type: "error",
//     })
//   }
//     dispatch(setApiErrorStatusCode(err?.response?.status))
//   })
// }
// const handleKeyDown = (event) => {
//   switch (event.key) {
//     case 'ArrowLeft':
//       setPage((prevPage) => Math.max(prevPage - 1, 0));
//       break;
//     case 'ArrowRight':
//       setPage((prevPage) => Math.min(prevPage + 1, Math.ceil(users.length / rowsPerPage) - 1));
//       break;
//     default:
//       break;
//   }
// };
const lang = sessionStorage.getItem('lang')
const {t} = useTranslation()
  return (
    <Paper 
    style={{ overflowY: "hidden", marginBottom: "10px" }}>
       <div dir={lang==='ar'?"rtl":''}>
      <Box
        padding={"10px 20px"}
        style={{ borderBottom: "1.5px solid #CECECE" }}
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Box fontWeight={"bold"} fontSize={"1.3rem"}>
        {t('Contaminant list')}
        </Box>
      <Box display={"flex"}
                alignItems={"center"}>
                <TextField
                size="small" 
                placeholder={t('Search...')}
                value={searchValue}
                onChange={(e)=>{setSearchValue(e?.target?.value)}}
                />
                {
                appState?.roleinfo?.role === 'Recruiter'||appState?.roleinfo?.role === 'Interviewer'|| appState?.roleinfo?.role === 'Recruiter' && appState?.roleinfo?.role === 'Interviewer'?<></>:<> <Button
                  size="small"
                  style={{
                    color: "#3487E5",
                    fontWeight: "bold",
                    textTransform: "none",
                    fontSize: "1.2rem",
                  }}
                  onClick={() => {
                    navigate("/contaminants/AddContaminants");
                  }}
                >
                  {t('Add New Contaminant')}
                </Button></>
                }
               
      </Box>
        
      </Box>
      </div>
      <div dir={lang==='ar'?"rtl":''}>
      <TableContainer style={{maxHeight:'calc(100vh - 200px)'}}>
      
        <Table stickyHeader size="small" >
          <TableHead >
            <TableRow style={{whiteSpace:'nowrap'}}>
              <TableCell align={lang==='ar'?"right":"left"}  style={{ fontWeight: "bold", fontSize: "1rem" }}>
              {t('Contaminant Id')}
              </TableCell>
              <TableCell align={lang==='ar'?"right":"left"} style={{ fontWeight: "bold", fontSize: "1rem" }}>
              {t('Contaminant name')}
              </TableCell>
              <TableCell align={lang==='ar'?"right":"left"} style={{ fontWeight: "bold", fontSize: "1rem" }}>
              {t('ContaminantNameArabic')}
              </TableCell>
              {/* <TableCell align={lang==='ar'?"right":"left"} style={{ fontWeight: "bold", fontSize: "1rem" }}>
              {t('UnitOfMeasureId')}
              </TableCell> */}
              <TableCell align={lang==='ar'?"right":"left"} style={{ fontWeight: "bold", fontSize: "1rem" }}>
              {t('UnitOfMeasure Name')}
              </TableCell>
              {/* <TableCell align={lang==='ar'?"right":"left"} style={{ fontWeight: "bold", fontSize: "1rem" }}>
              {t('UnitOfMeasure NameArabic')}
              </TableCell>
              <TableCell align={lang==='ar'?"right":"left"} style={{ fontWeight: "bold", fontSize: "1rem" }}>
              {t('Description')}
              </TableCell> */}

              {/* <TableCell align={lang==='ar'?"right":"left"} style={{ fontWeight: "bold", fontSize: "1rem" }}>
              {t('Description Arabic')}
              </TableCell> */}

              {/* <TableCell align={lang==='ar'?"right":"left"} style={{ fontWeight: "bold", fontSize: "1rem" }}>
              {t('UiDisplay')}
              </TableCell> */}

              {/* <TableCell align={lang==='ar'?"right":"left"} style={{ fontWeight: "bold", fontSize: "1rem" }}>
              {t('ContaminantClassificationName')}
              </TableCell>

              <TableCell align={lang==='ar'?"right":"left"} style={{ fontWeight: "bold", fontSize: "1rem" }}>
              {t('ContaminantClassificationNameArabic')}
              </TableCell> */}
              {/* {
                 appState?.roleinfo?.role === 'Recruiter'||appState?.roleinfo?.role === 'Interviewer'||appState?.roleinfo?.role === 'Recruiter' && appState?.roleinfo?.role === 'Interviewer'?<></>:<>
                 <TableCell align={lang==='ar'?"right":"left"} style={{ fontWeight: "bold", fontSize: "1rem" }}>
              {t('Edit')}
              </TableCell>
              <TableCell align={lang==='ar'?"right":"left"} style={{ fontWeight: "bold", fontSize: "1rem" }}>
              {t('Delete')}
              </TableCell>
                </>
              } */}
              {/* <TableCell align={lang==='ar'?"right":"left"} style={{ fontWeight: "bold", fontSize: "1rem" }}>
              {t('View')}
              </TableCell> */}
             
            </TableRow>
          </TableHead>
          <TableBody>
            {(
              // rowsPerPage > 0
              // ? users?.slice(
              //     page * rowsPerPage,
              //     page * rowsPerPage + rowsPerPage
              //   )
              // : 
              users
            ).map((user, index) => (
              <TableRow key={index}>
                <TableCell align={'center'}>{user?.contaminantId}</TableCell>
                <TableCell align={lang==='ar'?"right":"left"}>{user?.contaminantName}</TableCell>
                <TableCell align={lang==='ar'?"right":"left"}>{user?.contaminantNameArabic}</TableCell>
                {/* <TableCell align={lang==='ar'?"right":"left"}>{user?.unitOfMeasureId}</TableCell> */}
                <TableCell align={lang==='ar'?"right":"left"}>{user?.unitOfMeasure?.name}</TableCell>
                {/* <TableCell align={lang==='ar'?"right":"left"}>{user?.unitOfMeasure?.nameArabic}</TableCell>
                <TableCell align={lang==='ar'?"right":"left"}>{user?.unitOfMeasure?.description}</TableCell> */}

                {/* <TableCell align={lang==='ar'?"right":"left"}>{user?.uiDisplay}</TableCell> */}
                {/* <TableCell align={lang==='ar'?"right":"left"}>{user?.unitOfMeasure?.descriptionArabic}</TableCell>
                <TableCell align={lang==='ar'?"right":"left"}>{user?.contaminantClassification?.contaminantClassificationName}</TableCell>
                <TableCell align={lang==='ar'?"right":"left"}>{user?.contaminantClassification?.contaminantClassificationNameArabic}</TableCell> */}
                {/* <TableCell>{userRoles?.filter(roles=>user?.roles?.includes(roles.id)).map((roles,index)=>(index===0 ? roles.roleName:', ' + roles.roleName))}</TableCell> */}
                {/* { appState?.roleinfo?.role === 'Recruiter'||appState?.roleinfo?.role === 'Interviewer' || appState?.roleinfo?.role === 'Recruiter'  && appState?.roleinfo?.role === 'Interviewer' ?<></>:<>
                  <TableCell align={lang==='ar'?"right":"left"}><IconButton size="small" onClick={()=>{navigate(`/userManagement/updateUser?id=${user?.id}`)}}><Tooltip title={t('Edit')}><Edit/></Tooltip></IconButton></TableCell>
                  <TableCell align={lang==='ar'?"right":"left"}><IconButton size="small" onClick={()=>{handleDelete(user?.id)}}><Tooltip title={t('Delete')}><Delete/></Tooltip></IconButton></TableCell>
                </>
                
                } */}

                {/* <TableCell align={lang==='ar'?"right":"left"}>
                            <IconButton onClick={()=>{navigate(`/contaminants/ViewContaminant?id=${user?.contaminantId}`)}}>
                              <Tooltip title={t('View')}>
                                <Visibility color="primary"/>
                              </Tooltip>
                              </IconButton>
                </TableCell> */}
               
              </TableRow>
            ))}

              {!users?.length && (
                      <TableRow
                      >
                        <TableCell colSpan={9} align="center" style={{padding:'20px',fontWeight:'bold',fontSize:'1.1rem'}}>{t('No data found')}</TableCell>
                      </TableRow>
                    )}
          </TableBody>
        </Table>
      </TableContainer>
      </div>
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
        count={response?.totalCount || 10}
        rowsPerPage={rowsPerPage}
        page={page}
        labelRowsPerPage={t("Rows Per Page")}
                labelDisplayedRows={({ from, to, count }) => (lang === "ar" ?`${to}-${from} من ${count}`:`${from}-${to} of ${count}`)}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      </div>
              </ThemeProvider>
              </CacheProvider>
    </Paper>
  );
};

export default Index;
