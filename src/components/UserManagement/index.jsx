import { Box, Button, Dialog, DialogActions, DialogContent, IconButton, TextField, ThemeProvider, Tooltip, Typography, styled } from "@mui/material";
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
const themeRtl = createTheme({
  direction: "rtl" 
});
const themeLtr = createTheme({
  direction: "ltr"
});

const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin]
});
const TableCell = styled((props) => <MuiTableCell {...props} />)(
  ({ theme }) => ({
    borderBottom: "1.5px solid #CECECE",
  })
);

const UserManagement = () => {
  const navigate = useNavigate();

 
  const dispatch = useDispatch()
  const appState = useSelector((state) => state?.app);
  const [searchValue,setSearchValue] = useState('')
  const [users, setUsers] = useState([]);
  const [response, setResponse] = useState({});
  const [page, setPage] = useState(() => {
   
    return parseInt(sessionStorage.getItem('userPageNumber'), 10) || 0;
  });
  const [rowsPerPage, setRowsPerPage] = useState(() => {
    
    const savedRowsPerPage = sessionStorage.getItem('reportRowsPerPage2') ;
    return savedRowsPerPage ? +savedRowsPerPage : 25;
  });
  
  const call =()=>{ axios
  .get(
    "/api/user/getUsers",
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
        "/api/user/getUsers",
        {
          headers: { authorization: `Bearer ${appState?.accessToken}` },
          params:{search:searchValue}
        }).then((res) => {
       
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
      "/api/user/getUsers",
      {
        headers: { authorization: `Bearer ${appState?.accessToken}` },
        params: { pageNumber: page+1, pageSize: rowsPerPage },
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
      return;
    }
  }, [page,rowsPerPage,searchValue]);

  

  useEffect(() => {
   
    sessionStorage.setItem('userPageNumber', page);
  }, [page]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
   
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = +event.target.value;
    setRowsPerPage(newRowsPerPage);
    setPage(0);

  
    sessionStorage.setItem('reportRowsPerPage2', newRowsPerPage);
  };


  const [open, setOpen] = React.useState(false);
  const [delectid, setDelectid] = React.useState('');

  const handleClickOpen = (id) => {
    setOpen(true);
    setDelectid(id)
    
  };

  const handleClose = () => {
    setOpen(false);
  };

const handleDelete =(id)=>{
  axios.delete(`/api/user/deleteUser/${delectid}`,{
    headers:{authorization: `Bearer ${appState?.accessToken}`}
  }).then((res)=>{
    if(res?.data?.isSuccess===true){
      setOpen(false);
      toast(t("User Deleted Successfully"), {
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
    toast(`User cannot be deleted as he is assigned to conduct surveys`, {
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

const lang = sessionStorage.getItem('lang')
const {t} = useTranslation()
  return (
    <>
     <React.Fragment>
      
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
       
        <DialogContent>
         <Typography variant="h5" >{t('Are you sure to delete this user?')}</Typography>
        </DialogContent>
       
         <Box p={3} display={'flex'} alignContent={'center'} justifyContent={'center'} flexDirection={'row'} gap={3}>
         <Button variant="contained" size="small" onClick={handleClose}>{t('NO')}</Button>
          <Button variant="contained" size="small" onClick={handleDelete} autoFocus>
            {t('YES')}
          </Button>
         </Box>
        
      </Dialog>
    </React.Fragment>
   
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
        {t('User list')}
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
                    navigate("./createUser");
                  }}
                >
                  {t('Add New User')}
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
              {t('User ID')}
              </TableCell>
              <TableCell align={lang==='ar'?"right":"left"} style={{ fontWeight: "bold", fontSize: "1rem" }}>
              {t('User name')}
              </TableCell>
              <TableCell align={lang==='ar'?"right":"left"} style={{ fontWeight: "bold", fontSize: "1rem" }}>
              {t('First name')}
              </TableCell>
              <TableCell align={lang==='ar'?"right":"left"} style={{ fontWeight: "bold", fontSize: "1rem" }}>
              {t('Last name')}
              </TableCell>
              <TableCell align={lang==='ar'?"right":"left"} style={{ fontWeight: "bold", fontSize: "1rem" }}>
              {t('Email')}
              </TableCell>
              <TableCell align={lang==='ar'?"right":"left"} style={{ fontWeight: "bold", fontSize: "1rem" }}>
              {t('Phone number')}
              </TableCell>
              <TableCell align={lang==='ar'?"right":"left"} style={{ fontWeight: "bold", fontSize: "1rem" }}>
              {t('Role(s)')}
              </TableCell>
              {
                 appState?.roleinfo?.role === 'Recruiter'||appState?.roleinfo?.role === 'Interviewer'||appState?.roleinfo?.role === 'Recruiter' && appState?.roleinfo?.role === 'Interviewer'?<></>:<>
                 <TableCell align={lang==='ar'?"right":"left"} style={{ fontWeight: "bold", fontSize: "1rem" }}>
              {t('Edit')}
              </TableCell>
              <TableCell align={lang==='ar'?"right":"left"} style={{ fontWeight: "bold", fontSize: "1rem" }}>
              {t('Delete')}
              </TableCell>
                </>
              }
             
            </TableRow>
          </TableHead>
          <TableBody>
            {(
              
              users
            ).map((user, index) => (
              <TableRow key={index}>
                <TableCell align={'center'}>{user?.id}</TableCell>
                <TableCell align={lang==='ar'?"right":"left"}>{user?.username}</TableCell>
                <TableCell align={lang==='ar'?"right":"left"}>{user?.firstName}</TableCell>
                <TableCell align={lang==='ar'?"right":"left"}>{user?.lastName}</TableCell>
                <TableCell align={lang==='ar'?"right":"left"}>{user?.email}</TableCell>
                <TableCell align={lang==='ar'?"right":"left"}>{user?.phoneNumber}</TableCell>
                <TableCell align={lang==='ar'?"right":"left"}>{user?.roles?.map((role,index)=>role?.roleName).join(', ')}</TableCell>
                
                { appState?.roleinfo?.role === 'Recruiter'||appState?.roleinfo?.role === 'Interviewer' || appState?.roleinfo?.role === 'Recruiter'  && appState?.roleinfo?.role === 'Interviewer' ?<></>:<>
                  <TableCell align={lang==='ar'?"right":"left"}><IconButton size="small" onClick={()=>{navigate(`/userManagement/updateUser?id=${user?.id}`)}}><Tooltip title={t('Edit')}><Edit/></Tooltip></IconButton></TableCell>
                  <TableCell align={lang==='ar'?"right":"left"}><IconButton size="small" onClick={()=>{handleClickOpen(user?.id)}}><Tooltip title={t('Delete')}><Delete/></Tooltip></IconButton></TableCell>
                </>
                
                }
               
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
    </>
  );
};

export default UserManagement;
