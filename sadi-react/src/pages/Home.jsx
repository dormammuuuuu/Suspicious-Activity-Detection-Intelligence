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
    '/': 'Dashboard',
    '/user': 'Users',
    '/video-stream': 'Video Playback',
    '/account-settings': 'Account Settings',
    '/help': 'Help',
  };

  const title = textMap[path];

   useEffect(() => {
      const token = Cookies.get('token');

      if (!token) {
         navigate('/login');
      }
   })

   return (
      <>
         <div class=" p-5 grid grid-cols-6 grid-rows-9 gap-5 h-screen">
            <div class="bg-white rounded-xl row-start-1 row-end-10 col-start-1 col-end-2 flex justify-center items-center">
               <Sidebar />
            </div>
            <div class="bg-white grid-row-1 grid-row-5 col-start-2 col-end-7 rounded-xl px-6 flex items-center">
               <h1 class=" text-2xl text-neutral-600">{ title }</h1>
            </div>
            <div class="bg-white row-start-2 row-end-10 col-start-2 col-end-7 rounded-xl">
               <Routes>
                  <Route path="/*" element={<SadiMain />} />
               </Routes>
            </div>
         </div>
      </>

   )
}

export default Home