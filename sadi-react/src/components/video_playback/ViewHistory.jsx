import React, { useEffect, useState } from 'react'
import { FaFolder } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { VideoPlaybackLayout } from '..'
import axios from 'axios';



const ViewHistory = () => {
   const navigate = useNavigate();
   const [folders, setFolders] = useState([]); // [

   useEffect(() => {
      // Add the code to fetch the list of folders from the API
      // and store it in the folders state
      axios.get('http://localhost:5000/api/view-history/folders')
         .then(response => {
            setFolders(response.data);
         })
   }, []);

   function FolderList() {
      return (
         <ul className="my-10">
            {folders.map((folder) => {
               const slug = folder.time.replace(/-/g, '');
               return (
                  <li key={folder.id}>
                     {/* Render the folder item with navigation */}
                     <button
                        className="flex items-center gap-3 w-full rounded-lg text-xl hover:bg-sblue-alt hover:text-sblue py-4 px-4 my-2"
                        onClick={() => navigate(`/view-history/${slug}`)}
                     >
                        <FaFolder className="text-2xl mb-1 pb-1" />
                        <h1>{folder.time}</h1>
                     </button>
                  </li>
               );
            })}
         </ul>
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
