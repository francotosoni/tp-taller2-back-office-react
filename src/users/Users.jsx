import { Box, Typography, Button } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import "../styles/Users.css";
import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from "firebase/auth";
import { tokens } from "../theme";
import Header from "../components/Header";
import { useTheme } from "@mui/material";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';

const Users = ({userAccessToken}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const apiUrl  = 'https://snapmsg-api-gateway.onrender.com/'
  const [users, setUsers] = useState([]);

  useEffect(()=>{
    onAuthStateChanged(auth, (user) => {
        if (user) {
          user.getIdToken().then( async (accessToken) => {
            const headers = {
              'Authorization': 'Bearer '+ accessToken , 
            };
            userAccessToken = accessToken;
            const response = await axios.get(apiUrl + 'users', { headers });

            const users_cleaned = response.data.map(user => {

              let {['description']: description, ['photoURL'] : photoURL, ['blocked_users']: blocked_users, ...rest } = user;

              return {
                ...rest,
                following: user.following.length,
                followers: user.followers.length,
                id: user.uid,
              };
            });
            setUsers(users_cleaned);
          });
        } else {
          navigate("/");         
        }
      });
     
  }, []) 

  const columns = [
    { field: "id", headerName: "UID",flex: 1,},
    {
      field: "username",
      headerName: "Username",
      cellClassName: "username-column--cell",
      flex: 1,
    },
    {
      field: "mail",
      headerName: "Mail",
      headerAlign: "left",
      flex: 1,
      align: "left",
    },
    {
      field: "following",
      headerName: "Following",
      headerAlign: "left",
      align: "left",
      type: "number",
    },
    {
      field: "followers",
      headerName: "Followers",
      headerAlign: "left",
      align: "left",
      type: "number",
    },
    {
      field: "accessLevel",
      headerName: "Access Level",
      headerAlign: "center",
      align: "left",
      flex: 1,
      renderCell: ({ row: { accessLevel } }) => {
        return (
          <Box
            width="60%"
            m="0 auto"
            p="5px"
            display="flex"
            justifyContent="center"
            backgroundColor={
              accessLevel === "admin"
                ? colors.greenAccent[600]
                : colors.greenAccent[700]
            }
            borderRadius="4px"
          >
            {accessLevel === "admin" && <AdminPanelSettingsOutlinedIcon />}
            {accessLevel === "user" && <LockOpenOutlinedIcon />}
            <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
              {accessLevel}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "block",
      headerName: "",
      headerAlign: "center",
      align: "left",
      flex: 1,
      renderCell: ({ row: { accessLevel, blocked, id } }) => {
        const [isBlocked, setBlocked] = useState(blocked);

        const handleButtonClick = async () => {
          console.log(userAccessToken)
          let response;
          if(userAccessToken != ""){

            const user = {
              uid: id,
            };

            const headers = {
              'Authorization': 'Bearer '+ userAccessToken , 
            };
            
            if (isBlocked)
              response = await axios.post(apiUrl + 'user/unblock', user,  { headers });
            else
              response = await axios.post(apiUrl + 'user/block', user,  { headers });

            setBlocked(!isBlocked);
          }
        };

        const isDisabled = accessLevel === "admin"? true : false;
    
        return (
          <Button
            variant="contained"
            onClick={handleButtonClick}
            disabled = {isDisabled}
            style={{
              backgroundColor: isBlocked && accessLevel === "user" ? colors.greenAccent[600] : accessLevel === "admin"? colors.redAccent[800] :  colors.redAccent[500] ,
              borderRadius: "4px",
              width: "60%",
              margin: "0 auto",
              padding: "5px",
            }}
          >
            {isBlocked ? (
              <>
                <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
                  Unblock
                </Typography>
              </>
            ) : (
              <>
                <Typography color={colors.grey[100]} sx={{ ml: "5px" }}>
                  Block
                </Typography>
              </>
            )}
          </Button>
        );
      },
    },
  ];


  if (users.length === 0) {
    // Si snaps está vacío, mostrar el spinner
    return(
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <CircularProgress style={{ color: 'white', width: 120, height: 120 }} />
    </div>
    )
  }

  return (
    <Box m="20px">
      <Header
        title="Users"
        subtitle="List of Users"
      />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
          rows={users}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
    </Box>
  );
};

export default Users;