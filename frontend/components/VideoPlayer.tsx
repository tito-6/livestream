import React, { useEffect, useRef } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

// Type definition for video.js player options
interface VideoPlayerProps {
  streamUrl: string;
  poster?: string;
}

/**
 * Reusable component to render the video.js player for HLS streaming.
 * It manages the lifecycle of the player instance.
 */
const VideoPlayer: React.FC<VideoPlayerProps> = ({ streamUrl, poster }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<videojs.Player | null>(null);

  useEffect(() => {
    // Ensure the video element is available and the player hasn't been initialized yet
    if (videoRef.current && !playerRef.current) {
      const playerOptions = {
        autoplay: true,
        controls: true,
        responsive: true,
        fluid: true,
        poster: poster,
        sources: [{
          src: streamUrl,
          type: 'application/x-mpegURL', // HLS stream type
        }],
      };

      // Initialize the video.js player
      const player = videojs(videoRef.current, playerOptions, () => {
        videojs.log('Player is ready!');
      });

      playerRef.current = player;
    }

    // Cleanup function to dispose the player instance on component unmount
    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
        videojs.log('Player disposed.');
      }
    };
  }, [streamUrl, poster]); // Re-run effect if streamUrl or poster changes

  return (
    <div data-vjs-player>
      <video ref={videoRef} className="video-js vjs-default-skin" />
    </div>
  );
};

export default VideoPlayer;
