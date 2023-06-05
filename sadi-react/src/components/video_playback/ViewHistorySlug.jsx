import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { FaArrowLeft } from 'react-icons/fa'
import { useParams } from 'react-router-dom'
import { VideoPlaybackLayout } from '..'

const SADI_API_ENDPOINT = 'http://localhost:5000/api/view-history/get-folders/'

const ViewHistorySlug = () => {
   const [images, setImages] = useState([]);
   const [activeFullImage, setActiveFullImage] = useState(false);
   const [imagePreview, setImagePreview] = useState(null);
   const { slug } = useParams();

   const handleImageClick = (image) => {
      setImagePreview(image);
      setActiveFullImage(true);
   }
   const handleBackClick = () => {
      setActiveFullImage(false);
   }

   useEffect(() => {
      const fetchImages = async () => {
         try {
            // Make a GET request to the Flask API endpoint to retrieve the images
            const response = await axios.get(`${SADI_API_ENDPOINT}${slug}`);
            const data = response.data;
            // Extract the list of images from the response data
            const imageList = data.images || [];
            setImages(imageList);
         } catch (error) {
            console.error('Error fetching images:', error);
         }
      };
      fetchImages();
   }, []);

   return (
      <VideoPlaybackLayout handleBackClick={handleBackClick}>
         {activeFullImage ? (
            <div className='m-5 h-full w-full flex flex-col'>
               <button
                  className='flex justify-center items-center text-lg font-medium text-sgray-400 hover:bg-sblue-alt  rounded-full py-1 px-2 w-24 mb-4'
                  onClick={handleBackClick}><FaArrowLeft className='text-xl  pb-1 pr-2' /> Back
               </button>
               <div className='h-5/6  w-4/5 mx-auto '>
                  <img
                     className='w-full h-full object-cover  overflow-hidden rounded-xl'
                     src={`${SADI_API_ENDPOINT}${slug}/${imagePreview}`}
                     alt={imagePreview}
                  />
               </div>
            </div>
         ) : (
            <>
               {
                  images.length > 0 ? (
                     <ul className='w-full overflow-hidden flex flex-wrap gap-2 p-4'>
                        {images.map((image, index) => (
                           <li
                              key={index}
                              className='flex flex-col text-base select-none px-4 pt-4 pb-2 rounded-xl cursor-pointer items-start hover:bg-sblue-alt'
                              onClick={() => handleImageClick(image)}
                           >
                              <div className='w-56 h-56 overflow-hidden rounded-xl'>
                                 <img
                                    className="w-full h-full object-cover scale-105 overflow-hidden"
                                    src={`${SADI_API_ENDPOINT}${slug}/${image}`}
                                    alt={`${index}`}
                                 />
                              </div>
                              <p className="font-medium text-sgray-400 capitalize whitespace-nowrap pl-2 pt-2">
                                 {image}
                              </p>
                           </li>
                        ))}
                     </ul>
                  ) : (
                     <div className="flex flex-col items-center justify-center h-full">
                        <h1 className="text-2xl font-bold text-sgray-400">No Images Found</h1>
                     </div>
                  )
               }
            </>
         )}
      </VideoPlaybackLayout >
   );
}

export default ViewHistorySlug