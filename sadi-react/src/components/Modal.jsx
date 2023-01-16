import React, { useState } from 'react'

const Modal = ({ children, triggerText }) => {
    const [showModal, setShowModal] = useState(false);
  
    return (
      <>
        <button onClick={() => setShowModal(true)}>{triggerText}</button>
        {showModal && (
          <div>
            <button onClick={() => setShowModal(false)}>Close</button>
            {children}
          </div>
        )}
      </>
    );
  };

export default Modal