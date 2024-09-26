import React, { useEffect } from "react";

import {
  Box,
  Button,
  
  Paper,
  Stack,
  
  Typography,
  
} from "@mui/material";


import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import homeicon from "../../../../src/assets/homeicon.svg";

import moment from "moment/moment";
import { useState } from "react";
import axios from "../../../api/axios";
import { useNavigate } from "react-router-dom";



const headCells = [
  {
    id: "Participant Id",
    numeric: false,
    disablePadding: true,
  },
  {
    id: "Participant Code",
    numeric: true,
    disablePadding: true,
  },
  {
    id: "First Name",
    numeric: true,
    disablePadding: false,
  },

  {
    id: "Family Name",
    numeric: true,
    disablePadding: false,
  },
  {
    id: "Date Of Birth",
    numeric: true,
    disablePadding: false,
  },
];

function EnhancedTableHead(props) {
  return (
    <TableHead style={{ height: "45px" }}>
      <TableRow>
        
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={"left"}
            padding={"normal"}
            style={{
              fontSize: "1rem",
              fontWeight: "bold",
              border: "0",
              backgroundColor: "#EEEEEE",
            }}
          >
            {headCell.id}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

const Index = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    axios
      .get("/api/participants")
      .then((res) => {
        setData(res.data);
        console.log("as", res);
      })
      .catch((err) => {
        console.log("error", err);
      });
  }, []);
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
 
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = data?.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };
  const navigate = useNavigate();
  const handleClick = (event, id) => {
    
    navigate(`/household/viewParticipant?id=${id}`);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data?.length) : 0;

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

 
  const [displaytime, setDisplaytime] = useState(null);

  const handleTimeChange = (newTime) => {
    
    setDisplaytime(moment(newTime["$d"]).format("hh:mm:ss a"));
  };
  return (
    <>
      

      <Box marginTop={"-3rem"}>
        <Paper
          sx={{ backgroundColor: "white", border: "none", borderRadius: "0%" }}
          elevation={1}
          style={{ overflowY: "hidden", marginBottom: "10px" }}
        >
          <Stack
            p={1}
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
            alignItems={"center"}
            flexWrap={"wrap"}
          >
            <Box
              display={"flex"}
              pl={2}
              flexDirection={"row"}
              gap={1}
              alignItems={"center"}
              justifyContent={"flex-start"}
            >
              <Box>
                <img src={homeicon} alt="icon" width={"28px"} />
              </Box>
              <Box>
                <Typography
                  style={{
                    color: "#1D2420",
                    fontWeight: "bold",
                    fontSize: "1.3rem",
                  }}
                  pt={0.5}
                >
                  List of all Participants {data?.length}
                </Typography>
              </Box>
            </Box>

            <Box>
              <Box
                display={"flex"}
                flexDirection={"row"}
                gap={2}
                alignItems={"center"}
                justifyContent={"flex-start"}
              >
                <Box>
                  <Button
                    variant="text"
                    onClick={() => {
                      navigate("/household/addParticipant");
                    }}
                    style={{
                      color: "#3487E5",
                      fontWeight: "bold",
                      textTransform: "none",
                      fontSize: "20px",
                    }}
                    pt={0.5}
                  >
                    Add Participant
                  </Button>
                </Box>
                
              </Box>
            </Box>
          </Stack>
          <Stack
            flexDirection={{ md: "row", sm: "column" }}
            justifyContent={"space-between"}
            display={"flex"}
            alignItems={"center"}
            // pt={2}
            p={1.5}
          >
            <Box sx={{ width: "100%" }}>
              <TableContainer sx={{ maxHeight: 400 }}>
                <Table
                  sx={{ minWidth: 750 }}
                  aria-labelledby="tableTitle"
                 
                  stickyHeader
                  size="small"
                >
                  <EnhancedTableHead
                    numSelected={selected.length}
                    onSelectAllClick={handleSelectAllClick}
                    rowCount={data.length}
                  />
                  <TableBody>
                    {(rowsPerPage > 0
                      ? data.slice(
                          page * rowsPerPage,
                          page * rowsPerPage + rowsPerPage
                        )
                      : data
                    ).map((row, index) => (
                      <TableRow
                        hover
                        onClick={(event) =>
                          handleClick(event, row.participantId)
                        }
                        role="checkbox"
                      
                        tabIndex={-1}
                        key={row.participantId}
                       
                        sx={{ cursor: "pointer" }}
                        style={
                          index % 2 !== 0 ? { backgroundColor: "#F1F4F4" } : {}
                        }
                      >
                        
                        <TableCell
                          component="th"
                        
                          scope="row"
                          
                          style={{ border: "0" }}
                          align="left"
                        >
                          <Typography fontSize={"0.85rem"} color={"#1D2420"}>
                            {row?.participantId}
                          </Typography>
                        </TableCell>
                        <TableCell
                          component="th"
                      
                          scope="row"
                          
                          style={{ border: "0" }}
                          align="left"
                        >
                          <Typography fontSize={"0.85rem"} color={"#1D2420"}>
                            {row?.participantCode}
                          </Typography>
                        </TableCell>
                        <TableCell align="left" style={{ border: "0" }}>
                          {row.firstName}
                        </TableCell>
                        <TableCell align="left" style={{ border: "0" }}>
                          {row.familyName}
                        </TableCell>
                        <TableCell align="left" style={{ border: "0" }}>
                          {moment(row.dob).format("DD-MM-YYYY")}
                        </TableCell>
                      </TableRow>
                    ))}
                    {emptyRows > 0 && (
                      <TableRow
                      
                      >
                        <TableCell colSpan={6} />
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
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
                  marginBottom: "-20px",
                }}
                count={data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
             
            </Box>
          </Stack>
        </Paper>
      </Box>
    </>
  );
};

export default Index;
