import React from 'react'
import { FiChevronsRight } from 'react-icons/fi'

const BreadcrumbStepper = ({ progressCount }) => {
   return (
      <ol
         className="flex justify-center items-center  p-3  space-x-2 text-sm font-medium text-center text-gray-500
       bg-white border border-gray-200 rounded-lg shadow-sm sm:mx-5 sm:my-3  sm:p-4 sm:space-x-4 md:w-5/6 md:mx-auto"
      >
         <li className={`flex items-center  justify-center ${progressCount >= 0 ? 'text-sblue ' : 'text-sgray-400'}`}>
            <div className={`flex items-center justify-center w-5 h-5 mr-2 text-xs border  ${progressCount >= 0 ? 'border-sblue' : 'border-sgray-400'} 
            rounded-full shrink-0`}
            >1</div>
            <h1 className='pt-0.5'>Register Name</h1>
            <FiChevronsRight className="w-5 h-5 ml-2 sm:ml-4" />
         </li>
         <li className={`flex items-center justify-center ${progressCount >= 1 ? 'text-sblue ' : 'text-sgray-400'}`}>
            <span className={`flex items-center justify-center w-5 h-5 mr-2 text-xs border ${progressCount >= 1 ? 'border-sblue' : 'border-sgray-400'}  rounded-full 
            shrink-0`}>2</span>
            <h1 className='pt-0.5'>Capture Face</h1>
            <FiChevronsRight className="w-5 h-5 ml-2 sm:ml-4" />
         </li>
         <li className={`flex items-center justify-center ${progressCount >= 2 ? 'text-sblue ' : 'text-sgray-400'}`}>
            <span className={`flex items-center justify-center w-5 h-5 mr-2 text-xs border ${progressCount >= 2 ? 'border-sblue' : 'border-sgray-400'} rounded-full 
            shrink-0`}>3</span>
            <h1 className='pt-0.5'>Complete</h1>
         </li>
      </ol>
   )
}

export default BreadcrumbStepper