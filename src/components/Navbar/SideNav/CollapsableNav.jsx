import { useLocation } from "react-router-dom";
import Link from "../../Common/Link";

import {
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  resetHouseHolds,
  setCompleteClear,
  setParticipant,
  setSection,
} from "../../../store/slices/app.tsx";
import { useDispatch } from "react-redux";

const CollapsableNav = ({ primary, links, icon, root, onClick, nums }) => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const lang = sessionStorage.getItem("lang");
  useEffect(() => {
    setOpen(location.pathname.includes(root?.split("/")[1]));
  }, [location.pathname, root]);
  const [hover, setHover] = useState(false);
  const [num, setNum] = useState(-1);
  const dispatch = useDispatch();
  return (
    <>
      <Link to={root} style={{ color: "#ef8733" }}>
        <ListItemButton
          selected={location.pathname.includes(root?.split("/")[1])}
          onClick={() => {
            setOpen((prev) => !prev);
          }}
          sx={{
            "&.Mui-selected": {
              color: "#5A6670",
              backgroundColor: "#EEEEEE",
              borderRadius: open ? "10px 10px 0px 0px" : "10px",
            },
            marginTop: "0.5rem",
            "&:hover": {
              color: "#5A6670",
              backgroundColor: "#EEEEEE",
              borderRadius: open ? "10px 10px 0px 0px" : "10px",

              "&.MuiListItemIcon-root": {
                color: "#5A6670",
              },
            },
            "&.Mui-selected:hover": {
              color: "#5A6670",
              backgroundColor: "#EEEEEE",
              borderRadius: open ? "10px 10px 0px 0px" : "10px",
              "&.MuiListItemIcon-root": {
                color: "#5A6670",
              },
            },
            color: "#5A6670",
          }}
          onMouseEnter={() => {
            setHover(true);
            setNum(nums);
          }}
          onMouseLeave={() => {
            setHover(false);
            setNum(-1);
          }}
        >
          <ListItemIcon
            sx={
              lang === "en"
                ? {
                    color: " #5A6670",
                    marginRight: lang === "en" ? "-1.3rem" : "0rem",
                  }
                : {}
            }
          >
            <img src={icon} alt="icon" />
          </ListItemIcon>
          <ListItemText
            onClick={onClick}
            primary={primary}
            sx={{
              ".MuiListItemText-primary": {
                fontSize: "0.9rem",
                fontWeight: "600",
              },
              textAlign: lang === "en" ? "left" : "right",
            }}
          />
        </ListItemButton>
      </Link>
      <Collapse in={open} timeout="auto">
        <List component="nav" sx={{ marginTop: "-10px" }}>
          {links.map((navItem, index) => (
            <React.Fragment key={index}>
              <Link
                to={navItem?.link}
                style={{ color: "#EEEEEE" }}
                onClick={() => {
                  if (navItem?.link === "/household/addHousehold") {
                    dispatch(resetHouseHolds());
                    dispatch(setCompleteClear());
                  }
                  if (navItem?.link === "/household/addParticipant") {
                    dispatch(setParticipant({}));
                  }
                  if (navItem?.link === "/survey/section/createSections") {
                    dispatch(setSection());
                  }
                }}
              >
                <ListItemButton
                  // sx={{ pl: 4 }}
                  onClick={onClick}
                  sx={{
                    "&.Mui-selected": {
                      color: "#5A6670",
                      backgroundColor: "#EEEEEE",
                      borderRadius:
                        links?.length === index + 1
                          ? "0px 0px 10px 10px"
                          : "0px",
                    },
                    // pl: 4,
                    // mb:1  ,
                    marginTop: "-10px",
                    marginBottom: links?.length === index + 1 ? "-10px" : "0px",

                    "&:hover": {
                      color: "#5A6670",
                      backgroundColor: "#EEEEEE",
                      borderRadius:
                        links?.length === index + 1
                          ? "0px 0px 10px 10px"
                          : "0px",
                      // transition:'ease-in-out',
                      // transitionDuration:'1s',
                    },
                    "&.Mui-selected:hover": {
                      color: "#5A6670",
                      backgroundColor: "#EEEEEE",
                      borderRadius:
                        links?.length === index + 1
                          ? "0px 0px 10px 10px"
                          : "0px",
                    },
                    color: "#5A6670",
                    backgroundColor: "#EEEEEE",
                    borderRadius:
                      links?.length === index + 1 ? "0px 0px 10px 10px" : "0px",
                  }}
                  onMouseEnter={() => {
                    setHover(true);
                    setNum(index);
                  }}
                  onMouseLeave={() => {
                    setHover(false);
                    setNum(-1);
                  }}
                  selected={navItem?.link === location.pathname}
                >
                  <ListItemIcon
                    sx={{
                      color: " white",
                      marginRight: lang === "en" ? "-1.3rem" : "0rem",
                    }}
                  >
                    {navItem.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={navItem.title}
                    sx={{
                      ".MuiListItemText-primary": {
                        fontSize: "0.8rem",
                        fontWeight: "600",
                      },
                      color:
                        navItem?.link === location.pathname
                          ? "#5A6670"
                          : "rgba(90, 102, 112, 0.6)",
                      fontWeight: "600",
                      textAlign: lang === "en" ? "left" : "right",
                    }}
                  />
                </ListItemButton>
              </Link>
            </React.Fragment>
          ))}
        </List>
      </Collapse>
    </>
  );
};

export default CollapsableNav;
