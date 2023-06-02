import React, { useEffect, useState } from 'react';
import { Button, FaceFrame, Spinner } from '../';
import axios from 'axios';

const SADI_API_URL = 'http://localhost:5000/api';

const CameraFaceDetection = ({ handleStoreFaceData, deviceKey, faceRegisterName }) => {
   const [vidSrc, setVidSrc] = useState('');
   const [loading, setLoading] = useState(true); // Add a loading state
   const [complete, setComplete] = useState(false); // Add a complete state
   console.log('faceRegisterName', faceRegisterName.replace(/\s/g, ''))
   const name = faceRegisterName.replace(/\s/g, '');
   useEffect(() => {
      const fetchFaceScanner = async () => {
         try {
            const url = `${SADI_API_URL}/scanner/user=${name}&deviceKey=${deviceKey}&width=440&height=256`;
            setLoading(false); // Set loading to false once the data is loaded
            setVidSrc(url);
         } catch (error) {
            console.error(error);
         }
      };
      const handleStop = async () => {
         const response = await axios.get(`${SADI_API_URL}/get-recognition-status`);
         console.log('response', response);
         if (response.data.status) {
            handleStoreFaceData();
         }
      }
      // Call the async function
      setTimeout(() => {
         fetchFaceScanner();
      }, 3000);

      setInterval(() => {
         handleStop();
      }, 500);
   }, []);

   return (
      <>
         {loading ? ( // Render the spinner loader if loading is true
            <div className="flex justify-center items-center  my-16 h-64 mb-10">
               <Spinner size={64} color="#4C51BF" />
            </div>
         ) : (
            <div className="w-full h-64 rounded-xl overflow-hidden my-16  relative">
               <img
                  src={vidSrc}
                  alt="Webcam Video"
                  className="w-full h-full object-fit object-center"
               />
               <div className="absolute inset-0 flex justify-center items-center">
                  <div className="w-full h-full object-cover">
                     <FaceFrame />
                  </div>
               </div>
            </div>
         )}

      </>
   );
};

export default CameraFaceDetection;