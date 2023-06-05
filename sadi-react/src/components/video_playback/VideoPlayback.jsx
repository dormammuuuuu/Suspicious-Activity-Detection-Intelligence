import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { VideoPlaybackLayout } from "../";

const VideoPlayback = () => {
    let location = useLocation();
    const [src, setSrc] = useState(`http://localhost:5000/api/yolov5`);


    useEffect(() => {
        setSrc(`http://localhost:5000/api/yolov5`);
    }, [location.pathname]);

    return (
        <VideoPlaybackLayout>
            <div className='m-5 h-full w-full flex flex-col items-center'>
                <div className=' w-full mx-auto flex justify-center h-modal'>
                    <img className=" h-full object-contain  overflow-hidden rounded-xl" key={location.pathname} src={src} alt="Video" />
                </div>
            </div>
        </VideoPlaybackLayout>
    );
}

export default VideoPlayback;