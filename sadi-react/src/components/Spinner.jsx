import React from 'react';

const Spinner = ({ size, color }) => {
   const spinnerSize = size || 40;
   const spinnerColor = color || '#000';

   return (
      <div
         style={{
            width: spinnerSize,
            height: spinnerSize,
            borderRadius: '50%',
            border: `4px solid ${spinnerColor}`,
            borderTop: '4px solid transparent',
            animation: 'spin 1s linear infinite',
         }}
      ></div>
   );
};

export default Spinner;
