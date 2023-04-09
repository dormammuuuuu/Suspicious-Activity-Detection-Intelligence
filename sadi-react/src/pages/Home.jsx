import React from 'react'
import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

import { Sidebar } from '../components'
import { SadiMain } from '../pages'

const Home = () => {
   const navigate = useNavigate();
   useEffect(() => {
      const token = Cookies.get('token');

      if (!token) {
         navigate('/login');
      }
   })

   return (
      <>
         {/* <Sidebar />
         <div className="ml-64">
            
         </div> */}

         <div class="p-5 grid grid-cols-6 grid-rows-8 gap-5 h-screen">
            <div class="row-start-1 row-end-9 col-start-1 col-end-2 flex justify-center items-center">
               <Sidebar />
            </div>
            <div class="bg-green-300 grid-row-1 grid-row-5 col-start-2 col-end-7 flex justify-center items-center"></div>
            <div class="bg-blue-300 row-start-2 row-end-9 col-start-2 col-end-7">
               <Routes>
                  <Route path="/*" element={<SadiMain />} />
               </Routes>
            </div>
         </div>

      </>

   )
}

export default Home