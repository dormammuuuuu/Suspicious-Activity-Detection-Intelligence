import React, { useState } from 'react';
import { AccordionItem } from '../';
import { faq_data } from '../../data/faq_data';

const Help = () => {
   const [activeItems, setActiveItems] = useState([]);
   const handleClick = (index) => {
      if (activeItems.includes(index)) {
         setActiveItems(activeItems.filter((item) => item !== index));
      } else {
         setActiveItems([...activeItems, index]);
      }
   };
   return (
      <div className='overflow-y-auto h-full'>
         <h1 className="text-xl font-semibold mb-8 text-sgray-400">Frequently Asked Questions</h1>
         <div className="">
            <ul className="flex flex-col">
               {faq_data.map((item, index) => (
                  <AccordionItem
                     key={index}
                     active={activeItems.includes(index)}
                     onClick={() => handleClick(index)}
                     question={item.question}
                     answer={item.answer}
                  />
               ))}
            </ul>
         </div>
      </div>
   );
};

export default Help;

