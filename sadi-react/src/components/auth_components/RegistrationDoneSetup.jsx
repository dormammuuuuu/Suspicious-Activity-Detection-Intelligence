import React, { useEffect, useState } from 'react'
import { Button, LoadingDone } from '../';

const DoneMessageSetup = () => {
   const [loading, setLoading] = useState(true);


   const redirectToLogin = () => {
      window.location.href = '/login';
   };



   useEffect(() => {
      setTimeout(() => {
         setLoading(false);

      }, 3000);
   }, []);

   return (
      <div className='w-full h-full '>
         <LoadingDone
            isLoadingCompleted={!loading}
            headerText='Registration complete!'
            bodyText='You have successfully registered your account. You may now proceed to login.'
         />


         <div className="absolute bottom-0 w-full">
            <Button className="w-full mt-3 bg-sblue hover:bg-blue-700 text-white" label="Login" onClick={redirectToLogin} />
         </div>

      </div>
   )
}

export default DoneMessageSetup