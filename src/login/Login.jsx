import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import {  signInWithEmailAndPassword   } from 'firebase/auth';
import { auth } from '../firebase';
import {  signOut } from "firebase/auth";
import {useNavigate } from 'react-router-dom'
import axios from 'axios';
import logo from '../assets/logo.png'

const Login = ({setUsername, setUserAccessToken}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const apiUrl  = 'https://api-gateway-oomh.onrender.com/'
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
  
    try {
      const userCredential = await signInWithEmailAndPassword(auth, data.get('email'), data.get('password'));
  
      // Signed in
      const userFirebase = userCredential.user;
      const headers = {
        'Authorization': 'Bearer ' + userFirebase.accessToken,
      };
  
      // Make a GET request to the 'user' endpoint
      const response = await axios.get(apiUrl + 'user', { headers });
  
      // Handle the success response
      console.log('Response:', response.data);
      const user = response.data;

      setUserAccessToken(userFirebase.accessToken);
      setUsername(user.username);
  
      if (user.accessLevel !== 'admin') {
        await signOut(auth);
        // Sign-out successful.
        navigate("/");
        console.log("Signed out successfully");
      }

      navigate("/dashboard");
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage)
    }
  };

  return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main', width: '150px', height: '150px' }}>
          <img className="logo-login" src={logo} alt="SnapMsg" width="150px" />
          </Avatar>
          <Typography component="h1" variant="h5">
            Administrator Panel
          </Typography>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              sx={{
                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'secondary.main', // Change this to the color you want
                },
                '& .MuiAutocomplete-input:focus': {
                    backgroundColor: "secondary.main !important", /* Set the desired background color */
                },
                '& .MuiAutocomplete-listbox li:hover': {
                    backgroundColor: "secondary.main !important", /* Prevent hover color change */
                },
                '& .MuiAutocomplete-input': {
                    backgroundColor: "secondary.main !important", /* Set the desired background color */
                },
              }}
              InputProps={{
                style: {
                  height: '3rem',
                  backgroundColor: 'primary.main', // Set the desired background color
                },
              }}
              InputLabelProps={{
                style: {
                  color: isFocused ? 'secondary.main' : 'initial',
                },
              }}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              sx={{
                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'secondary.main', // Change this to the color you want
                },
              }}
              InputProps={{
                style: {
                  height: '3rem',
                  backgroundColor: 'primary.main', // Set the desired background color
                },
              }}
              InputLabelProps={{
                style: {
                  height: '3rem',
                  color: isFocused ? 'secondary.main' : 'initial',
                },
              }}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              color="secondary"
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link 
                href="#" 
                variant="body2"
                color={isHovered ? 'secondary.main' : 'secondary'}
                sx={{
                    '&:hover': {
                    color: 'white',
                    },
                }}
                
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                >
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link 
                href="/register" 
                variant="body2"
                color={isHovered ? 'secondary.main' : 'secondary'}
                sx={{
                    '&:hover': {
                    color: 'white',
                    },
                }}
                
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                >
                  Don't have an account? Sign Up
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
  );
}

export default Login
