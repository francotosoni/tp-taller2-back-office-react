import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";
import PersonIcon from '@mui/icons-material/Person';
import NoAccountsIcon from '@mui/icons-material/NoAccounts';
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

const nameCountry = (code) => {
    const name = countryList.getName(code);
    return name || code;
}

const processCountries = (arrayCountry) => {
  const countCountry = arrayCountry.reduce((count, country) => {
    count[country] = (count[country] || 0) + 1;
    return count;
  }, {});

  const totalCountry = arrayCountry.length;

  const result = Object.entries(countCountry).map(([name, size]) => ({
    name,
    size,
    percent: (size / totalCountry) * 100,
  }));

  return result;
}

const getLast7Days = () => {
  const currentDate = new Date();
  const last7Days = [];

  for (let i = 6; i >= 0; i--) {
    const day = new Date(currentDate);
    day.setDate(currentDate.getDate() - i);

    const dayFormatted = `${day.getDate()}/${day.getMonth() + 1}`;
    last7Days.push(dayFormatted);
  }

  return last7Days;
};

const processDates = (arrayDates) => {
  const dateNow = new Date();
  const dateWeekAgo = new Date(dateNow);
  dateWeekAgo.setDate(dateNow.getDate() - 7);

  const sizePerDayObj = {};

  arrayDates.forEach((date) => {
    const currentDate = new Date(date);

    // Verifica si la fecha está en la última semana
    if (currentDate >= dateWeekAgo && currentDate <= dateNow) {
      // Formatea la fecha como una cadena en formato 'YYYY-MM-DD'
      const dateForm = currentDate.toISOString().split('T')[0];

      // Incrementa el recuento para ese día
      sizePerDayObj[dateForm] = (sizePerDayObj[dateForm] || 0) + 1;
    }
  });

  // Completa con ceros para los días que no tienen entradas
  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(dateNow);
    currentDate.setDate(dateNow.getDate() - 6 + i);
    const dateForm = currentDate.toISOString().split('T')[0];

    if (!(dateForm in sizePerDayObj)) {
      sizePerDayObj[dateForm] = 0;
    }
  }

  const sizePerDayArray = Object.entries(sizePerDayObj).map(([date, size]) => ({
    date,
    size
  }));

  sizePerDayArray.sort((a, b) => new Date(a.date) - new Date(b.date));
  const sizePerDay = sizePerDayArray.map((item) => item.size);

  return sizePerDay;
};


