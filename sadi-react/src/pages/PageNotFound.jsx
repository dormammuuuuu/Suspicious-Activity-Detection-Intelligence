import React from 'react'
import { useNavigate } from 'react-router-dom';
import { HiOutlineArrowNarrowLeft } from 'react-icons/hi'


import { Button } from '../components';
import img from '../assets/img/image-404.png'


const PageNotFound = () => {
   const navigate = useNavigate();


   return (
      <div className='bg-sblue-alt flex  flex-col items-center justify-center min-h-screen w-screen  '>
         <div className='flex  items-center gap-3 text-404xl text-sblue font-extrabold h-48'>
            <span className='mt-11'>4</span>
            <span className='w-44 h-44 '>
               <img className='w-full h-full object-cover' src={img} alt="0" />
            </span>
            <span className='mt-11'>4</span>
         </div>
         <h1 className='text-2xl text-sblue font-semibold mt-4'>Oops, page not found</h1>
         <Button className="w-44  mt-10 bg-blue-100 hover:bg-blue-200 text-sblue capitalize  text-semibold text-sm "
            label={<span className="flex items-center justify-center">
               <HiOutlineArrowNarrowLeft className="mr-2 text-lg" /> <p className=''>Back to Home </p>
            </span>
            }
            onClick={() => navigate('/login')} />
      </div>
   )
}

export default PageNotFound