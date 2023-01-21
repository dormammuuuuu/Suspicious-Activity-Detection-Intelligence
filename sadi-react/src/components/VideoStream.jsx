import React from "react";
import { useLocation } from "react-router-dom";

const VideoStream = () => {
  let location = useLocation();

  return (
    <div>
      {/* <img key={location.pathname} src="http://localhost:5000/api/video_feed" alt="Video"/> */}
    </div>
  );
}

export default VideoStream;