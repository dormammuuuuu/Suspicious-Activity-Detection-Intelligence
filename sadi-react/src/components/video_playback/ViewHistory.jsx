import React, { useEffect, useState } from 'react'
import { FaFolder } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { VideoPlaybackLayout } from '..'
import axios from 'axios';

const ViewHistory = () => {
   const navigate = useNavigate();
   const [folders, setFolders] = useState([]); // [

   useEffect(() => {

      axios.get('http://localhost:5000/api/view-history/get-folders')
         .then(response => {
            setFolders(response.data.folders);
         })
   }, []);
   function FolderList() {
      return (
         <>
            {
               folders.length > 0 ? (
                  <ul className="my-10">
                     {folders.map((folder) => {

                        return (
                           <li key={folder.id}>
                              {/* Render the folder item with navigation */}
                              <button
                                 className="flex items-center gap-3 w-full rounded-lg text-xl hover:bg-sblue-alt hover:text-sblue py-4 px-4 my-2"
                                 onClick={() => navigate(`/view-history/${folder.name}`)}
                              >
                                 <FaFolder className="text-2xl mb-1 pb-1" />
                                 <h1>{folder.name}</h1>
                              </button>
                           </li>
                        );
                     })}
                  </ul>
               ) : (
                  <div className="flex flex-col items-center justify-center h-full">
                     <h1 className="text-2xl font-bold text-sgray-400">No History Found</h1>
                  </div>
               )
            }

         </>
      );
   }

   return (
      <VideoPlaybackLayout>
         {/* Render the FolderList component */}
         <FolderList />
      </VideoPlaybackLayout>
   );
};

export default ViewHistory;
