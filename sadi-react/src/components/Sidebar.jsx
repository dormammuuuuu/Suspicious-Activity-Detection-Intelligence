import React from 'react'
import { NavLink } from 'react-router-dom'
import Cookies from 'js-cookie'
import { IoVideocam, IoHelpCircle, IoLogOut } from 'react-icons/io5'
import { MdSpaceDashboard } from 'react-icons/md'
import { FaUser } from 'react-icons/fa'
import Logo from '../components/Logo'
import SidebarLink from './SidebarLink'

const sidebar = () => {
   const handleLogout = () => {
      Cookies.remove('token');
      window.location.href = '/login';
   }

   return (
      <aside className="w-full bg-gray-50 rounded-xl h-full" aria-label="Sidebar">
         <div className="p-4 overflow-y-auto h-full flex flex-col justify-between">
            <div>
               <ul className="space-y-2">
                  <li className='p-7'>
                     <Logo />
                  </li>
                  <li>
                     <SidebarLink link="/" label="Dashboard">
                        <MdSpaceDashboard className="flex-shrink-0 w-6 h-6 transition duration-75 group-hover:text-gray-900" />
                     </SidebarLink>
                  </li>
                  <li>
                     <SidebarLink link="/user" label="Users">
                        <FaUser className="flex-shrink-0 w-6 h-6 transition duration-75 group-hover:text-gray-900" />
                     </SidebarLink>
                  </li>
                  <li>
                     <SidebarLink link="/video-stream" label="Video Playback">
                        <IoVideocam className="flex-shrink-0 w-6 h-6 transition duration-75 group-hover:text-gray-900" />
                     </SidebarLink>
                  </li>
                  <li>
                     <SidebarLink link="/help" label="Help">
                        <IoHelpCircle className="flex-shrink-0 w-6 h-6 transition duration-75 group-hover:text-gray-900" />
                     </SidebarLink>
                  </li>
               </ul>
            </div>
            <div>
               <button onClick={handleLogout}
                  className="w-full flex items-center p-2 text-base font-normal transition duration-75 rounded-lg hover:bg-gray-100">
                  <IoLogOut className="flex-shrink-0 w-6 h-6 text-neutral-400 transition duration-75 group-hover:text-gray-900" />
                  <span className="ml-3">Log out</span>
               </button>
            </div>
         </div>
      </aside>
   )
}

export default sidebar