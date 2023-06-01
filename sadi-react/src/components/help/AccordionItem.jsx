
import React from 'react';
import { HiOutlinePlusCircle, HiOutlineMinusCircle } from 'react-icons/hi';

const AccordionItem = ({ active, onClick, question, answer }) => {
   return (
      <li className={`my-1 rounded-lg  hover:bg-sblue-alt cursor-pointer ${active ? 'bg-sblue-alt' : 'bg-white  '} `} onClick={onClick}>
         <h2

            className="flex flex-row justify-between items-center font-semibold cursor-pointer"
         >
            <h3 className={`font-medium text-lg ${active ? 'text-sblue' : 'text-sgray-400'}`}>{question}</h3>
            <div className="transition-transform duration-300">
               {active ? (
                  <HiOutlineMinusCircle className="text-3xl mr-6 text-error transform rotate-180" />
               ) : (
                  <HiOutlinePlusCircle className="text-3xl mr-6 text-sblue font-light" />
               )}
            </div>
         </h2>
         <div className={`overflow-hidden max-h-0 duration-500 transition-all ${active ? 'max-h-96' : ''}`}>
            {answer.map((paragraph, index) => (
               <p key={index} className="text-sgray-400 font-light pl-10 pr-28 pb-4">
                  {typeof paragraph === 'string' ? (
                     <span dangerouslySetInnerHTML={{ __html: paragraph }} />
                  ) : (
                     paragraph
                  )}
               </p>
            ))}
         </div>
      </li>
   );
};

export default AccordionItem;
