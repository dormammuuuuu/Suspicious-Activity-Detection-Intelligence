import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const VideoStream = () => {
  let location = useLocation();
  const [src, setSrc] = useState(`http://localhost:5000/api/video_feed?ts=${Date.now()}`);
  const [isVideoRunning, setIsVideoRunning] = useState(true);

  useEffect(() => {
    if (isVideoRunning) {
      setSrc(`http://localhost:5000/api/video_feed?ts=${Date.now()}`);
    }
  }, [location.pathname, isVideoRunning]);

  useEffect(() => {
    return () => {
      if (isVideoRunning) {
        // stop video feed when the component unmounts only if isVideoRunning is true
        fetch("http://localhost:5000/api/stop_video_feed")
          .then((response) => response.text())
          .then((data) => console.log(data));
      }

    };
  }, [isVideoRunning]);

  return (
    <div>
      video Stream
      <img key={location.pathname} src={src} alt="Video" />
    </div>
  );
}

export default VideoStream;