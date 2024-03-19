import React, { useState } from 'react';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Autocomplete from '@mui/material/Autocomplete';
import {  createUserWithEmailAndPassword  } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { styled } from '@mui/system';
import axios from 'axios';
import "../styles/Register.css";
import logo from '../assets/logo.png'


const AutocompleteContainer = styled(Autocomplete)`
  & .MuiAutocomplete-input:focus {
    background-color: secondary.main; /* Set the desired background color */
  }

  & .MuiAutocomplete-listbox li:hover {
    background-color: transparent !important; /* Prevent hover color change */
  }
`;

const Register = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [usernameValue, setUsernameValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [emailValue, setEmailValue] = useState('');
  const navigate = useNavigate();
  const apiUrl  = 'https://snapmsg-api-gateway.onrender.com/'

  const handleSubmit = async (event) => {
    event.preventDefault();

    await createUserWithEmailAndPassword(auth, emailValue, passwordValue)
      .then((userCredential) => {
          const userFirebase = userCredential.user;
          console.log(userFirebase);

          const user = {
            uid: userFirebase.uid,
            mail: emailValue,
            username: usernameValue,
            accessLevel: "admin",
          };

          const headers = {
            'Authorization': 'Bearer '+ userFirebase.accessToken , 
          };

          axios.post(apiUrl + 'user', user, { headers })
            .then(response => {
              // Handle the success response
              console.log('Response:', response.data);
            })
            .catch(error => {
              // Handle the error
              console.error('Error:', error);
            });
          navigate("/")
        })
      .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode, errorMessage);
      });
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
          Sign up
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
                  <TextField
                    name="username"
                    required
                    autoComplete='off'
                    type='text'
                    fullWidth
                    id="username"
                    label="Username"
                    value={usernameValue}
                    onChange={(e) => setUsernameValue(e.target.value)}
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
            </Grid>
            <Grid item xs={12}>
                    <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    value={emailValue}
                    onChange={(e) => setEmailValue(e.target.value)}
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
            </Grid>
            <Grid item xs={12}>
                <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                    value={passwordValue}
                    onChange={(e) => setPasswordValue(e.target.value)}
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
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            color="secondary"
          >
            Sign Up
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link 
                href="/" 
                variant="body2" 
                color={isHovered ? 'secondary.main' : 'secondary'}
                sx={{
                    '&:hover': {
                    color: 'white',
                    },
                }}

                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}>
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default Register;
