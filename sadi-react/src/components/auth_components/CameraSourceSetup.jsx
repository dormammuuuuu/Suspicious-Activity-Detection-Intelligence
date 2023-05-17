import React, { useState, useEffect } from 'react';
import { HiChevronUp, HiOutlineVideoCamera } from 'react-icons/hi';
import classNames from 'classnames';
import Webcam from 'react-webcam';
import axios from 'axios'

import { FaceFrame } from '../';


const CameraSourceDropdownSetup = () => {
   const [isOpen, setIsOpen] = useState(false);
   const [selectedDeviceId, setSelectedDeviceId] = useState('');
   const [devices, setDevices] = useState([]);

   const handleClick = () => {
      setIsOpen(!isOpen);
   };

   const handleDevices = React.useCallback((mediaDevices) => {
      const videoDevices = mediaDevices.filter(({ kind }) => kind === 'videoinput');
      setDevices(videoDevices);
      setSelectedDeviceId(videoDevices[0]?.deviceId || '');
   }, []);


   const handleDeviceChange = (event) => {
      const deviceId = event.target.closest('li').dataset.sourceId;
      console.log('Selected device', deviceId)
      setSelectedDeviceId(deviceId);
      setIsOpen(!isOpen);
   };

   const captureFrame = () => {
      const videoElement = document.querySelector('video');
      const canvas = document.createElement('canvas');
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
      const context = canvas.getContext('2d');
      context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
      const frame = canvas.toDataURL('image/jpeg', 0.8);

      // console.log(new Date().getTime());  // Log the capture timestamp

      // Send the captured frame to Flask
      axios.post('http://localhost:5000/api/reg_web', { frame })
         .then(res => {
            console.log('res:', res.data);
            console.log(new Date().getTime());  // Log the response timestamp
         });
   };


   const startCapture = () => {
      const videoElement = document.querySelector('video');

      const captureFrameLoop = () => {
         captureFrame(); // Capture and send frame

         // Continue capturing frames in a loop
         if (!videoElement.paused && !videoElement.ended) {
            requestAnimationFrame(captureFrameLoop);
         }
      };

      // Start capturing frames in a loop
      requestAnimationFrame(captureFrameLoop);
   };

   useEffect(() => {
      navigator.mediaDevices.enumerateDevices().then(handleDevices);
   }, [handleDevices]);


   useEffect(() => {
      navigator.mediaDevices.enumerateDevices().then(handleDevices);
   }, [handleDevices]);

   useEffect(() => {
      // Apply class changes immediately when selectedSource changes
      const listItems = document.querySelectorAll('.dropdown-item');
      listItems.forEach((item) => {
         const sourceId = item.dataset.sourceId;
         const isSelected = selectedDeviceId && selectedDeviceId === sourceId;
         const childElement = item.querySelector('.dd-span'); // Replace '.child-element' with the actual class or selector of your child element
         childElement.classList.toggle('bg-sblue-alt', isSelected);
         childElement.classList.toggle('text-sblue', isSelected);
         item.classList.toggle('selected', isSelected);
      });
   }, [selectedDeviceId, isOpen]);

   return (
      <>
         <div className="w-full h-64 rounded-xl overflow-hidden my-5 relative">
            <Webcam audio={false} videoConstraints={{ deviceId: selectedDeviceId }} className="w-full h-full object-cover" />

            <div className="absolute inset-0 flex justify-center items-center">
               <div className='w-full h-full object-cover'>
                  <FaceFrame />
               </div>
               {/* <div className="w-full h-full relative">

                  <div className="absolute inset-0 bg-blue-200 opacity-50"></div>
                  <div className="absolute inset-1/4 bg-transparent border-2 border-red-500 rounded-full"></div>
               </div> */}
            </div>
         </div>
         <button onClick={startCapture}>Capture Frame</button>

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
                           onClick={handleDeviceChange}
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
      </>
   );
};

export default CameraSourceDropdownSetup;
