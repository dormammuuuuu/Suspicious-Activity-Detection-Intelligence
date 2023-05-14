import React, { useState, useRef, useEffect } from 'react';
import { InputBox, Button } from '../components';
import { useNavigate, useLocation } from 'react-router-dom';
import LoadingBar from 'react-top-loading-bar';
import axios from 'axios'
const API_BASE_URL = 'http://localhost:5000/api'

const ForgotPassword = () => {
   const navigate = useNavigate();
   const location = useLocation();
   const state = location.state;

   const loadingRef = useRef(null);

   const [expTime, setExpTime] = useState('');
   const [userVerificationCode, setUserVerificationCode] = useState('');
   const [verificationCode, setVerificationCode] = useState('');
   const [error, setError] = useState('');

   useEffect(() => {
      if (state === null || !state.token || !state.email) {
         navigate('/404'); // Redirect to the login page if the state is invalid or missing required properties
         console.log("4040");
      } else {
         setExpTime(state.exp);
         setVerificationCode(state.verification_code);
      }
   }, [navigate, state])


   useEffect(() => {
      console.log('userVerificationCode', userVerificationCode);
      console.log('verificationCode', verificationCode);
   }, [userVerificationCode, verificationCode]);


   const handleCodeChange = (event) => {
      setUserVerificationCode(event.target.value);
   };

   const handleCancel = () => {
      navigate('/login');
   };

   const handleConfirm = async () => {
      try {
         loadingRef.current.continuousStart();
         const expirationTime = Date.parse(expTime) / 1000;
         const remainingSeconds = expirationTime - Math.floor(Date.now() / 1000);
         const response = await axios.post(`${API_BASE_URL}/confirm-code`, {
            user_verification_code: userVerificationCode,
            verification_code: verificationCode,
            expirationTime: expirationTime,
            remaining_seconds: remainingSeconds
         });

         console.log(response.data);
         if (response.data.status === 'success') {
            loadingRef.current.complete();
            console.log(response.data);
            navigate('/reset-password', { state: response.data });
         } else {
            loadingRef.current.complete();
            setError(response.data.error);
         }
      } catch (error) {
         loadingRef.current.complete();
         console.error(error);
      }
      // loadingRef.current.continuousStart();

      // loadingRef.current.complete();

   };

   const resendCode = async () => {
      try {
         loadingRef.current.continuousStart();
         const response = await axios.post(`${API_BASE_URL}/resend-code`, { email: state.email });

         console.log(response.data);
         if (response.data.status === 'success') {
            loadingRef.current.complete();
            console.log(response.data);
            setExpTime(response.data.exp);
            setVerificationCode(response.data.verification_code);

         } else {
            loadingRef.current.complete();
            setError(response.data.error);
         }
      } catch (error) {
         loadingRef.current.continuousStart();
         console.error(error);
      }
   }
   return (
      <div className="w-screen h-screen flex items-center justify-center bg-sblue-alt">
         <div className="rounded-xl bg-white p-7 max-w-md w-full relative overflow-hidden">
            <LoadingBar
               color="#6875F5"
               ref={loadingRef}
               height={5}
               transitionTime={100}
               containerStyle={{ position: 'absolute', top: '0', left: '0', width: '100%' }}
            />

            <h1 className="mb-3 text-2xl font-semibold text-sblue">Please check your email</h1>
            {state && (
               <>
                  <p className="text-sm text-sgray-400 mb-10">
                     We’ve sent a code to <span className="font-semibold">{state.email}</span>
                  </p>
                  <InputBox
                     label="Enter the code below"
                     type="text"
                     name="code"
                     onChange={handleCodeChange}
                     error={error.code}
                  />
                  <p className="text-[11px] flex  justify-end text-sgray-400 mt-3  mr-2 ">
                     Didn’t get a code? <span type="button" className='ml-0.5 cursor-pointer' onClick={resendCode}>
                        <u>Click to resend.</u>
                     </span>
                  </p>
                  <div className="flex justify-end gap-3">
                     <Button className="w-32 mt-20 bg-sblue-alt hover:bg-blue-100 text-sblue" label="Cancel" onClick={handleCancel} />
                     <Button className="w-32 mt-20 bg-sblue hover:bg-blue-700 text-white" label="Confirm" onClick={handleConfirm} />
                  </div>
               </>
            )}
         </div>
      </div>
   );
};

export default ForgotPassword;
