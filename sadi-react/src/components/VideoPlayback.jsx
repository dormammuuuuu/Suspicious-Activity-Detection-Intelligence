import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const VideoPlayback = () => {
    let location = useLocation();

    const [src, setSrc] = useState(`http://localhost:5000/api/yolov5`);

    useEffect(() => {
        setSrc(`http://localhost:5000/api/yolov5`);
    }, [location.pathname]);


    return (
        <div className="">
            <div className="space-y-2">
                <p className="text-lg font-bold">CCTV Livestream</p>
            </div>
            <img className="mx-auto" key={location.pathname} src={src} alt="Video" />
        </div>
    );
}

export default VideoPlayback;