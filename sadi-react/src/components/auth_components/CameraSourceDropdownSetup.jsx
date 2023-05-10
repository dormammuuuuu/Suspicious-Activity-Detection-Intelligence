import React, { useState } from 'react'
import { Dropdown } from "flowbite-react";

const CameraSourceDropdownSetup = ({ sources }) => {
   const [isOpen, setIsOpen] = useState(false);

   const handleClick = () => {
      setIsOpen(!isOpen);
   };

   return (
      <div>
         <button

            class=" relative w-full text-sblue border border-sblue focus:ring-2 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex justify-between items-center"
            type="button"
            onClick={handleClick}
         >
            Dropdown button
            <svg class="w-4 h-4 ml-2" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
         </button>
         {isOpen && (
            <div class="z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 absolute">
               <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" >
                  {sources.map((source) => (
                     <li key={source.id}>
                        <span class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">{source.name}</span>
                     </li>
                  ))}
               </ul>
            </div>
         )}
      </div>
   );
}

export default CameraSourceDropdownSetup