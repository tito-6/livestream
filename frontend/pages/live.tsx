import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Layout from '../components/Layout';
import { MdLiveTv, MdPeople, MdTimer, MdShare, MdOutlineSportsEsports } from 'react-icons/md';
import { BiJoystick } from 'react-icons/bi';
import { getStreamStatus } from '../lib/api';
// Dynamic import for flv.js moved to useEffect to avoid SSR issues

interface StreamDetails {
  title: string;
  description: string;
  is_live: boolean;
  viewer_count: number;
  banner_url?: string;
  thumbnail_url?: string;
  pre_match_details?: string;
  post_match_details?: string;
  stream_key?: string; // We might get this but we don't need it for playback usually, we use a fixed URL
}

const LivePage = () => {
  const [stream, setStream] = useState<StreamDetails>({
    title: "Live Championship 2024",
    description: "The biggest event of the year is live now! Watch the top teams compete for glory.",
    is_live: false,
    viewer_count: 0
  });
  const [loading, setLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const flvPlayerRef = useRef<any>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        // Get the first available stream or active one
        const res = await fetch('http://192.168.1.171:8080/api/streams');
        const data = await res.json();
        if (data.data && data.data.length > 0) {
          // Prefer a live one
          const liveStream = data.data.find((s: any) => s.is_live);
          if (liveStream) {
            setStream({
              title: liveStream.title,
              description: liveStream.description,
              is_live: liveStream.is_live,
              viewer_count: 1250, // Mock
              banner_url: liveStream.banner_url,
              thumbnail_url: liveStream.thumbnail_url,
              pre_match_details: liveStream.pre_match_details,
              post_match_details: liveStream.post_match_details
            });
          } else {
            // Default to first if none live
            const s = data.data[0];
            setStream({
              title: s.title,
              description: s.description,
              is_live: false,
              viewer_count: 0,
              banner_url: s.banner_url,
              thumbnail_url: s.thumbnail_url,
              pre_match_details: s.pre_match_details,
              post_match_details: s.post_match_details
            });
          }
        }
      } catch (err) {
        console.error("Failed to fetch stream details", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 15000);
    return () => clearInterval(interval);
  }, []);

  // FLV.js Setup
  useEffect(() => {
    let player: any = null;

    const initPlayer = async () => {
      try {
        const flvjs = (await import('flv.js')).default;

        if (flvjs.isSupported() && videoRef.current) {
          const videoElement = videoRef.current;
          player = flvjs.createPlayer({
            type: 'flv',
            url: 'http://192.168.1.171:8080/live.flv',
            isLive: true,
            cors: true,
            hasAudio: true,
            hasVideo: true,
          }, {
            enableStashBuffer: false,
            fixAudioTimestampGap: false,
            isLive: true,
            lazyLoad: false,
          });
          player.attachMediaElement(videoElement);
          player.load();
          player.play().catch((e: any) => console.log("Autoplay blocked", e));

          flvPlayerRef.current = player;
        }
      } catch (err) {
        console.error("Failed to load flv.js", err);
      }
    };

    if (typeof window !== 'undefined') {
      initPlayer();
    }

    return () => {
      if (player) {
        player.destroy();
      }
    };
  }, []);

  return (
    <Layout title={stream.title + " | Live"}>
      {/* ... keeping layout similar to before but with Video Logic */}
      <div className="relative pt-24 pb-12 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">

          {/* Video Player Section */}
          <div className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-gray-800 mb-8 group">
            {/* Actual Video Player */}
            <video
              ref={videoRef}
              className="w-full h-full object-contain"
              controls
              autoPlay
              muted // Muted needed for autoplay usually
            />

            {/* Offline Overlay if status is false but we might still try to play */}
            {!stream.is_live && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-20">
                <div className="text-center">
                  <MdLiveTv className="text-6xl text-gray-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-white mb-2">Stream is Offline</h2>
                  <p className="text-gray-400">Waiting for broadcast to start...</p>
                </div>
              </div>
            )}

            <div className="absolute top-4 left-4 z-20 flex gap-2">
              {stream.is_live ? (
                <span className="bg-red-600 text-white px-3 py-1 rounded text-sm font-bold animate-pulse flex items-center gap-1">
                  <span className="w-2 h-2 bg-white rounded-full"></span> LIVE
                </span>
              ) : (
                <span className="bg-gray-600 text-white px-3 py-1 rounded text-sm font-bold flex items-center gap-1">
                  OFFLINE
                </span>
              )}
              <span className="bg-black/50 backdrop-blur text-white px-3 py-1 rounded text-sm flex items-center gap-2">
                <MdPeople className="text-emerald-500" /> {stream.viewer_count.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Stream Info & Details (Similar to previous implementations) */}
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 space-y-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{stream.title}</h1>
                <p className="text-gray-400">{stream.description}</p>
              </div>

              {/* Tabs for Pre/Post Match */}
              <div className="bg-midnight-black p-6 rounded-2xl border border-gray-800">
                <h3 className="text-xl font-bold text-white mb-4 border-b border-gray-800 pb-2">Event Details</h3>
                <div className="space-y-4">
                  {stream.pre_match_details && (
                    <div>
                      <h4 className="text-emerald-energy font-bold text-sm uppercase mb-1">Pre-Match</h4>
                      <p className="text-gray-300 whitespace-pre-line">{stream.pre_match_details}</p>
                    </div>
                  )}
                  {stream.post_match_details && (
                    <div className="mt-4 pt-4 border-t border-gray-800">
                      <h4 className="text-blue-400 font-bold text-sm uppercase mb-1">Post-Match Analysis</h4>
                      <p className="text-gray-300 whitespace-pre-line">{stream.post_match_details}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="lg:w-80 space-y-4">
              <button className="w-full btn-primary py-3 flex items-center justify-center gap-2">
                <MdShare size={20} /> Share Stream
              </button>
              {/* Chat Placeholder */}
              <div className="h-[400px] bg-midnight-black rounded-2xl border border-gray-800 flex flex-col">
                <div className="p-4 border-b border-gray-800 font-bold text-white">Live Chat</div>
                <div className="flex-1 p-4 flex items-center justify-center text-gray-500 text-sm">
                  Chat is disabled for this event.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LivePage;

