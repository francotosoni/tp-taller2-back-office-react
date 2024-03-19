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
import axios from 'axios';
import { format } from 'date-fns-tz';
import CircularProgress from '@mui/material/CircularProgress';

const Snaps = ({userAccessToken}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const apiUrl  = 'https://snapmsg-api-gateway.onrender.com/'
  const navigate = useNavigate();
  const [snaps, setSnaps] = useState([]);

  useEffect(()=>{
    onAuthStateChanged(auth, (user) => {
        if (user) {
          user.getIdToken().then( async (accessToken) => {
            const headers = {
              'Authorization': 'Bearer '+ accessToken , 
            };
            const response = await axios.get(apiUrl + 'snaps/all', { headers });
            console.log(response.data);

            const snaps_cleaned = response.data.map(snap => {

              let {['authorId']: authorId, ['authorPhotoURL'] : authorPhotoURL, ['photoURL']: photoURL, ['hashtags']: hashtags, ['mentions']: mentions, ['trends']: trends, ['reSnapped']: reSnapped, ...rest } = snap;
              
              let date = new Date(snap.createdAt).setHours(new Date(snap.createdAt).getHours() - 3);
              date = format(date, "dd/MM/yyyy HH:mm:ss", { timeZone: 'America/Argentina/Buenos_Aires' });
              return {
                ...rest,
                likes: snap.likes.length,
                dislikes: snap.dislikes.length,
                createdAt: date
              };
            });
            setSnaps(snaps_cleaned);
            console.log(snaps_cleaned);
          });
        } else {
          navigate("/");         
        }
      });
     
  }, []) 

  const columns = [
    {
      field: "authorUsername",
      headerName: "Author Username",
      cellClassName: "username-column--cell",
      flex: 1,
    },
    {
      field: "content",
      headerName: "Content",
      headerAlign: "left",
      flex: 2,
      align: "left",
    },
    {
      field: "likes",
      headerName: "Likes",
      headerAlign: "left",
      align: "left",
      flex: 1,
      type: "number",
    },
    {
      field: "dislikes",
      headerName: "Dislikes",
      headerAlign: "left",
      align: "left",
      flex: 1,
      type: "number",
    },
    {
      field: "createdAt",
      headerName: "Created At",
      headerAlign: "left",
      align: "left",
      flex: 1,
      type: "number",
    },
    {
      field: "block",
      headerName: "",
      headerAlign: "center",
      align: "left",
      flex: 1,
      renderCell: ({ row: { blocked, id } }) => {
        const [isBlocked, setBlocked] = useState(blocked);
        console.log(isBlocked)

        const handleButtonClick = async () => {
          console.log(userAccessToken)
          console.log(id)
          let response;
          if(userAccessToken != ""){

            const snap = {
              id: id,
            };

            const headers = {
              'Authorization': 'Bearer '+ userAccessToken , 
            };
            
            if (isBlocked)
              response = await axios.post(apiUrl + 'snap/unblock', snap,  { headers });
            else
              response = await axios.post(apiUrl + 'snap/block', snap,  { headers });

            console.log(response.data);
            setBlocked(!isBlocked);
          }
        };

        return (
          <Button
            variant="contained"
            onClick={handleButtonClick}
            style={{
              backgroundColor: isBlocked ? colors.greenAccent[600] :  colors.redAccent[500] ,
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

  if (snaps.length === 0) {
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
        title="Snaps"
        subtitle="List of Snaps"
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
          rows={snaps}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
    </Box>
  );
};

export default Snaps;