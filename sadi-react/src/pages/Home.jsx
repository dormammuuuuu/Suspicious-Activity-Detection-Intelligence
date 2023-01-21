import React from 'react'
import { Route, Routes } from 'react-router-dom';

import { Sidebar } from '../components'
import SadiMain from './SadiMain'

const Home = () => {
   return (
      <>
         <Sidebar />
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