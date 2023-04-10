import React from 'react'
import { Route, Routes } from 'react-router-dom';
import { Dashboard, UserList, Help, Yolov5, VideoStream, AccountSettings } from '../components'

const SadiMain = () => {


   return (
      <div className="h-full">
         <Routes>
            <Route path='/' element={<Dashboard />} />
            <Route path='/user' element={<UserList />} />
            <Route path='/help' element={<Help />} />
            <Route path='/video-stream' element={<Yolov5 />} />
            <Route path='/account-settings' element={<AccountSettings />} />
         </Routes>
      </div>
   )
}

export default SadiMain