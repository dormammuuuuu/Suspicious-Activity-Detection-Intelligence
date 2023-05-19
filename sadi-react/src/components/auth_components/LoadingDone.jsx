import React from 'react'


const LoadingDone = ({ isLoadingCompleted, headerText, bodyText }) => {
   return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
         <div className={`circle-loader${isLoadingCompleted ? ' load-complete' : ''}`}>
            <div className={`checkmark draw ${isLoadingCompleted ? 'block' : 'hidden'}`}></div>
         </div>

         <h1 className='text-2xl'> {isLoadingCompleted && headerText} </h1>
         <p className='font-light text-sm text-center  mx-auto mb-16 w-5/6'>{isLoadingCompleted && bodyText}</p>


      </div>
   )
}

export default LoadingDone