import React, { useEffect, useRef, useState } from 'react';
import { FiMaximize, FiMinimize, FiVolume2, FiVolumeX, FiSettings, FiEye } from 'react-icons/fi';
import { MdLiveTv } from 'react-icons/md';

interface StreamPlayerProps {
  streamId: string;
  lang: 'ar' | 'en';
}

const StreamPlayer: React.FC<StreamPlayerProps> = ({ streamId, lang }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [viewerCount, setViewerCount] = useState(45234);
  const [quality, setQuality] = useState('1080p');

  const translations = {
    ar: {
      live: 'مباشر',
      viewers: 'مشاهد',
      quality: 'الجودة',
      fullscreen: 'ملء الشاشة',
    },
    en: {
      live: 'LIVE',
      viewers: 'viewers',
      quality: 'Quality',
      fullscreen: 'Fullscreen',
    }
  };

  const t = translations[lang];

  useEffect(() => {
    // Simulate viewer count updates
    const interval = setInterval(() => {
      setViewerCount(prev => prev + Math.floor(Math.random() * 100) - 50);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const toggleFullscreen = () => {
    const container = document.getElementById('player-container');
    if (!document.fullscreenElement && container) {
      container.requestFullscreen();
      setIsFullscreen(true);
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Auto-hide controls
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (showControls) {
      timeout = setTimeout(() => setShowControls(false), 3000);
    }
    return () => clearTimeout(timeout);
  }, [showControls]);

  return (
    <div 
      id="player-container"
      className="relative aspect-video bg-midnight-black rounded-xl overflow-hidden group"
      onMouseMove={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Video Player */}
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        poster="https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1920&q=80"
        autoPlay
        playsInline
      >
        <source src="http://localhost:8080/hls/stream.m3u8" type="application/x-mpegURL" />
      </video>

      {/* Top Overlay - Always Visible */}
      <div className="absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-midnight-black/80 to-transparent z-20">
        <div className="flex items-center justify-between">
          
          {/* Live Indicator */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 bg-emerald-energy rounded-lg glow-emerald">
              <MdLiveTv className="text-midnight-black text-xl animate-pulse-live" />
              <span className="text-sm font-bold text-midnight-black uppercase">{t.live}</span>
            </div>
            
            {/* Viewer Count */}
            <div className="flex items-center gap-2 glass-panel px-4 py-2 rounded-lg">
              <FiEye className="text-emerald-energy" />
              <span className="text-white font-semibold">{viewerCount.toLocaleString()}</span>
              <span className="text-white/60 text-sm">{t.viewers}</span>
            </div>
          </div>

          {/* Quality Selector */}
          <div className="glass-panel px-4 py-2 rounded-lg">
            <select 
              value={quality}
              onChange={(e) => setQuality(e.target.value)}
              className="bg-transparent text-white font-semibold outline-none cursor-pointer"
            >
              <option value="1080p" className="bg-cosmic-navy">1080p</option>
              <option value="720p" className="bg-cosmic-navy">720p</option>
              <option value="480p" className="bg-cosmic-navy">480p</option>
              <option value="auto" className="bg-cosmic-navy">Auto</option>
            </select>
          </div>

        </div>
      </div>

      {/* Bottom Controls - Auto Hide */}
      <div className={`absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-midnight-black/90 to-transparent 
                      transition-opacity duration-300 z-20 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        
        <div className="flex items-center justify-between">
          
          {/* Left Controls */}
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleMute}
              className="w-12 h-12 rounded-lg glass-panel-subtle hover:glass-panel flex items-center justify-center 
                       transition-all hover:scale-110"
            >
              {isMuted ? <FiVolumeX className="text-xl text-white" /> : <FiVolume2 className="text-xl text-emerald-energy" />}
            </button>
          </div>

          {/* Center - Stream Progress (for VOD) */}
          <div className="flex-1 mx-8">
            {/* Empty for live streams, would show progress bar for VOD */}
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-4">
            <button 
              className="w-12 h-12 rounded-lg glass-panel-subtle hover:glass-panel flex items-center justify-center 
                       transition-all hover:scale-110"
            >
              <FiSettings className="text-xl text-white hover:text-emerald-energy hover:rotate-90 transition-all duration-300" />
            </button>

            <button 
              onClick={toggleFullscreen}
              className="w-12 h-12 rounded-lg glass-panel-subtle hover:glass-panel flex items-center justify-center 
                       transition-all hover:scale-110"
            >
              {isFullscreen ? 
                <FiMinimize className="text-xl text-white hover:text-emerald-energy transition-colors" /> :
                <FiMaximize className="text-xl text-white hover:text-emerald-energy transition-colors" />
              }
            </button>
          </div>

        </div>
      </div>

      {/* Loading Overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-midnight-black/50 backdrop-blur-sm opacity-0 
                    group-hover:opacity-0 pointer-events-none">
        <div className="loader" />
      </div>

    </div>
  );
};

export default StreamPlayer;

