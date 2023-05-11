/* eslint-disable jsx-a11y/img-redundant-alt */
import React from 'react'
import { HiOutlineInformationCircle } from 'react-icons/hi'

import CameraSourceDropdownSetup from './CameraSourceDropdownSetup'
import { Button } from '../';


const FaceRegistrationSetup = ({ registerUserFace }) => {
   const [cameraSources, setCameraSources] = React.useState('')

   const items = [
      {
         id: 1,
         name: "Fullhan Webcam",
      },
      {
         id: 2,
         name: "DroidCam Source 1",
      },
      {
         id: 3,
         name: "GoPro Webcam",
      },
      {
         id: 4,
         name: "OBS Virtual camera",
      },
   ];


   const handleStoreFaceData = () => {
      const userData = {

         // confirmpassword: confPassword,
      };

      // Call the function with the userData object
      registerUserFace(userData);
   };

   return (
      <div className='w-full h-full'>
         <div className='w-full rounded-xl bg-sblue-alt  p-3'>
            <span className='flex items-center  gap-x-2 text-sblue text-base'>
               <span className=' text-2xl '><HiOutlineInformationCircle /></span> Register your face</span>
            <p className='text-sgray-300 text-xs font-normal mt-2'>Please register your face to set up the device. By doing so, the device will know that you are the owner and it will only respond to your face, ensuring the better accuracy and security.</p>
         </div>

         <div className='w-full h-64 rounded-xl overflow-hidden my-5'>
            <img className='w-full h-full object-cover' src="https://images.unsplash.com/photo-1509967419530-da38b4704bc6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1195&q=80" alt="image" />
         </div>

         <CameraSourceDropdownSetup sources={items} />
         <div className="absolute bottom-0 right-0">
            <Button className="w-32 mt-3" label="NEXT" onClick={handleStoreFaceData} />
         </div>

      </div>
   )
}
export default FaceRegistrationSetup