import React from 'react'
import { Button } from '../';

const DoneMessageSetup = () => {

   const redirectToLogin = () => {
      window.location.href = '/login';
   }
   return (
      <div className='w-full h-full '>
         <div className="flex flex-col items-center justify-center h-full">
            <h1 className='text-3xl'> All goods</h1>
         </div>
         <div className="absolute bottom-0 w-full">
            <Button className="w-full mt-3 bg-sblue hover:bg-blue-700 text-white" label="Login" onClick={redirectToLogin} />
         </div>
      </div>
   )
}

export default DoneMessageSetup