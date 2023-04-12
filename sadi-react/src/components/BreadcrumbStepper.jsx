import React from 'react'

const BreadcrumbStepper = () => {
   return (
      <ol
         className="flex justify-center items-center  p-3  space-x-2 text-sm font-medium text-center text-gray-500
       bg-white border border-gray-200 rounded-lg shadow-sm sm:mx-5 sm:my-3  sm:p-4 sm:space-x-4 md:w-5/6 md:mx-auto"
      >
         <li className="flex items-center text-blue-600 ">
            <span className="flex items-center justify-center w-5 h-5 mr-2 text-xs border border-blue-600 
            rounded-full shrink-0 "
            >
               1
            </span>
            Register<span className="hidden sm:inline-flex sm:ml-2">Name</span>
            <svg
               aria-hidden="true"
               className="w-4 h-4 ml-2 sm:ml-4"
               fill="none"
               stroke="currentColor"
               viewBox="0 0 24 24"
               xmlns="http://www.w3.org/2000/svg">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path>
            </svg>
         </li>
         <li className="flex items-center">
            <span className="flex items-center justify-center w-5 h-5 mr-2 text-xs border border-gray-500 rounded-full 
            shrink-0 "
            >
               2
            </span>
            Capture<span className="hidden sm:inline-flex sm:ml-2">Face</span>
            <svg
               aria-hidden="true"
               className="w-4 h-4 ml-2 sm:ml-4"
               fill="none"
               stroke="currentColor"
               viewBox="0 0 24 24"
               xmlns="http://www.w3.org/2000/svg">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path>
            </svg>
         </li>
         <li className="flex items-center">
            <span className="flex items-center justify-center w-5 h-5 mr-2 text-xs border border-gray-500 rounded-full 
            shrink-0 "
            >
               3
            </span>
            Complete
         </li>
      </ol>
   )
}

export default BreadcrumbStepper