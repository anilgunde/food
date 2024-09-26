
import {
  Avatar, Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText, Tooltip, Typography
} from "@mui/material";
import { useLocation } from "react-router-dom";
import profile_pic from "../../../assets/User.svg";
import { PATHS } from "../../../utils/constants";
import Link from "../../Common/Link";
import CollapsableNav from "./CollapsableNav";
import i18next from "i18next";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import dashboard from '../../../assets/dashboard-img.svg';
import recipe from '../../../assets/recipe-fill2.png';
import home from '../../../assets/house-img.svg';
import reports from '../../../assets/reports-img.svg';
import survey from '../../../assets/survey-img.svg';
import user from '../../../assets/user-solidd.svg';
import food from '../../../assets/food-fill.svg';
import food1 from '../../../assets/contaminationG.svg';
import role from '../../../assets/wrench-solid (1).svg';
import aptiway from '../../../assets/powered.png';
import Continaminant from '../../../assets/contF.svg';
import { useSelector,useDispatch, } from "react-redux";
import Cookies from "js-cookie";

const DrawList = ({ setIsOpen }) => {
  const {t} = useTranslation() 
  const lang = sessionStorage.getItem('lang')
  useEffect(()=>{
    i18next.changeLanguage(lang)
  },[lang])

  const location = useLocation();
const navItems3 =[
  {
    title: `${t('Dashboard')}`,
    link: PATHS.dashboard,
    icon: dashboard,
  },
  {
    title: `${t('Survey')}`,
    link: PATHS.Survey.root,
    icon: survey,
    children: [
      {
        title: `${t('Survey List')}`,
        link: PATHS.Survey.root ,
      },
      // {
      //   title: `${t('Create Survey')}`,
      //   link: PATHS.Survey.createSurvey,
      // },
      
      {
        title: `${t('Sections')}`,
        link: PATHS.Survey.sections,
      },
      // {
      //   title: `${t('Create Sections')}`,
      //   link: PATHS.Survey.createSections,
      // },
          ],
        },
        
        {
          title: `${t('House Holds')}`,
          link: PATHS?.HouseHold.root,
          icon: home,
          children: [
      
      {
        title: `${t('Households')}`,
        link:PATHS?.HouseHold.root,
      },
     
     
    ],
  },
  {
    title: `${t('User Management')}`,
    link: PATHS?.userManagement.root,
    icon: user,
    children:[
      {
        title: `${t('User List')}`,
        link: PATHS?.userManagement.root,
      },
      // {
      //   title: `${t('Create User')}`,
      //   link: PATHS?.userManagement.createUser,
      // },
    ]
  },
 
  {
    title: `${t('Roles')}`,
    link: PATHS?.Roles,
    icon: role,
  },
  {
    title: `${t('Recipes')}`,
    link: PATHS.Recipes.root,
    icon: recipe,
  },
  {
    title: `${t('Foods')}`,
    link: PATHS?.Foods,
    icon: food,
  },
  // {
  //   title: `${t('Contaminants')}`,
  //   link: PATHS?.contaminants,
  //   icon: food1,
  // },
   {
      title: `${t('Reports')}`,
      link: PATHS?.Reports.root,
      icon: reports,
    },
]

const navItems4 = [
  // {
  //   title: `${t('Dashboard')}`,
  //   link: PATHS.dashboard,
  //   icon: dashboard,
  // },
  // {
  //   title: `${t('Survey')}`,
  //   link: PATHS.Survey.root,
  //   icon: survey,
  //   children: [
  //     {
  //       title: `${t('Survey List')}`,
  //       link: PATHS.Survey.root ,
  //     },
  //     {
  //       title: `${t('Create Survey')}`,
  //       link: PATHS.Survey.createSurvey,
  //     },
      
  //     {
  //       title: `${t('Sections')}`,
  //       link: PATHS.Survey.sections,
  //     },
  //     {
  //       title: `${t('Create Sections')}`,
  //       link: PATHS.Survey.createSections,
  //     },
  //         ],
  //       },
        
        {
          title: `${t('House Holds')}`,
          link: PATHS?.HouseHold.root,
          icon: home,
          children: [
      
      {
        title: `${t('Households')}`,
        link:PATHS?.HouseHold.root,
      },
      {
        title: `${t('Add Household')}`,
        link:   PATHS?.HouseHold?.addHouseHold,
      },
     
    ],
  },
  // {
  //   title: `${t('User Management')}`,
  //   link: PATHS?.userManagement.root,
  //   icon: user,
  //   children:[
  //     {
  //       title: `${t('User List')}`,
  //       link: PATHS?.userManagement.root,
  //     },
  //     // {
  //     //   title: `${t('Create User')}`,
  //     //   link: PATHS?.userManagement.createUser,
  //     // },
  //   ]
  // },
 
  // {
  //   title: `${t('Roles')}`,
  //   link: PATHS?.Roles,
  //   icon: role,
  // },
  // {
  //   title: `${t('Recipes')}`,
  //   link: PATHS.Recipes.root,
  //   icon: recipe,
  // },
  // {
  //   title: `${t('Foods')}`,
  //   link: PATHS?.Foods,
  //   icon: food,
  // },
  // {
  //   title: `${t('Reports')}`,
  //   link: PATHS?.Reports.root,
  //   icon: reports,
  // },
 
];

const navItems5 = [
  {
    title: `${t('Dashboard')}`,
    link: PATHS.dashboard,
    icon: dashboard,
  },
  {
    title: `${t('Survey')}`,
    link: PATHS.Survey.root,
    icon: survey,
    children: [
      {
        title: `${t('Survey List')}`,
        link: PATHS.Survey.root ,
      },
      // {
      //   title: `${t('Create Survey')}`,
      //   link: PATHS.Survey.createSurvey,
      // },
      
      {
        title: `${t('Sections')}`,
        link: PATHS.Survey.sections,
      },
      // {
      //   title: `${t('Create Sections')}`,
      //   link: PATHS.Survey.createSections,
      // },
          ],
        },
        
        {
          title: `${t('House Holds')}`,
          link: PATHS?.HouseHold.root,
          icon: home,
          children: [
      
      {
        title: `${t('Households')}`,
        link:PATHS?.HouseHold.root,
      },
      {
        title: `${t('Add Household')}`,
        link:   PATHS?.HouseHold?.addHouseHold,
      },
     
    ],
  },
  {
    title: `${t('User Management')}`,
    link: PATHS?.userManagement.root,
    icon: user,
    children:[
      {
        title: `${t('User List')}`,
        link: PATHS?.userManagement.root,
      },
      // {
      //   title: `${t('Create User')}`,
      //   link: PATHS?.userManagement.createUser,
      // },
    ]
  },
 
  {
    title: `${t('Roles')}`,
    link: PATHS?.Roles,
    icon: role,
  },
  {
    title: `${t('Recipes')}`,
    link: PATHS.Recipes.root,
    icon: recipe,
  },
  {
    title: `${t('Foods')}`,
    link: PATHS?.Foods,
    icon: food,
  },
  // {
  //   title: `${t('Contaminants')}`,
  //   link: PATHS?.contaminants,
  //   icon: food1,
  // },
  {
    title: `${t('Reports')}`,
    link: PATHS?.Reports.root,
    icon: reports,
  },
 
];

  const navItems = [
    {
      title: `${t('Dashboard')}`,
      link: PATHS.dashboard,
      icon: dashboard,
    },
    {
      title: `${t('Survey')}`,
      link: PATHS.Survey.root,
      icon: survey,
      children: [
        {
          title: `${t('Survey List')}`,
          link: PATHS.Survey.root ,
        },
        // {
        //   title: `${t('Create Survey')}`,
        //   link: PATHS.Survey.createSurvey,
        // },
        
        {
          title: `${t('Sections')}`,
          link: PATHS.Survey.sections,
        },
        // {
        //   title: `${t('Create Sections')}`,
        //   link: PATHS.Survey.createSections,
        // },
            ],
          },
          
          {
            title: `${t('House Holds')}`,
            link: PATHS?.HouseHold.root,
            icon: home,
            children: [
        
        {
          title: `${t('Households')}`,
          link:PATHS?.HouseHold.root,
        },
        {
          title: `${t('Add Household')}`,
          link:   PATHS?.HouseHold?.addHouseHold,
        },
        // {
        //   title: `${t('Assign Survey')}`,
        //   link: PATHS.HouseHold.assignSurvey,
        // },
        // {
        //   title: "Participants",
        //   link:PATHS?.HouseHold.participants,
        // },
        // {
        //   title: "Add Participants",
        //   link:   PATHS?.HouseHold?.addParticipants,
        // },
      ],
    },
    {
      title: `${t('User Management')}`,
      link: PATHS?.userManagement.root,
      icon: user,
      children:[
        {
          title: `${t('User List')}`,
          link: PATHS?.userManagement.root,
        },
        {
          title: `${t('Create User')}`,
          link: PATHS?.userManagement.createUser,
        },
      ]
    },
    {
      title: `${t('Roles')}`,
      link: PATHS?.Roles,
      icon: role,
    },
    {
      title: `${t('Recipes')}`,
      link: PATHS.Recipes.root,
      icon: recipe,
    },
    {
      title: `${t('Foods')}`,
      link: PATHS?.Foods,
      icon: food,
    },
    {
      title: `${t('Contaminants')}`,
      link: PATHS?.Contaminants.root,
      icon: Continaminant,
      children:[
        {
          title: `${t('Food Search')}`,
          link: PATHS?.Contaminants.FoodSearch,
        },
        // {
        //   title: `${t('Create Contaminant')}`,
        //   link: PATHS?.Contaminants,
        // },
      ]
    },
    {
      title: `${t('Reports')}`,
      link: PATHS?.Reports.root,
      icon: reports,
    },
  
  ];
  const closeNavbar = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);


