import React, { useState } from 'react';
import { AccordionItem, Layout } from '../';
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
      <Layout>
         <h1 className="text-lg font-bold  mb-6 text-sgray-400 py-1 px-2">Frequently Asked Questions</h1>
         <div className='overflow-y-scroll h-full'>
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
      </Layout>
   );
};

export default Help;

