import React from 'react'
import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useNavigate, useLocation } from 'react-router-dom';

import { Sidebar } from '../components'
import { SadiMain } from '../pages'

const Home = () => {
   const navigate = useNavigate();
   const location = useLocation();
   const path = location.pathname;

   const textMap = {
      // '/': 'Dashboard',
      '/': 'Video Playback',
      'video-playback': 'Video Playback',
      '/user': 'Users',
      '/account-settings': 'Account Settings',
      '/help': 'Help',
   };

   const title = textMap[path] || "Video Playback";

   useEffect(() => {
      const token = Cookies.get('token');

      if (!token) {
         navigate('/login');
      }
   })

   return (
      <>
         <div className="bg-sblue-alt p-5 grid grid-cols-5 grid-rows-9 gap-5  gap-x-5 w-screen h-screen">
            <div className="bg-white rounded-xl row-start-1 row-end-10 col-start-1 col-end-2 flex justify-center items-center">
               <Sidebar />
            </div>
            <div className="bg-white grid-row-1 grid-row-5 col-start-2 col-end-7 rounded-xl px-7  flex items-center ">
               <h1 className="text-xl text-sgray-400">{title}</h1>
            </div>
            <div className="bg-white row-start-2 row-end-10 col-start-2 col-end-7 rounded-xl">
               <Routes>
                  <Route path="/*" element={<SadiMain />} />
               </Routes>
            </div>
         </div>
      </>

   )
}

export default Home