const appState = useSelector(state=>state.app)
// const Role = appState?.loginInfo?.role;

let navItems2;

//  useEffect(()=>{
  if(appState?.roleinfo?.role ==="Administrator"){
    navItems2=navItems
  }
  else if(appState?.roleinfo?.role === 'Interviewer'){
    navItems2 = navItems3;
    // navItems2 = navItems?.filter(title=>title?.link === '/household' || title?.link === '/dashboard')
  }
  else if(appState?.roleinfo?.role === 'Recruiter'){
    navItems2 = navItems4;
  }
  else if(appState?.roleinfo?.role === 'Recruiter' && appState?.roleinfo?.role === 'Interviewer'){
    navItems2 = navItems5;
  }
 
    else{
    navItems2=navItems
  }
//  },[appState?.loginInfo])
const [userName, setUserName] = useState("");

useEffect(() => {
  // Get the unique_name cookie
  const uniqueName = Cookies.get("unique_name");
  
  if (uniqueName) {
    setUserName(uniqueName);
  }
}, []);

  const [face,setFace] = useState()
  const dispatch = useDispatch()
  useEffect(()=>{
  })

  return (
    <Box
      sx={{
        width: "100%",
        height:'100%'
      }}
    >
      <Box
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"center"}
        alignItems={"center"}
        marginBottom={'rem'}
        marginTop={'-3rem'}
      >
        <Avatar
        
          alt="profile_pic"
          src={face?.length ? `data:image/jpeg;base64,${face}` : profile_pic}
          sx={{
            width: "80px",
            height: "80px",
            objectFit: "cover",
            // marginTop:'-1.8rem',
            // marginBottom:'-1rem'
          }}
        />
        {
          appState?.roleinfo?.unique_name? <Typography
          fontSize={{ xs: 18, md: 16, lg: 18 }}
          marginTop={'1rem'}
          variant="body2"
          color={'#45AEAE'}
          fontWeight={'bold'}
          textAlign={"center"}
        >
            {appState?.roleinfo?.unique_name}
          
        </Typography>:<Typography  fontSize={{ xs: 18, md: 16, lg: 18 }}
          marginTop={'1rem'}
          variant="body2"
          color={'#45AEAE'}
          fontWeight={'bold'}
          textAlign={"center"} >{userName}</Typography>
        }
       

        <Typography
          fontSize={{ xs: 14, md: 14, lg: 14 }}
          variant="h6"
          color="#343434"
          sx={{ fontWeight: "500" }}
        >
          {/* {roleName} */}
        </Typography>
        <Typography
          fontSize={{ xs: 14, md: 14, lg: 14 }}
          variant="h6"
          color="#343434"
          sx={{ fontWeight: "500" }}
        >
          {/* {reportingRoleName} */}
        </Typography>

        <Typography
          fontSize={{ xs: 14, md: 14, lg: 14 }}
          variant="h6"
          color="#343434"
          sx={{ fontWeight: "500" }}
        >
          {/* {branchName} */}
        </Typography>
      </Box>
      
      <Box sx={{  position: "relative",padding:'0px 1rem'}}>
        <List component="nav">
          {navItems2?.map((navItem, index) =>
            !!navItem?.children?.length ? (
              <CollapsableNav
                key={index}
                nums={index}
                onClick={closeNavbar}
                primary={navItem?.title}
                links={navItem?.children}
                icon={navItem?.icon}
                root={navItem?.link}
              />
            ) : (
              <List key={index}>
                <Link to={navItem?.link} key={index} style={{'color':'#EEEEEE'}}>
                  <ListItemButton
                  sx={{ '&.Mui-selected':{
                    color:'#5A6670',
                    backgroundColor:'#EEEEEE',
                    borderRadius:'10px',
                    
                  },
                  marginBottom:'-0.5rem',
                  '&:hover':{
                    color:'#5A6670',
                    backgroundColor:'#EEEEEE',
                    borderRadius:'10px',
                   
                    "&.MuiListItemIcon-root": {
                      color: "#5A6670",
                    }
                  },
                  '&.Mui-selected:hover':{
                    color:'#5A6670',
                    backgroundColor:'#EEEEEE',
                    borderRadius:'10px',
                    "&.MuiListItemIcon-root": {
                      color: "#5A6670"
                    }
                  },
                  color:'#5A6670',
              
                }}
                // onMouseEnter={()=>{setHover(true); setNum(index)}}
                // onMouseLeave={()=>{setHover(false);setNum(-1)}}
                    selected={location.pathname?.includes(navItem?.link)}
                    onClick={()=>{closeNavbar()}}
                  >
                    <ListItemIcon sx={lang==='en'?{'marginRight':'-1.3rem'}:{}}>
                      <img src={navItem?.icon} alt="icon" width={'17rem'} height={'17rem'}/>
                      </ListItemIcon>  

                      <ListItemText primary={navItem?.title} sx={{'.MuiListItemText-primary':{fontSize:'0.9rem',fontWeight:'600'},textAlign:lang==='en'?'left':'right'}} />
                  </ListItemButton>
                </Link>
              </List>
            ),
          )}
        </List>
      </Box>
      <Box pt={2} sx={{display:'flex',alignItems:'center',justifyContent:'center'}}>
      <img  src={aptiway} alt="aptiway"  width={'50%'} height={'50%'}/>
      </Box>
    </Box>
  );
};

export default DrawList;