const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const apiUrl  = 'https://api-gateway-oomh.onrender.com/'
  const [users, setUsers] = useState(0);
  const [blocks, setBlocks] = useState(0);
  const [blockPercent, setBlockPercent] = useState(0);
  const [userPercent, setUserPercent] = useState("");
  const [countries, setCountries] = useState([]);
  const [loginsArray, setLoginsArray] = useState([]);
  const [registersArray, setRegistersArray] = useState([]);
  const [loginsArrayGoogle, setLoginsArrayGoogle] = useState([]);
  const [registersArrayGoogle, setRegistersArrayGoogle] = useState([]);
  const [blockArray, setBlockArray] = useState([]);
  const [changePasswordArray, setChangePasswordArray] = useState([]);
  const last7DaysArray = getLast7Days();

  useEffect(()=>{
    onAuthStateChanged(auth, (user) => {
        if (user) {
          user.getIdToken().then( async (accessToken) => {
            const headers = {
              'Authorization': 'Bearer '+ accessToken , 
            };
            const dateYestarday = new Date(new Date() - 24 * 60 * 60 * 1000);

            const responseLogins = await axios.get(apiUrl + 'metrics/sign-in-password', { headers });
            const arrayLogins = responseLogins.data.values.map(date => new Date(date));
            const logins = processDates(arrayLogins);

            const responseLoginsGoogle = await axios.get(apiUrl + 'metrics/sign-in-google', { headers });
            const arrayLoginsGoogle = responseLoginsGoogle.data.values.map(date => new Date(date));
            const loginsGoogle = processDates(arrayLoginsGoogle);

            const responseCountry = await axios.get(apiUrl + 'metrics/country', { headers });
            const arrayCountry = responseCountry.data.values.map(code => nameCountry(code));
            const lastCountries = processCountries(arrayCountry);
            
            const responseRegisters = await axios.get(apiUrl + 'metrics/sign-up-password', { headers });
            const arrayRegisters = responseRegisters.data.values.map(date => new Date(date));
            const lastRegisters = arrayRegisters.filter(date => date > dateYestarday);
            const registers = processDates(arrayRegisters);

            const responseRegistersGoogle = await axios.get(apiUrl + 'metrics/sign-up-google', { headers });
            const arrayRegistersGoogle = responseRegistersGoogle.data.values.map(date => new Date(date));
            const lastRegistersGoogle = arrayRegistersGoogle.filter(date => date > dateYestarday);
            const registersGoogle = processDates(arrayRegistersGoogle);

            const responseBlock = await axios.get(apiUrl + 'metrics/block', { headers });
            const arrayBlock = responseBlock.data.values.map(date => new Date(date));
            const blocks = processDates(arrayBlock);

            const responseChangesPassword = await axios.get(apiUrl + 'metrics/change-password', { headers });
            const arrayChangesPassword = responseChangesPassword.data.values.map(date => new Date(date));
            const changesPassword = processDates(arrayChangesPassword);
            
            const percent = (lastRegisters.length + lastRegistersGoogle.length) * 100 / (arrayRegisters.length + arrayRegistersGoogle.length);
            const blockPercent = (arrayBlock.length) * 100 / (arrayRegisters.length + arrayRegistersGoogle.length);

            setCountries(lastCountries);
            setBlocks(arrayBlock.length);
            setBlockPercent(`${blockPercent}%`);
            setUserPercent(`+${percent}%`);
            setUsers(arrayRegisters.length + arrayRegistersGoogle.length);
            setLoginsArray(logins);
            setLoginsArrayGoogle(loginsGoogle);
            setRegistersArrayGoogle(registersGoogle)
            setRegistersArray(registers);
            setBlockArray(blocks);
            setChangePasswordArray(changesPassword);
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
        gridTemplateColumns="repeat(10, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        <Box 
          gridColumn="span 6"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          overflow="auto"
          sx={{ width: '100%' }}>
          {registersArray.length != 0 && loginsArray.length != 0 ? (
            <BarChart
              xAxis={[{ scaleType: 'band', data: last7DaysArray }]}
              series={[{label:'Log in Password', data: loginsArray }, {label: 'Sign up Password', data: registersArray }]}

            />
          ) : (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '25vh' }}>
              <CircularProgress style={{ color: 'white', width: 30, height: 30 }} />
            </div>        
          )}
        </Box>

        <Box
          gridColumn="span 4"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={users}
            subtitle="Users"
            increase= {userPercent}
            percentTitle="in last 24 hours"
            icon={
              <PersonIcon
                sx={{ color: colors.greenAccent[600], fontSize: "32px" }}
              />
            }
          />
        </Box>

        <Box
          gridColumn="span 4"
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={blocks}
            subtitle="Users blocked"
            percentTitle="of total users"
            increase={blockPercent}
            icon={
              <NoAccountsIcon
                sx={{ color: colors.greenAccent[600], fontSize: "32px" }}
              />
            }
          />
        </Box>

        <Box 
          gridColumn="span 6"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          overflow="auto"
          sx={{ width: '100%' }}>
          {registersArrayGoogle.length != 0 && loginsArrayGoogle.length != 0 ? (
            <BarChart
              xAxis={[{ scaleType: 'band', data: last7DaysArray }]}
              series={[{label:'Log in Google', data: loginsArrayGoogle }, {label: 'Sign up Google', data: registersArrayGoogle }]}

            />
          ) : (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '25vh' }}>
              <CircularProgress style={{ color: 'white', width: 30, height: 30 }} />
            </div>        
          )}
        </Box> 

        <Box
          gridColumn="span 4"
          gridRow="span 4"
          backgroundColor={colors.primary[400]}
          overflow="auto"
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.primary[500]}`}
            colors={colors.grey[100]}
            p="15px"
          >
            <Typography color={colors.grey[100]} variant="h4" fontWeight="600">
              Country Based Traffic
            </Typography>
          </Box>
          {countries.map((country, i) => (
            <Box
              key={`${country.name}-${i}`}
              display="grid"
              gridTemplateColumns="8fr 3fr 1fr"
              gap="10px"
              alignItems="center"
              borderBottom={`4px solid ${colors.primary[500]}`}
              p="15px"
            >
              <Box>
                <Typography
                  color={colors.grey[100]}
                  variant="h5"
                  fontWeight="600"
                >
                  {country.name}
                </Typography>
              </Box>
              <Box color={colors.grey[100]}>{country.size}</Box>
              <Box
                backgroundColor={colors.greenAccent[500]}
                p="5px 10px"
                borderRadius="4px"
              >
                {parseInt(country.percent)}%
              </Box>
            </Box>
          ))}
        </Box>

        <Box 
          gridColumn="span 6"
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          overflow="auto"
          sx={{ width: '100%' }}>
          {changePasswordArray.length != 0 ? (
            <BarChart
              xAxis={[{ scaleType: 'band', data: last7DaysArray }]}
              series={[{label:'Changes of password', data: changePasswordArray }]}

            />
          ) : (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '25vh' }}>
              <CircularProgress style={{ color: 'white', width: 30, height: 30 }} />
            </div>        
          )}
        </Box> 
   
      </Box>
    </Box>
  ); 
};

export default Dashboard;