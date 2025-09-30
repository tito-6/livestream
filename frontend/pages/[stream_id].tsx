import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import VideoPlayer from '../components/VideoPlayer';
import RealtimeChat from '../components/RealtimeChat';

/**
 * Main dynamic page for viewing a specific live stream.
 * URL structure: /stream/esports-grand-final
 */
const StreamPage: React.FC = () => {
    const router = useRouter();
    // Use the dynamic parameter from the URL
    const { stream_id } = router.query;
    
    // --- MOCK DATA ---
    // In a real application, this URL would be fetched from the API Gateway/Database
    const MOCK_HLS_URL = 'http://cdn.mock/hls/test-stream/master.m3u8'; 
    const STREAM_TITLE = stream_id ? stream_id.toString().replace(/-/g, ' ').toUpperCase() : 'Loading Stream';
    // -----------------

    if (!stream_id) {
        return <div>Loading stream details...</div>;
    }

    return (
        <>
            <Head>
                <title>{STREAM_TITLE} | eSports Platform</title>
                <meta name="description" content={`Watch the live stream of ${STREAM_TITLE}`} />
            </Head>

            <div style={{ padding: '20px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
                <h1 style={{ marginBottom: '20px', color: '#333' }}>📺 {STREAM_TITLE}</h1>

                <div style={{ display: 'flex', gap: '20px', maxWidth: '1400px', margin: '0 auto' }}>
                    
                    {/* Main Video Area (70% width) */}
                    <div style={{ flex: '7', backgroundColor: '#fff', padding: '10px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                        <VideoPlayer 
                            streamUrl={MOCK_HLS_URL}
                            poster="/placeholder-poster.jpg" // Placeholder for a real poster image
                        />
                        <div style={{ padding: '10px 0' }}>
                            <h2>Live Match: Team Liquid vs Evil Geniuses</h2>
                            <p style={{ color: '#555' }}>Casting by: John "Caster" Doe</p>
                        </div>
                    </div>

                    {/* Sidebar/Chat Area (30% width) */}
                    <div style={{ flex: '3', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                        <RealtimeChat />
                    </div>

                </div>
            </div>
        </>
    );
};

export default StreamPage;
