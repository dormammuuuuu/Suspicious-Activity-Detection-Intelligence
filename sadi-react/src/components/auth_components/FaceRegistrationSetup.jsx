/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useState, useEffect } from 'react'
import { HiOutlineInformationCircle } from 'react-icons/hi'

import { CameraSourceSetup, CameraFaceDetection } from '../';


const FaceRegistrationSetup = ({ registerUserFace }) => {
   const [isSourceDone, setisSourceDone] = useState(false)
   const [deviceKey, setDeviceKey] = useState(null);

   const handleSourceDone = (deviceKey) => {
      setDeviceKey(deviceKey);
      setisSourceDone(true);
   };

   useEffect(() => {
      console.log('deviceKey:', deviceKey);
   }, [deviceKey]);


   const handleStoreFaceData = () => {
      // Call the function with the userData object
      registerUserFace();
   };

   return (
      <div className='w-full h-full relative'>
         <div className='w-full rounded-xl bg-sblue-alt  p-3'>
            <span className='flex items-center  gap-x-2 text-sblue text-base'>
               <span className=' text-2xl '><HiOutlineInformationCircle /></span> Register your face</span>
            <p className='text-sgray-300 text-xs font-normal mt-2'>Please register your face to set up the device. By doing so, the device will know that you are the owner and it will only respond to your face, ensuring the better accuracy and security.</p>
         </div>

         <div className='flex  justify-center w-full relative'>
            {
               !isSourceDone ?
                  <div
                     className={` transform duration-500 w-full  transition-transform  ${!isSourceDone ? 'translate-x-0' : '-translate-x-[512px]'
                        }`}
                  >
                     <CameraSourceSetup handleSourceDone={handleSourceDone} />
                  </div>
                  :
                  <div
                     className={`absolute transform duration-500 w-full first-letter:  transition-transform ${isSourceDone ? 'translate-x-0' : 'translate-x-[512px]'}`}
                  >

                     <CameraFaceDetection handleStoreFaceData={handleStoreFaceData} deviceKey={deviceKey} />
                  </div>
            }
         </div>




      </div>
   )
}
export default FaceRegistrationSetup