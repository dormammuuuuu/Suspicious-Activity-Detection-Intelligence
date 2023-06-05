import React from 'react'

import { InputBox, Button, InformationHelper } from '../'
const StepOneInputName = ({ newFaceUser, handleNewUserInput, error, handleRegisterBtn, progressCount }) => {
   const handleKeyPress = (event) => {
      if (event.key === 'Enter') {
         event.preventDefault();
         handleRegisterBtn()
      }
   };
   return (
      <div className={`md:w-5/6 md:mx-auto  h-4/5 transform duration-500  absolute transition-transform ${progressCount === 0 ? 'translate-x-0' : '-translate-x-[110%]'
         }`}>
         <InformationHelper infoTitle="Register New User" infoBody="Please note that the user's name cannot be modified after it has been saved." />


         <div className='flex justify-center flex-col items-center h-full '>
            <div className='flex justify-center flex-col items-center w-full h-full md:w-3/6 pt-7'>
               <InputBox placeholder="Name" type="text" name="newFaceUser" onChange={handleNewUserInput} onKeyPress={handleKeyPress} value={newFaceUser} error={error.userFace} />


            </div>
            <div className="flex justify-center items-end my-2 ">
               <Button className="w-[220px] mt-3 bg-sblue hover:bg-blue-700 text-white font-normal" label="Continue" onClick={handleRegisterBtn} />

            </div>
         </div>
      </div>
   )
}

export default StepOneInputName