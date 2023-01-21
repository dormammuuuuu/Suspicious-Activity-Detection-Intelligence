import React from 'react'
import { Route, Routes } from 'react-router-dom';
import { Dashboard, Documentation, UserList, Help, Test, VideoStream } from '../components'



const SadiMain = () => {
   return (
      <div className="h-full">
         <Routes>
            <Route path='/' element={<Dashboard />} />
            <Route path='/user' element={<UserList />} />
            <Route path='/documentation' element={<Documentation />} />
            <Route path='/help' element={<Help />} />
            <Route path='/test' element={<Test />} />
            <Route path='/video-stream' element={<VideoStream />} />
         </Routes>
      </div>

   )
}

export default SadiMain