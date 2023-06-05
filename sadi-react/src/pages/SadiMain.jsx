import React from 'react'
import { Route, Routes } from 'react-router-dom';
import { UserList, Help, AccountSettings, VideoPlayback, ViewHistory, ViewHistorySlug } from '../components'

const SadiMain = () => {


   return (
      <div className="h-full p-11">
         <Routes>
            {/* <Route path='/' element={<Dashboard />} /> */}
            <Route path='/' element={<VideoPlayback />} />
            <Route path="/view-history" element={<ViewHistory />} />
            <Route path="/view-history/:slug" element={<ViewHistorySlug />} />
            <Route path='/user' element={<UserList />} />
            <Route path='/help' element={<Help />} />
            <Route path='/account-settings' element={<AccountSettings />} />
         </Routes>
      </div>
   )
}

export default SadiMain