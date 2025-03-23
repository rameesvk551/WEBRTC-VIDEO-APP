import React, { useEffect, useRef } from "react";

const UserFeedLayer: React.FC<{ stream?: MediaStream }> = ({ stream }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream || null;
    }
  }, [stream]);

  return (
    <div>
      <video
        ref={videoRef}
        style={{ width: "300px", height: "200px" }}
        muted
        autoPlay
      />
    </div>
  );
};

export default UserFeedLayer;
