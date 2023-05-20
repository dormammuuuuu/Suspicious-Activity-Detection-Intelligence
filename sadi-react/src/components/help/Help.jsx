import React, { useEffect, useState } from 'react'

import { AccordionItem } from '../'

const Help = () => {



   return (
      <div className='p-8'>
         <h1 className='text-lg font-semibold text-sgray-400'>Frequently Asked Questions</h1>
         <div className="accordion">
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
            /> */}
         </div>
      </div>

   );
}

export default Help