import React from 'react'
import { Link, Route, Routes } from 'react-router-dom';
import { Dashboard, Documentation, UserList, Help } from '../components'



const SadiMain = () => {
   return (
      <div className="h-full">
         <Routes>
            <Route path='/' element={<Dashboard />} />
            <Route path='/UserList' element={<UserList />} />
            <Route path='/Documentation' element={<Documentation />} />
            <Route path='/Help' element={<Help />} />
            {/* <Route path='/search' element={<Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />} /> */}
         </Routes>
      </div>

   )
}

export default SadiMain