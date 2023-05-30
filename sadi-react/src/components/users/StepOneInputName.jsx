import React from 'react'

import { InputBox, Button, InformationHelper } from '../'
const StepOneInputName = ({ newFaceUser, handleNewUserInput, error, handleRegisterBtn, progressCount }) => {
   return (
      <div className={`md:w-5/6 md:mx-auto  h-4/5 transform duration-500  absolute transition-transform ${progressCount === 0 ? 'translate-x-0' : '-translate-x-[110%]'
         }`}>
         <InformationHelper infoTitle="Register New User" infoBody="Please note that the user's name cannot be modified after it has been saved." />


         <div className='flex justify-center flex-col items-center h-full '>
            <div className='flex justify-center flex-col items-center w-full h-full md:w-3/6 pt-7'>
               <InputBox placeholder="Name" type="text" name="newFaceUser" onChange={handleNewUserInput} value={newFaceUser} error={error.userFace} />

               {/*<label className='relative cursor-pointer mb-4 input-txt-bg'>
                   <input type="text"
                     id="name"
                     name="name"
                     placeholder="Input name"
                     required
                     className='h-10 px-4 py-4  w-full  text-base  bg-gray-100 leading-tight text-gray-700  border-gray-200 border-[1px] rounded-lg border-opacity-50 outline-none focus:border-indigo-500
             focus:bg-white placeholder-gray-300 placeholder-opacity-0 transition duration-200  '
                     value={newFaceUser}
                     onChange={handleNewUserInput} />
                  <span className='text-base  text-gray-600  text-opacity-80 bg-gray-100 absolute left-5 top-[-2px] px-1 transition duration-200 input-text '>Name</span>
                  {showError && <p className="text-red-500 pl-2 pt-1  text-center text-xs italic">{newUserErrorText}</p>} 

               </label>*/}
            </div>
            <div className="flex justify-center items-end sm:my-5 ">
               <Button className="w-[440px] mt-3 bg-sblue hover:bg-blue-700 text-white font-normal" label="Register Face" onClick={handleRegisterBtn} />

            </div>
         </div>
      </div>
   )
}

export default StepOneInputName