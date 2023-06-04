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
            <img className="mx-auto" key={location.pathname} src={src} alt="Video" />
        </VideoPlaybackLayout>
    );
}

export default VideoPlayback;