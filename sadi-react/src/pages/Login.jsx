import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import LoadingBar from 'react-top-loading-bar'

import { InputBox, Button, Logov2 } from '../components'
const API_BASE_URL = 'http://localhost:5000/api'

const Login = () => {
   const navigate = useNavigate();
   const loadingRef = useRef(null);

   const [username, setUsername] = useState('')
   const [password, setPassword] = useState('')
   const [error, setError] = useState('')

   useEffect(() => {
      const token = Cookies.get('token');
      console.log("token", token)
      if (token) {
         navigate("/dashboard");
      }
   }, [navigate]);

   const handleUsernameChange = (event) => {
      setUsername(event.target.value)
   }

   const handlePasswordChange = (event) => {
      setPassword(event.target.value)
   }

   const handleLogin = async () => {
      try {
         loadingRef.current.continuousStart();
         axios.post(`${API_BASE_URL}/login`, {
            username: username,
            password: password
         })
            .then(res => {
               loadingRef.current.complete();
               console.log(res.data)
               if (res.data.status === 'success') {
                  console.log(res.data)
                  Cookies.set('token', res.data.token, { expires: 3600 });
                  navigate("/dashboard");
               } else {
                  setError(res.data.error)
               }
            })
      } catch (error) {
         console.error(error)
      }
   }

   const handleForgotPassword = async () => {
      try {
         loadingRef.current.continuousStart();
         const response = await axios.post(`${API_BASE_URL}/forgot-password`, { username: username });

         console.log(response.data);
         if (response.data.status === 'success') {
            loadingRef.current.complete();
            navigate('/forgotpassword', { state: response.data });
         } else {
            loadingRef.current.complete();
            setError(response.data.error);
         }
      } catch (error) {
         loadingRef.current.continuousStart();
         console.error(error);
      }
   };


   return (
      <div className='w-screen h-screen flex items-center justify-center bg-sblue-alt'>

         <div className='rounded-xl bg-white p-7 max-w-md w-full relative overflow-hidden'>
            <LoadingBar
               color='#6875F5'
               ref={loadingRef}
               waitingTime={100}
               height={5}
               transitionTime={100}
               containerStyle={{ position: 'absolute', top: '0', left: '0', width: '100%' }}
            />
            <Logov2 />
            <h1 className='text-center mt-5 mb-10 text-2xl font-semibold text-sblue  '>Login</h1>
            {/* <p className='text-red-500 text-xs mb-3'>{message}</p> */}
            <InputBox label='Username' type='text' name='username' onChange={handleUsernameChange} error={error.username} />
            <InputBox label='Password' type='password' name='password' onChange={handlePasswordChange} error={error.password} />
            <span
               type='button'
               className='text-sblue hover:text-blue-700 font-bold text-xs flex  justify-end mr-2 cursor-pointer'
               onClick={handleForgotPassword}
            >Forgot Password?</span>
            <Button className='w-full mt-20 bg-sblue hover:bg-blue-700 text-white' label='Login' onClick={handleLogin} />
         </div>
      </div>
   )
}

export default Login