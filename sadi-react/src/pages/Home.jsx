import React from 'react'
import { Route, Routes } from 'react-router-dom';

import { Dashboard, Sidebar } from '../components'
import SadiMain from './SadiMain'

const Home = () => {
   return (
      <>
         <div>Home</div>
         <Sidebar />
         <Dashboard />

         <div className="px-10 ml-64 mt-8">
            <Routes>
               {/* <Route path="/user-profile/:userId" element={<UserProfile />} /> */}
               <Route path="/*" element={<SadiMain />} />
            </Routes>
         </div>

      </>

   )
}

export default Home