import React, { useEffect, useState, useRef } from 'react';
import { FaceFrame, Spinner } from '../';
import axios from 'axios';

const SADI_API_URL = 'http://localhost:5000/api';

const CameraFaceDetection = ({ handleStoreFaceData, deviceKey, faceRegisterName }) => {
   const [vidSrc, setVidSrc] = useState('');
   const [loading, setLoading] = useState(true);
   const name = faceRegisterName.replace(/\s/g, '');
   const progressRef = useRef(null); // Reference to the interval

   useEffect(() => {
      const fetchFaceScanner = async () => {
         try {
            const url = `${SADI_API_URL}/scanner/user=${name}&deviceKey=${deviceKey}&width=440&height=256`;
            setLoading(false);
            setVidSrc(url);
         } catch (error) {
            console.error(error);
         }
      };

      const handleStop = async () => {
         const response = await axios.get(`${SADI_API_URL}/get-recognition-status`);
         console.log('response', response);
         if (response.data.status) {
            clearInterval(progressRef.current); // Clear the interval using the reference
            handleStoreFaceData();
         }
      };

      setTimeout(() => {
         fetchFaceScanner();
      }, 3000);

      // Start the interval and store the reference
      progressRef.current = setInterval(() => {
         handleStop();
      }, 1000);

      // Clean up the interval on component unmount
      return () => {
         clearInterval(progressRef.current);
      };
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