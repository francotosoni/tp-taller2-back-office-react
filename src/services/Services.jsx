import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";
import WifiTetheringIcon from '@mui/icons-material/WifiTethering';
import WifiTetheringOffIcon from '@mui/icons-material/WifiTetheringOff';
import Header from "../components/Header";
import StatBox from "../components/StatBox";
import { onAuthStateChanged } from "firebase/auth";
import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import { BarChart } from '@mui/x-charts/BarChart';
import axios from 'axios';
import countryList from 'country-list';
import { Person } from "@mui/icons-material";

const Services = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const apiUrl  = 'https://api-gateway-oomh.onrender.com/'

  const [metric, setMetric] = useState(0);
  const [snap, setSnap] = useState(0);
  const [user, setUser] = useState(0);
  const [notification, setNotification] = useState("");

  useEffect(()=>{
    onAuthStateChanged(auth, (user) => {
        if (user) {
          user.getIdToken().then( async (accessToken) => {
            const headers = {
              'Authorization': 'Bearer '+ accessToken , 
            };


          const responseMetric = await axios.get(apiUrl + 'metric/health', { headers });
          //const responseSnap = await axios.get(apiUrl + 'snap/health', { headers });
          const responseUser = await axios.get(apiUrl + 'user/health', { headers });
          //const responseNotification = await axios.get(apiUrl + 'notification/health', { headers });

          console.log(responseMetric.status);
          console.log(responseUser);

          setMetric(responseMetric.status);
          setUser(responseUser.status);

          setSnap(responseMetric.status);
          setNotification(responseMetric.status);

          });
        } else {
          navigate("/");         
        }
      });
     
  }, []) 

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />
      </Box>
        {/* GRID & CHARTS */}
        <Box
          display="grid"
          gridTemplateColumns="repeat(8, 1fr)"
          gridAutoRows="140px"
          gap="20px"
        >
          
          <Box
            gridColumn="span 4"
            gridRow="span 2"
            backgroundColor={colors.primary[400]}
            p="30px"
          >
            <Typography variant="h3" fontWeight="600">
              User Microservice
            </Typography>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              mt="25px"
            >
              {user == 0 ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '10vh' }}>
                  <CircularProgress style={{ color: 'white', width: 40, height: 40 }} />
                </div>      
              ) : user != 200 ? (

                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: '10px' }}>
                  <WifiTetheringOffIcon sx={{ color: colors.redAccent[600], fontSize: "48px" }} />
                  <Typography color={colors.redAccent[500]} variant="h4" fontWeight="600">
                    Service Offline
                  </Typography>
                </div>
                
              ): (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: '10px' }}>
                <WifiTetheringIcon sx={{ color: colors.greenAccent[600], fontSize: "48px" }} />
                <Typography color={colors.greenAccent[500]} variant="h4" fontWeight="600">
                  Service Online
                </Typography>
                </div>
              )}
            </Box>
          </Box>

          <Box
            gridColumn="span 4"
            gridRow="span 2"
            backgroundColor={colors.primary[400]}
            p="30px"
          >
            <Typography variant="h3" fontWeight="600">
              Snap Microservice
            </Typography>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              mt="25px"
            >
              {snap == 0 ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '10vh' }}>
                  <CircularProgress style={{ color: 'white', width: 40, height: 40 }} />
                </div>      
              ) : snap != 200 ? (

                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: '10px' }}>
                  <WifiTetheringOffIcon sx={{ color: colors.redAccent[600], fontSize: "48px" }} />
                  <Typography color={colors.redAccent[500]} variant="h4" fontWeight="600">
                    Service Offline
                  </Typography>
                </div>
                
              ): (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: '10px' }}>
                <WifiTetheringIcon sx={{ color: colors.greenAccent[600], fontSize: "48px" }} />
                <Typography color={colors.greenAccent[500]} variant="h4" fontWeight="600">
                  Service Online
                </Typography>
                </div>
              )}
            </Box>
          </Box>

          <Box
            gridColumn="span 4"
            gridRow="span 2"
            backgroundColor={colors.primary[400]}
            p="30px"
          >
            <Typography variant="h3" fontWeight="600">
              Metrics Microservice
            </Typography>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              mt="25px"
            >
              {metric == 0 ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '10vh' }}>
                  <CircularProgress style={{ color: 'white', width: 40, height: 40 }} />
                </div>      
              ) : metric != 200 ? (

                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: '10px' }}>
                  <WifiTetheringOffIcon sx={{ color: colors.redAccent[600], fontSize: "48px" }} />
                  <Typography color={colors.redAccent[500]} variant="h4" fontWeight="600">
                    Service Offline
                  </Typography>
                </div>
                
              ): (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: '10px' }}>
                <WifiTetheringIcon sx={{ color: colors.greenAccent[600], fontSize: "48px" }} />
                <Typography color={colors.greenAccent[500]} variant="h4" fontWeight="600">
                  Service Online
                </Typography>
                </div>
              )}
            </Box>
          </Box>

          <Box
            gridColumn="span 4"
            gridRow="span 2"
            backgroundColor={colors.primary[400]}
            p="30px"
          >
            <Typography variant="h3" fontWeight="600">
              Notifications Microservice
            </Typography>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              mt="25px"
            >
              {notification == 0 ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '10vh' }}>
                  <CircularProgress style={{ color: 'white', width: 40, height: 40 }} />
                </div>      
              ) : notification != 200 ? (

                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: '10px' }}>
                  <WifiTetheringOffIcon sx={{ color: colors.redAccent[600], fontSize: "48px" }} />
                  <Typography color={colors.redAccent[500]} variant="h4" fontWeight="600">
                    Service Offline
                  </Typography>
                </div>
                
              ): (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: '10px' }}>
                <WifiTetheringIcon sx={{ color: colors.greenAccent[600], fontSize: "48px" }} />
                <Typography color={colors.greenAccent[500]} variant="h4" fontWeight="600">
                  Service Online
                </Typography>
                </div>
              )}
            </Box>
          </Box>
        </Box>
    </Box>
  ); 
};

export default Services;