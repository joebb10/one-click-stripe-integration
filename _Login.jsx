import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Box, Container, Tab, Tabs, TextField, Button, Typography, IconButton } from '@mui/material';
import { Google, GitHub } from '@mui/icons-material';

import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, signInWithPopup, GoogleAuthProvider, GithubAuthProvider, getRedirectResult } from "firebase/auth";
import { auth } from '../firebase';
import { getDatabase, ref, set } from "firebase/database";


import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { showError, showSuccess } from '../Utils/Alerts';


const Login = () =>  {

    //> Use Navigate 
    const navigate = useNavigate();

    //> Firebase Variable
    const provider = new GoogleAuthProvider();
    const githubProvider = new GithubAuthProvider();

    //> Use State
    const [displayName,setDisplayName] = useState("");
    const [email,setEmail] = useState("");
    const [pswd,setPswd] = useState("");
    const [justifyActive, setJustifyActive] = useState('tab1');;

    const handleJustifyClick = (value) => {
        if (value === justifyActive) { 
            setDisplayName("")
            setEmail("")
            setPswd("")
            setJustifyActive("")
            return;}
        setJustifyActive(value);
    };

    useEffect(() => {
        if(localStorage.getItem("isLogin")){
          navigate('/uranx');
        }
      
        // Cleanup on unmount.
        return () => {
          localStorage.removeItem("isLogin");
        };
      }, [])
      
      const writeUserData = (userId, name, email, accountCreated, expDate) => {
        const db = getDatabase();
        set(ref(db, 'users/' + userId), {
          username: name,
          email: email,
          accountCreated: accountCreated,
          expDate: expDate
        });
      }
      

    //> Handle Functions 

    const handleSignUpForm = (e) => {
        e.preventDefault();
    
        if(displayName && email && pswd){
            createUserWithEmailAndPassword(auth, email, pswd)
            .then((res) => {
                updateProfile(auth.currentUser, {displayName: displayName})
                .then((resp2) => {console.log(resp2)})
                .catch((error) => {});
                
                // Get today's date
                let accountCreated = new Date().toISOString().slice(0, 10);
    
                // Calculate expiration date (1 month from today)
                let expDate = new Date();
                expDate.setMonth(expDate.getMonth() + 1);
                expDate = expDate.toISOString().slice(0, 10);
    
                // Write user data to database
                writeUserData(res.user.uid, displayName, email, accountCreated, expDate);
    
                showSuccess("User Added ");
            })
            .catch((error) => {
                showError(error.code);
            });
        }
        else{
            console.log("Fill all Fields ");
        } 
    }
    
    const handleSignInForm = (e) => {
        e.preventDefault()

        if(email && pswd){
            signInWithEmailAndPassword(auth, email,pswd)
            .then((res) => {
                localStorage.setItem("isLogin",true)
                navigate('/uranx');
            })
            .catch((error) => {
                if(error.code == 'auth/wrong-password'){
                    showError("Invalid Email / Password")
                }
            });
        }
        else{
            showError("Fill all Fields ")
        }
  
    }

    const handleGoogleSignIn = (e) => {
        signInWithPopup(auth, provider)
        .then((result) => {
            localStorage.setItem("isLogin",true)
            navigate('/uranx');            
        }).catch((error) => {
            showError(error.code);
        });
    }

    const handleGithubSignIn = (e) => {
        signInWithPopup(auth, githubProvider)
        .then((result) => {
            localStorage.setItem("isLogin",true)
          navigate('/uranx');
       }).catch((error) => {
           showError(error.code);
        });
    }

    return (
        <Container maxWidth="sm" sx={{ marginTop: 5 }}>
            <Tabs value={justifyActive} variant="fullWidth" onChange={(_, value) => handleJustifyClick(value)} >
                <Tab value="tab1" label="Login" />
                <Tab value="tab2" label="Register" />
            </Tabs>

            {justifyActive === "tab1" && (
                <Box sx={{ mt: 3, mb: 3 }}>
                    <Typography variant="subtitle1" align="center" sx={{ mb: 2 }}>Sign in with:</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
                        <IconButton color="primary" onClick={handleGoogleSignIn}>
                            <Google />
                        </IconButton>
                        <IconButton color="primary" onClick={handleGithubSignIn}>
                            <GitHub />
                        </IconButton>
                    </Box>
                    <form onSubmit={handleSignInForm} autoComplete="off">
                        <TextField fullWidth sx={{ mb: 2 }} label="Email address" type="email" onChange={(e) => setEmail(e.target.value)} autoComplete="off" />
                        <TextField fullWidth sx={{ mb: 2 }} label="Password" type="password" onChange={(e) => setPswd(e.target.value)} autoComplete="new-password" />
                        <Button fullWidth variant="contained" color="primary" type="submit">Sign in</Button>
                    </form>
                </Box>
            )}

            {justifyActive === "tab2" && (
                <Box sx={{ mt: 3 }}>
                    <form onSubmit={handleSignUpForm}>
                        <TextField fullWidth sx={{ mb: 2 }} label="Name" type="text" onChange={(e) => setDisplayName(e.target.value)} />
                        <TextField fullWidth sx={{ mb: 2 }} label="Email" type="email" onChange={(e) => setEmail(e.target.value)} />
                        <TextField fullWidth sx={{ mb: 2 }} label="Password" type="password" onChange={(e) => setPswd(e.target.value)} />
                        <Button fullWidth variant="contained" color="primary" type="submit">Sign up</Button>
                    </form>
                </Box>
            )}

            <ToastContainer />
        </Container>
    );
}

export default Login;