import React from 'react'
import { Route, Routes } from 'react-router-dom';
import { UserList, Help, AccountSettings, VideoPlayback } from '../components'

const SadiMain = () => {


   return (
      <div className="h-full p-11">
         <Routes>
            {/* <Route path='/' element={<Dashboard />} /> */}
            <Route path='/' element={<VideoPlayback />} />
            <Route path='/user' element={<UserList />} />
            <Route path='/help' element={<Help />} />
            <Route path='/account-settings' element={<AccountSettings />} />
         </Routes>
      </div>
   )
}

export default SadiMain