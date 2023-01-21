import React, { useState } from 'react'
import InputBox from './InputBox'
import InputCheckBox from './InputCheckBox'
import Button from './Button'
import { Link } from 'react-router-dom'
import axios from 'axios'

const Login = () => {
   const [username, setUsername] = useState('');
   const [password, setPassword] = useState('');
   const [error, setError] = useState('');

   const handleUsernameChange = (event) => {
      setUsername(event.target.value);
   }

   const handlePasswordChange = (event) => {
      setPassword(event.target.value);
   }

   const handleLogin = async () => {
      console.log(username, password)
      try{
         axios.post('http://localhost:5000/api/login', {
            username: username,
            password: password
         })
         .then(res => {
            console.log("Then")
            console.log(res.data)
            if (res.data.status === 'success'){
               console.log("Success")
            } else {
               setError(res.data.error)
            }
         })
      } catch (error) {
         console.error(error);
      }
   }


   return (
      <div className='w-screen h-screen flex items-center justify-center'>
         <div className="flex flex-col h-full w-full shadow-md bg-gradient-to-tr from-indigo-500 to-cyan-300 sm:h-fit sm:rounded-xl sm:max-w-md "> 
            <div className='flex grow items-center justify-center sm:h-48'>
               <h1 className='text-white text-3xl font-medium'>SADI</h1>
            </div>
            <div className='p-6 rounded-tl-3xl rounded-tr-3xl bg-white'>
               <InputBox label='Username' type='text' name='username' onChange={handleUsernameChange} error={error.username}/>
               <InputBox label='Password' type='password' name='password' onChange={handlePasswordChange} error={error.password}/>
               <InputCheckBox label='Remember Me' type='checkbox' name='remember-me'/>
               <Button className='w-full mt-5 bg-indigo-500' label='Login' onClick={handleLogin}/>
               <Link to='/forgot' className='text-indigo-500 text-xs mt-8 mb-2 block'>Reset password</Link>
            </div>
         </div>
      </div>
   )
}

export default Login