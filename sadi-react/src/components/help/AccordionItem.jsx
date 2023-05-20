import React, { useState } from 'react';
import { HiOutlinePlusCircle, HiOutlineMinusCircle } from 'react-icons/hi';

const AccordionItem = ({ title, content }) => {
   const [isActive, setIsActive] = useState(false);

   const toggleAccordion = () => {
      setIsActive(!isActive);
   };

   return (
      <div className={`accordion-item ${isActive ? 'active' : ''}`}>
         <button
            className="relative flex flex-col w-full p-1 pl-3 pr-1 text-base font-medium text-gray-700 border border-gray-300 hover:text-red-600 hover:border-red-600 active:text-red-600 active:border-red-600"
            onClick={toggleAccordion}
         >
            <p>{title}</p>
            {isActive ? (
               <HiOutlineMinusCircle className="absolute top-0 right-0 m-1 text-lg text-gray-700" />
            ) : (
               <HiOutlinePlusCircle className="absolute top-0 right-0 m-1 text-lg text-gray-700" />
            )}
         </button>
         <div
            className={` ${isActive ? 'opacity-100 p-4 max-h-full transition-all duration-350' : 'opacity-0 p-0 max-h-0 transition-all duration-200'
               } border border-gray-300`}
         >
            <p className="text-base font-light">{content}</p>
         </div>
      </div>
   );
};

export default AccordionItem;