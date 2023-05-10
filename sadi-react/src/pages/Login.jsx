import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Cookies from 'js-cookie';
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';




import InputBox from '../components/InputBox'
import InputCheckBox from '../components/InputCheckBox'
import Button from '../components/Button'
import { Logo } from '../components'


const Login = () => {
   const navigate = useNavigate();

   const [username, setUsername] = useState('')
   const [password, setPassword] = useState('')
   const [error, setError] = useState('')
   const [message, setMessage] = useState('')

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
         axios.post('http://localhost:5000/api/login', {
            username: username,
            password: password
         })
            .then(res => {
               console.log(res.data)
               if (res.data.status === 'success') {
                  console.log(res.data)
                  Cookies.set('token', res.data.token, { expires: 3600 });
                  window.location.href = '/dashboard'
               } else {
                  setError(res.data.error)
                  setMessage(res.data.message)
               }
            })
      } catch (error) {
         console.error(error)
      }
   }


   return (
      <div className='w-screen h-screen flex items-center justify-center'>

         <div className='rounded-xl bg-white p-7 sm:max-w-xs w-full 2xl:max-w-sm'>
            <Logo />
            <h1 className='text-center mt-6 mb-10 text-2xl font-semibold text-neutral-600'>Login</h1>
            <p className='text-red-500 text-xs mb-3'>{message}</p>
            <InputBox label='Username' type='text' name='username' onChange={handleUsernameChange} error={error.username} />
            <InputBox label='Password' type='password' name='password' onChange={handlePasswordChange} error={error.password} />
            <Link to='/forgot' className='text-indigo-500 text-xs text-right block'>Forgot password?</Link>
            <Button className='w-full mt-20 bg-indigo-500' label='Login' onClick={handleLogin} />
         </div>
      </div>
   )
}

export default Login