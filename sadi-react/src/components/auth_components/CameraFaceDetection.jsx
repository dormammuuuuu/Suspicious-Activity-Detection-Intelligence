import React, { useEffect, useState } from 'react';
import { Button, FaceFrame, Spinner } from '../';
import axios from 'axios';

const SADI_API_URL = 'http://localhost:5000/api';

const CameraFaceDetection = ({ handleStoreFaceData, deviceKey, faceRegisterName }) => {
   const [vidSrc, setVidSrc] = useState('');
   const [loading, setLoading] = useState(true); // Add a loading state
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
      // Call the async function
      setTimeout(() => {
         fetchFaceScanner();
      }, 3000);
   }, []);

   useEffect(() => {
      console.log('vidSrc', vidSrc);
   }, [vidSrc]);

   return (
      <>
         {loading ? ( // Render the spinner loader if loading is true
            <div className="flex justify-center items-center h-64 mb-10">
               <Spinner size={64} color="#4C51BF" />
            </div>
         ) : (
            <div className="w-full h-64 rounded-xl overflow-hidden my-5 relative">
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

         <div className=" flex justify-center">
            <Button className="w-[220px] mt-16 bg-sblue hover:bg-blue-700 text-white" label="NEXT" onClick={handleStoreFaceData} />
         </div>
      </>
   );
};

export default CameraFaceDetection;