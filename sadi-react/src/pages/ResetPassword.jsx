import React, { useState, useRef } from 'react'
import { InputBox, Button, Logov2 } from '../components'
import { useNavigate } from 'react-router-dom';
import LoadingBar from 'react-top-loading-bar'
import { div } from '@tensorflow/tfjs';

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
   const handleConfirm = () => {
      loadingRef.current.continuousStart();
      loadingRef.current.complete();
      setIsSuccess(true)
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
                     <InputBox label='New Password' type='text' name='username' onChange={handleNewPassword} error={error.username} />
                     <InputBox label='Confirm Password' type='password' name='password' onChange={handleConfirmNewPassword} error={error.password} />
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