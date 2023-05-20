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

            const response = await axios.get(url, {
               responseType: 'blob',
            });
            console.log('response', response)

            // Update the state using setVidSrc
            setVidSrc(url);
            setLoading(false); // Set loading to false once the data is loaded


         } catch (error) {
            console.error(error);
         }
         // 3000 milliseconds = 3 seconds
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
            <div className="flex justify-center items-center h-64">
               <Spinner size={64} color="#4C51BF" />
            </div>
         ) : (
            <div className="w-full h-64 rounded-xl overflow-hidden my-5 relative">
               <img
                  src={vidSrc}
                  alt="Webcam Video"
                  className="w-full h-full object-cover"
               />
               <div className="absolute inset-0 flex justify-center items-center">
                  <div className="w-full h-full object-cover">
                     <FaceFrame />
                  </div>
               </div>
            </div>
         )}

         <div className="absolute -bottom-28 right-0">
            <Button className="w-32 mt-3 bg-sblue hover:bg-blue-700 text-white" label="NEXT" onClick={handleStoreFaceData} />
         </div>
      </>
   );
};

export default CameraFaceDetection;