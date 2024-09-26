import { useEffect, useState } from "react";

import {
  Backdrop,
  Button,
  FormHelperText,
 
  InputAdornment,
  TextField,
  Typography,
  styled
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import "bootstrap/dist/css/bootstrap.css";
import { useFormik } from "formik";

import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import logo from "../../assets/atlas.png";
import passImage from "../../assets/key-solid.png";
import userImage from "../../assets/user-solid@2x.png";
import Heart from "../../components/Common/Heart";
import LoginTextfield from "./TextFiled.jsx";
import "./login.css";
import axios from "axios";
import { toast } from "react-toastify";
import { setAccessToken, setApiErrorStatusCode } from "../../store/slices/app.tsx";

  const useStyles = makeStyles((theme) => ({
    noBorder: {
      border: "none",
      borderRadius: "5px",
    },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
    label: {
      fontSize: "10px",
    },
    helperText: {
     
      color: "#d32f2f",
      marginLeft: "0.2rem",
      marginBottom: "-0.4rem",
    },
  }));
  

 
const Login = () => {

  
  const { t } = useTranslation();
  const [load, setLoad] = useState(false);
  useEffect(()=>{
    dispatch(setAccessToken(null))
  },[])
  const formik = useFormik({
    initialValues: {
      password: "",
      username: "",
      confirmpassword:''
    },
    validationSchema: Yup.object({
      password: Yup.string().required(`${t("Please Enter Password")}`),
      username: Yup.string().required(`${t("Please Enter Username")}`),
      confirmpassword: Yup.string()
        .oneOf([Yup.ref('password'), null], `${t('Passwords must match')}`)
        .required(`${t('Please Re-Enter Password')}`),
    }),
    onSubmit: (values, { setSubmitting }) => {
      setLoad(true)
      axios.patch(`/api/user/forgotpassword/${formik.values.username}`,
        
            [{
            "operationType":0,"path":"password","op":"replace","from":"admin",
              "value": formik.values.confirmpassword
            }]
          
      ).then(res=>{
        console.log(res?.data)
        if(res?.data?.isSuccess===true){
            navigate('/')
            setLoad(false)
            toast(t('Password changed successfully'), {
                position: "top-center",
                autoClose: 4000,
                hideProgressBar: false,
                pauseOnHover: true,
                draggable: true,
                type: "success",
              });
        }
      }).catch(err=>{
        setLoad(false)
        toast.error(err?.response?.data?.Errors[0])
      })
    },
  });
  const classes = useStyles();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setApiErrorStatusCode(null))
  }, []);

 
  const handleKeyDown = (event) => {
    if (event.keyCode === 13) {
      // handleSubmit()
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);


  const lang = sessionStorage.getItem("lang");

  const Loader = () => {
    return (
      <Backdrop open={true}>
        <Heart />
      </Backdrop>
    );
  };
 
  
  return (
    <div className="backImg container-fluid">
      <div className="page p-4 rounded-4">
        <div className="d-flex justify-content-center flex-column align-items-center">
          <img src={logo} width="95px" height="90px" alt="Logo" />
          <Typography color={"#214C55"} fontSize={"1.2rem"} fontWeight={"bold"}>
          {t('Abu Dhabi Intake24')}
          </Typography>
          <Typography
            className="mb-4"
            color={"#45AEAE"}
            fontSize={"1.1rem"}
            fontWeight={"bold"}
          >
            {t('Admin Portal')}
          </Typography>
        </div>
        <form
          autoComplete="none"
          onSubmit={formik.handleSubmit}
          style={{ width: "100%" }}
        >
           <div dir={lang==='ar'?"rtl":''}>
          <LoginTextfield
            value={formik.values.username}
            autoFocus
            fullWidth
            style={{ width: "100%" }}
            name="username"
            onChange={formik.handleChange}
            autoComplete="off"
            error={formik.touched.username && formik.errors.username}
           
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <img src={userImage} width={"15px"} height={"15px"} alt="userImage" />
                </InputAdornment>
              ),
            }}
            className={`${
              formik.touched.username && formik.errors.username
                ? "mb-1 w-100"
                : "mb-4 w-100"
            }`}
            placeholder={t('Username/Email ID')}
          />
          <div dir={lang==='ar'?"rtl":""} style={{position:'relative'}}>
          {formik.touched.username && formik.errors.username && (
            <FormHelperText  style={{position:'absolute',bottom:'0'}} className={`${classes.helperText} mb-1`}>
              {formik.touched.username && formik.errors.username}
            </FormHelperText>
          )}
          </div>
          </div>
          
                <div dir={lang==='ar'?"rtl":''}>
          <LoginTextfield
            fullWidth
            style={{ width: "100%" }}
            error={formik.touched.password && formik.errors.password}
            type={'password'}
            name="password"
            className={`${
                formik.touched.password && formik.errors.password
                  ? "mb-2 w-100"
                  : "mb-4 w-100"
              }`}
            value={formik.values.password}
            onChange={formik.handleChange}
           
            placeholder={t('Password')}
            autoComplete="off"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <img  alt="passImage" src={passImage} width={"15px"} height={"15px"} />
                </InputAdornment>
              ),
            
            }}
          />
          <div dir={lang==='ar'?"rtl":""} style={{position:'relative'}}>
          {formik.touched.password && formik.errors.password && (
            <FormHelperText className={`${classes.helperText} mb-1`} style={{position:'absolute',bottom:'0'}}>
              {formik.touched.password && formik.errors.password}
            </FormHelperText>
          )}
          
          </div>
          </div>
          <div dir={lang==='ar'?"rtl":''}>
          <LoginTextfield
            fullWidth
            style={{ width: "100%" }}
            error={formik.touched.confirmpassword && formik.errors.confirmpassword}
            type={'text'}
            name="confirmpassword"
            className="mb-1"
            value={formik.values.confirmpassword}
            onChange={formik.handleChange}
           
            placeholder={t('Confirm Password')}
            autoComplete="off"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <img alt="passImage" src={passImage} width={"15px"} height={"15px"} />
                </InputAdornment>
              ),
            
            }}
          />
          
          <div dir={lang==='ar'?"rtl":""} style={{position:'relative'}}>
          {formik.touched.confirmpassword && formik.errors.confirmpassword && (
            <FormHelperText  style={{position:'absolute',bottom:'0'}} className={`${classes.helperText} mb-1`}>
              {formik.touched.confirmpassword && formik.errors.confirmpassword}
            </FormHelperText>
          )}
          </div>
          </div>
          
          <div>
          <div className="forgot" align='center'>
              <Button
                variant="text"
                style={{
                  color: "#45AEAE",
                  textTransform: "none",
                  padding: 0,
                  marginTop: "-2px",
                }}
                onClick={()=>{navigate('/')}}
              >
                {t('Login')}
              </Button>
            </div>
          </div>
          <div style={{marginBottom:'3rem'}}>

          </div>
          <button className="btn btn-app" type="submit">
          {t('Change password')}
          </button>
        </form>
      </div>
      {load && <Loader />}
    </div>
  );
};

export default Login;
