import React from 'react'
import { IoClose } from 'react-icons/io5'

const CloseModalButton = ({ closeModal }) => {
   return (
      <button type="button"
         onClick={closeModal}
         className="absolute close-button top-3 right-2.5 text-gray-400 bg-transparent
       hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex 
        items-center"
         data-modal-hide="authentication-modal">
         <IoClose className="w-6 h-6" />
         <span className="sr-only">Close modal</span>
      </button>
   )
}

export default CloseModalButton