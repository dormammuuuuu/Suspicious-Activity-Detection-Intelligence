/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useState, useEffect } from 'react'
import { HiOutlineInformationCircle } from 'react-icons/hi'

import { UserCameraSourceInput, CameraFaceDetection, InformationHelper } from '..';


const StepTwoUserFaceRegistration = ({ registerUserFace, faceRegisterName, progressCount }) => {

   const [isSourceDone, setisSourceDone] = useState(false)
   const [deviceKey, setDeviceKey] = useState(null);

   const handleSourceDone = (deviceKey) => {
      setDeviceKey(deviceKey);
      setisSourceDone(true);
   };
   useEffect(() => {
      console.log('FaceRegistrationSetup = faceRegisterName:', faceRegisterName);
   }, [faceRegisterName]);
   useEffect(() => {
      console.log('deviceKey:', deviceKey);
   }, [deviceKey]);


   const handleStoreFaceData = () => {
      // Call the function with the userData object
      registerUserFace();
   };

   return (
      <div className={`flex flex-col items-center  md:w-5/6 md:mx-auto  h-4/5 mt-2  transform duration-500 transition-transform ${progressCount === 1 ? 'translate-x-0' : 'translate-x-[110%]'} ${progressCount > 2 ? 'translate-x-[110%]' : ''}`}>
         <InformationHelper infoTitle="Face Registration" infoBody=" Please register your face to set up the device.
                        By doing so, the device will know that you are the owner and it will only respond to your face,
                        ensuring better accuracy and security." />

         <div className='flex justify-center  w-full relative'>
            {
               !isSourceDone ?
                  <div
                     className={`flex flex-col items-center transform duration-500 w-full transition-transform ${!isSourceDone ? 'translate-x-0' : '-translate-x-[512px]'
                        }`}
                  >
                     <UserCameraSourceInput handleSourceDone={handleSourceDone} />
                  </div>
                  :
                  <div
                     className={`absolute transform duration-500 w-[440px] first-letter:transition-transform ${isSourceDone ? 'translate-x-0' : 'translate-x-[512px]'} `}
                  >

                     <CameraFaceDetection handleStoreFaceData={handleStoreFaceData} deviceKey={deviceKey} faceRegisterName={faceRegisterName} />
                  </div>
            }
         </div>




      </div>
   )
}
export default StepTwoUserFaceRegistration