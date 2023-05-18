import React from 'react'
import classNames from 'classnames';
import { HiChevronUp, HiOutlineVideoCamera } from 'react-icons/hi';

const DeviceDropdown = ({ devices, selectedDeviceId, handleDeviceChange, handleClick, isOpen }) => (
   <div className='relative'>
      <button
         className="relative w-full text-sgray-400 hover:text-sblue focus:text-sblue border border-sgray-400 hover:border-sblue focus:border-sblue focus:ring-2 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex justify-between items-center transition duration-500 ease-in-out"
         type="button"
         onClick={handleClick}
      >
         {selectedDeviceId ? devices.find(device => device.deviceId === selectedDeviceId)?.label : 'Select a source'}
         <HiChevronUp className='text-2xl' />
      </button>
      {isOpen && (
         <div className="z-10 bg-white rounded-lg shadow w-full absolute bottom-0 left-0 mb-14 border border-sgray-200 transition duration-300 ease-in-out">
            <ul className="py-2 text-sm text-sgray-400 overflow-hidden">
               {devices.map((source, key) => (
                  <li
                     key={source.deviceId}
                     data-source-id={source.deviceId}
                     onClick={(e) => handleDeviceChange(e, key)}
                     className='dropdown-item cursor-pointer'
                  >
                     <span
                        className={classNames(
                           'dd-span flex items-center  rounded-lg mx- px-4 py-2.5 font-semibold transition duration-200 hover:bg-blue-100',
                           {
                              'bg-blue-100': selectedDeviceId && selectedDeviceId === source.deviceId,
                           }
                        )}
                     >
                        <HiOutlineVideoCamera className="text-xl mr-2" />
                        {source.label || `Device ${key + 1}`}
                     </span>

                  </li>
               ))}
            </ul>
         </div>
      )}
   </div >
);

export default DeviceDropdown