import React, { useState, useRef } from 'react'
import { InputBox, Button, Logov2 } from '../components'
import { useNavigate } from 'react-router-dom';
import LoadingBar from 'react-top-loading-bar'

const ForgotPassword = () => {
   const navigate = useNavigate();
   const loadingRef = useRef(null);

   const [code, setcode] = useState('');
   const [error, setError] = useState('')

   const handleCodeChange = (event) => {
      setcode(event.target.value)
   }

   const handleCancel = () => { navigate('/login') }

   const handleConfirm = () => {
      loadingRef.current.continuousStart();
      loadingRef.current.complete();
      navigate('/reset-password')
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

            <h1 className=' mb-3  text-2xl font-semibold text-sblue  '>Please check your email</h1>
            <p className='text-sm text-sgray-400 mb-10'>We’ve sent a code to <span className='font-semibold'>shrnatienza@gmail.com</span></p>
            {/* <p className='text-red-500 text-xs mb-3'>{message}</p> */}
            <InputBox
               label='Enter the code below'
               type='text'
               name='code'
               onChange={handleCodeChange}
               error={error.username}
            />
            <div className="flex justify-end gap-3">
               <Button className='w-32 mt-20 bg-sblue-alt hover:bg-blue-100 text-sblue' label='Cancel' onClick={handleCancel} />
               <Button className='w-32 mt-20 bg-sblue hover:bg-blue-700 text-white' label='Confirm' onClick={handleConfirm} />
            </div>
         </div>
      </div>
   )
}

export default ForgotPassword