import React, { useState, useEffect } from 'react';
import { HiChevronUp, HiOutlineVideoCamera } from 'react-icons/hi';
import classNames from 'classnames';

const CameraSourceDropdownSetup = ({ sources }) => {
   const [isOpen, setIsOpen] = useState(false);
   const [selectedSource, setSelectedSource] = useState(null);

   const handleClick = () => {
      setIsOpen(!isOpen);
   };

   const handleSourceSelect = (event) => {
      const target = event.target;
      const sourceId = target.closest('li').dataset.sourceId;
      const source = target.closest('li').innerText;

      setSelectedSource({
         id: sourceId,
         name: source
      });
   };

   useEffect(() => {
      // Apply class changes immediately when selectedSource changes
      const listItems = document.querySelectorAll('.dropdown-item');
      listItems.forEach((item) => {
         const sourceId = item.dataset.sourceId;
         const isSelected = selectedSource && selectedSource.id === sourceId;
         const childElement = item.querySelector('.dd-span'); // Replace '.child-element' with the actual class or selector of your child element
         childElement.classList.toggle('bg-sblue-alt', isSelected);
         childElement.classList.toggle('text-sblue', isSelected);
         item.classList.toggle('selected', isSelected);
      });
   }, [selectedSource]);

   return (
      <div className='relative'>
         <button
            className="relative w-full text-sgray-400 hover:text-sblue focus:text-sblue border border-sgray-400 hover:border-sblue focus:border-sblue focus:ring-2 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex justify-between items-center transition duration-300 ease-in-out"
            type="button"
            onClick={handleClick}
         >
            {selectedSource ? selectedSource.name : 'Select a source'}
            <HiChevronUp className='text-2xl' />
         </button>
         {isOpen && (
            <div className="z-10 bg-white rounded-lg shadow w-full absolute bottom-0 left-0 mb-14 border border-sgray-200 transition duration-300 ease-in-out">
               <ul className="py-2 text-sm text-sgray-400 overflow-hidden">
                  {sources.map((source) => (
                     <li
                        key={source.id}
                        data-source-id={source.id}
                        onClick={handleSourceSelect}
                        className='dropdown-item'
                     >
                        <span
                           className={classNames(
                              'dd-span flex items-center  rounded-lg mx- px-4 py-2.5 font-semibold transition duration-200',
                              {
                                 'bg-sblue-alt': selectedSource && selectedSource.id === source.id,
                              }
                           )}
                        >
                           <HiOutlineVideoCamera className="text-xl mr-2" />
                           {source.name}
                        </span>

                     </li>
                  ))}
               </ul>
            </div>
         )
         }
      </div >
   );
};

export default CameraSourceDropdownSetup;
