/* eslint-disable jsx-a11y/img-redundant-alt */
import React from 'react'
import { HiOutlineInformationCircle } from 'react-icons/hi'

import CameraSourceDropdownSetup from './CameraSourceSetup'
import { Button } from '../';


const FaceRegistrationSetup = ({ registerUserFace }) => {




   const handleStoreFaceData = () => {
      // Call the function with the userData object
      registerUserFace();
   };

   return (
      <div className='w-full h-full'>
         <div className='w-full rounded-xl bg-sblue-alt  p-3'>
            <span className='flex items-center  gap-x-2 text-sblue text-base'>
               <span className=' text-2xl '><HiOutlineInformationCircle /></span> Register your face</span>
            <p className='text-sgray-300 text-xs font-normal mt-2'>Please register your face to set up the device. By doing so, the device will know that you are the owner and it will only respond to your face, ensuring the better accuracy and security.</p>
         </div>



         <CameraSourceDropdownSetup />
         <div className="absolute bottom-0 right-0">
            <Button className="w-32 mt-3" label="NEXT" onClick={handleStoreFaceData} />
         </div>

      </div>
   )
}
export default FaceRegistrationSetup