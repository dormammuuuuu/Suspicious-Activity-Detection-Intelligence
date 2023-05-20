import React, { useState } from 'react';
import { AccordionItem } from '../';
import { faq_data } from '../../data/faq_data';

const Help = () => {
   // const [activeItem, setActiveItem] = useState(null);
   //? One active item at a time
   //
   // const handleClick = (index) => {
   //    if (activeItem === index) {
   //       setActiveItem(null);
   //    } else {
   //       setActiveItem(index);
   //    }
   // };

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


/* <div className="accordion">
            <AccordionItem
               title="What can JavaScript Do?"
               content="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Elementum sagittis vitae et leo duis ut. Ut tortor pretium viverra suspendisse potenti."
            />
            {/* <AccordionItem
               title="How does React work?"
               content="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Elementum sagittis vitae et leo duis ut. Ut tortor pretium viverra suspendisse potenti."
            />
            <AccordionItem
               title="Why is CSS important?"
               content="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Elementum sagittis vitae et leo duis ut. Ut tortor pretium viverra suspendisse potenti."
            /> *
         </div> */