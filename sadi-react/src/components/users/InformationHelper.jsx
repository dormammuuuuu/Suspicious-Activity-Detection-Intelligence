import React from 'react'
import { HiOutlineInformationCircle } from 'react-icons/hi'


const InformationHelper = ({ infoTitle, infoBody }) => {
   return (
      <div className="bg-blue-50 border-t-4 border-blue-300 rounded-md text-gray-900 px-2 py-1 shadow-sm mx-14" role="alert">
         <div className="flex">
            <div className="py-1">
               <HiOutlineInformationCircle className='h-6 w-6 text-blue-500 mr-4' />
            </div>
            <div>
               <p className="font-bold">{infoTitle}</p>
               <p className="text-sm">
                  {infoBody}
               </p>
            </div>
         </div>
      </div>
   )
}

export default InformationHelper