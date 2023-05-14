import React, { useState, useRef } from 'react'
import { InputBox, Button } from '../components'
import { useNavigate } from 'react-router-dom';
import LoadingBar from 'react-top-loading-bar'
import axios from 'axios'
const API_BASE_URL = 'http://localhost:5000/api'

const ResetPassword = () => {
   const navigate = useNavigate();
   const loadingRef = useRef(null);

   const [newPassword, setNewPassword] = useState('')
   const [confirmNewPassword, setConfirmNewPassword] = useState('')
   const [error, setError] = useState('')
   const [isSuccess, setIsSuccess] = useState(false)



   const handleNewPassword = (event) => {
      setNewPassword(event.target.value)
   }

   const handleConfirmNewPassword = (event) => {
      setConfirmNewPassword(event.target.value)
   }

   const handleGoBackToLogin = () => { navigate('/login') }
   const handleCancel = () => { navigate('/login') }
   const handleConfirm = async () => {
      try {
         loadingRef.current.continuousStart();
         const response = await axios.post(`${API_BASE_URL}/reset-password`, {
            new_password: newPassword, confirm_new_password: confirmNewPassword
         });
         console.log("response: ", response.data);
         if (response.data.status === 'success') {
            loadingRef.current.complete();
            setIsSuccess(true)
         } else {
            loadingRef.current.complete();
            setIsSuccess(false)
            setError(response.data.error);
         }
      } catch (error) {
         setIsSuccess(false)
         loadingRef.current.complete();
         console.log(error);
      }

   }
   return (
      <div className='w-screen h-screen flex items-center justify-center bg-sblue-alt'>
         <div className='rounded-xl bg-white p-7 max-w-md w-full relative overflow-hidden'>
            <LoadingBar
               color='#6875F5'
               ref={loadingRef}
               height={5}
               transitionTime={100}
               containerStyle={{ position: 'absolute', top: '0', left: '0', width: '100%' }}
            />

            {
               isSuccess ? (
                  <>
                     <h1 className='mb-3 text-2xl font-semibold text-sblue  '>Verified!</h1>
                     <p className='text-sm text-sgray-400 mb-10'>You have successfully verified your account.</p>
                     <Button className='w-full mt-52 bg-sblue hover:bg-blue-700 text-white' label='Go back to Login' onClick={handleGoBackToLogin} />
                  </>
               ) : (
                  <>
                     <h1 className='mb-10 text-2xl font-semibold text-sblue  '>Reset Password</h1>
                     <InputBox label='New Password' type='password' name='newPassword' onChange={handleNewPassword} error={error.new_password} />
                     <InputBox label='Confirm Password' type='password' name='confirmPassword' onChange={handleConfirmNewPassword} error={error.confirm_new_password} />
                     <div className="flex justify-end gap-3">
                        <Button className='w-32 mt-10 bg-sblue-alt hover:bg-blue-100 text-sblue' label='Cancel' onClick={handleCancel} />
                        <Button className='w-32 mt-10 bg-sblue hover:bg-blue-700 text-white' label='Confirm' onClick={handleConfirm} />
                     </div>
                  </>
               )
            }
         </div>
      </div>
   )
}

export default ResetPassword