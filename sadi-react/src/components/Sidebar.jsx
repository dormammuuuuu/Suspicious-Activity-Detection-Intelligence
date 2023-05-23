import React from 'react'
import { NavLink } from 'react-router-dom'
import Cookies from 'js-cookie'
import { IoVideocam, IoHelpCircle, IoLogOut } from 'react-icons/io5'
import { MdSpaceDashboard } from 'react-icons/md'
import { FaUser } from 'react-icons/fa'
import { IoMdSettings } from 'react-icons/io'
import { Logov3 } from '../components'
import SidebarLink from './SidebarLink'

const sidebar = () => {
   const handleLogout = () => {
      Cookies.remove('token');
      window.location.href = '/login';
   }

   return (
      <aside className="w-full h-full" aria-label="Sidebar">
         <div className="p-4 overflow-y-auto h-full flex flex-col justify-between">
            <div>
               <div className="py-7 flex justify-center">
                  <div className='w-32 h-14'>
                     <Logov3 />
                  </div>
               </div>
               <div className="flex flex-col gap-y-2">
                  <div className="pl-3 my-4 text-sgray-300">
                     <p>MENU</p>
                  </div>
                  {/* <SidebarLink link="/" label="Dashboard">
                     <MdSpaceDashboard className="flex-shrink-0 w-6 h-6 transition duration-75 group-hover:text-gray-900" />
                  </SidebarLink> */}
                  <SidebarLink link="/" label="Video Playback">
                     <IoVideocam className="flex-shrink-0 w-6 h-6 transition duration-75" />
                  </SidebarLink>
                  <SidebarLink link="/user" label="Users">
                     <FaUser className="flex-shrink-0 w-6 h-6 transition duration-75 " />
                  </SidebarLink>
                  <SidebarLink link="/account-settings" label="Account Settings">
                     <IoMdSettings className="flex-shrink-0 w-6 h-6 transition duration-75" />
                  </SidebarLink>
                  <SidebarLink link="/help" label="Help">
                     <IoHelpCircle className="flex-shrink-0 w-6 h-6 transition duration-75" />
                  </SidebarLink>
               </div>

            </div>
            <div>
               <button onClick={handleLogout}
                  className="w-full flex items-center p-2 text-base font-normal transition duration-75 rounded-lg hover:bg-sblue-alt ">
                  <IoLogOut className="flex-shrink-0 w-6 h-6 text-sgray-300 transition duration-75" />
                  <span className="ml-3 text-sgray-300">Log Out</span>
               </button>
            </div>
         </div>
      </aside>
   )
}

export default sidebar