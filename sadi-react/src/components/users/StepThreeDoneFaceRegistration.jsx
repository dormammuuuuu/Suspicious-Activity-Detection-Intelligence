import React, { useState, useEffect } from 'react'
import { Button, LoadingDone } from '../';

const StepThreeDoneFaceRegistration = ({ progressCount, closeModal }) => {
   const [loading, setLoading] = useState(true);
   const [showButton, setShowButton] = useState(false);
   useEffect(() => {
      setTimeout(() => {
         setLoading(false);
         setShowButton(true)
      }, 3000);
   }, []);

   return (
      <div className={`w-full h-full absolute transform duration-500  transition-transform  ${progressCount === 2 ? 'translate-x-0' : 'translate-x-[110%]'
         } `}>
         {progressCount === 2 &&
            <>
               <LoadingDone
                  isLoadingCompleted={!loading}
                  headerText='Registration complete!'
                  bodyText='You have successfully registered your account. You may now proceed to login.'
               />

               {showButton &&
                  <div className="flex justify-center absolute bottom-16 w-full">
                     <Button className="w-[220px] bg-sblue hover:bg-blue-700 text-white" label="Close" onClick={closeModal} />
                  </div>
               }
            </>
         }
      </div>
   )
}

export default StepThreeDoneFaceRegistration