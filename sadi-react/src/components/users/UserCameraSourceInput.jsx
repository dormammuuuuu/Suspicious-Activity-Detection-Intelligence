import React, { useState, useEffect, useRef } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios'

import { FaceFrame, DeviceDropdown, Button } from '../';


const UserCameraSourceInput = ({ handleSourceDone }) => {
   const webcamRef = useRef(null);
   const [isStreaming, setIsStreaming] = useState(true);
   const [isOpen, setIsOpen] = useState(false);
   const [selectedDeviceId, setSelectedDeviceId] = useState('');
   const [devices, setDevices] = useState([]);
   const [deviceKey, setDeviceKey] = useState(0);

   const handleNext = () => {
      handleSourceDone(deviceKey)
      console.log('deviceKey:', deviceKey);

      setIsStreaming(false);
      console.log('isStreaming: false');
   }

   const handleDevices = React.useCallback(async (mediaDevices) => {
      const videoDevices = mediaDevices.filter(({ kind }) => kind === 'videoinput');
      setDevices(videoDevices);
      setSelectedDeviceId(videoDevices[0]?.deviceId || '');

      // Get the frame size for each video device
      const promises = videoDevices.map((device) => {
         return new Promise((resolve, reject) => {
            const video = document.createElement('video');
            navigator.mediaDevices.getUserMedia({ video: { deviceId: device.deviceId } })
               .then((stream) => {
                  video.srcObject = stream;
                  video.onloadedmetadata = () => {
                     const frameSize = {
                        deviceId: device.deviceId,
                        width: video.videoWidth,
                        height: video.videoHeight
                     };
                     resolve(frameSize);
                     video.srcObject = null; // Stop video playback
                  };
               })
               .catch((error) => {
                  console.log(`Error accessing video stream for device ID ${device.deviceId}:`, error);
                  reject(error);
               });
         });
      });

      try {
         const frameSizes = await Promise.all(promises);
         console.log('Frame Sizes:', frameSizes);
      } catch (error) {
         console.log('Error retrieving frame sizes:', error);
      }
   }, []);



   const handleDeviceChange = (event, key) => {

      const deviceId = event.target.closest('li').dataset.sourceId;
      console.log('Selected device', deviceId)
      setSelectedDeviceId(deviceId);
      setIsOpen(!isOpen);
      setDeviceKey(key);
   };



   useEffect(() => {
      navigator.mediaDevices.enumerateDevices().then(handleDevices);
   }, [handleDevices]);

   // Style the selected source
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
         <div className="w-[440px] h-64 flex rounded-xl overflow-hidden my-5 relative">
            {
               isStreaming &&
               <Webcam
                  audio={false}
                  videoConstraints={isStreaming && { deviceId: selectedDeviceId }}
                  className="w-full  h-full object-cover"
               />

            }

            <div className="absolute inset-0 flex justify-center items-center">
               <div className='w-full h-full object-cover'>
                  <FaceFrame />
               </div>
            </div>
         </div>
         {/* <button onClick={sendVideoSource}>Capture Frame</button> */}
         <div className='w-[440px]'>
            <DeviceDropdown
               devices={devices}
               selectedDeviceId={selectedDeviceId}
               handleDeviceChange={handleDeviceChange}
               handleClick={() => setIsOpen((prevState) => !prevState)}
               isOpen={isOpen}
            />
         </div>
         <Button className="w-[440px] mt-3 bg-sblue hover:bg-blue-700 text-white font-normal" label="Choose video source" onClick={handleNext} />


      </>
   );
};

export default UserCameraSourceInput;


