import React from 'react'
import { FaChevronRight, FaFolder, FaHistory } from 'react-icons/fa'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import { Layout } from '..';

const VideoPlaybackLayout = (props) => {
   const { children } = props;
   const navigate = useNavigate();
   const location = useLocation();
   const currentPath = location.pathname;
   const { slug } = useParams();
   const gotoLiveVideo = () => navigate('/');
   const gotoViewHistory = () => navigate('/view-history');
   const gotoViewHistoryDetails = () => {
      navigate(`/view-history/${slug}`)
      props.handleBackClick();
   }


   const formatLabel = (label) => {
      const formattedLabel = label.replace('-', ' ').toLowerCase();
      return formattedLabel.charAt(0).toUpperCase() + formattedLabel.slice(1);
   };


   return (
      <Layout>
         <div className='flex justify-between text-sgray-400'>
            <div className="flex justify-between items-center text-sgray-40 text-lg font-bold text-sgray-4000">
               {/* list of button navigation */}
               <div className="flex items-center gap-2 ">
                  <button
                     className="flex items-center justify-center  rounded-lg hover:bg-sblue-alt hover:text-sblue py-1 px-2"
                     onClick={gotoLiveVideo}
                  >
                     <h1 className="">Live Video</h1>
                  </button>
                  {(currentPath === '/view-history' || currentPath === `/view-history/${slug}`) && (<>
                     <FaChevronRight className="pb-1" />
                     <button
                        className="flex items-center justify-center  rounded-lg hover:bg-sblue-alt hover:text-sblue py-1 px-2"
                        onClick={gotoViewHistory}
                     >
                        <h1 className="">View History</h1>
                     </button>
                  </>
                  )}
                  {currentPath === `/view-history/${slug}` && (<>
                     <FaChevronRight className="pb-1" />
                     <button
                        className="flex items-center justify-center  rounded-lg hover:bg-sblue-alt hover:text-sblue py-1 px-2"
                        onClick={gotoViewHistoryDetails}
                     >
                        <h1 className="">{slug}</h1>
                     </button>
                  </>)}
               </div>
            </div>

            {
               currentPath === '/' &&
               <div className='flex gap-x-3'>
                  <button type="button" id="add-user"
                     className="flex gap-2 items-center text-sblue border border-sblue focus:ring-2 font-semibold rounded-lg text-base px-3 py-1.5 transition duration-300  ease-in-out  hover:scale-105 hover:bg-blue-50"
                     onClick={gotoViewHistory}>
                     <FaHistory className='text-sm flex items-center justify-center' />
                     <span>View history</span>
                  </button>
               </div>
            }

         </div>
         {children}
      </Layout>
   )
}

export default VideoPlaybackLayout