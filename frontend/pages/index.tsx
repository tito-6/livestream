import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

const Welcome: React.FC = () => {
  return (
    <div style={{ 
      textAlign: 'center', 
      padding: '50px 20px',
      backgroundColor: '#f0f2f5',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <h1 style={{ color: '#333', marginBottom: '20px' }}>
        🎮 Welcome to eSports Streaming Platform
      </h1>
      <p style={{ color: '#666', fontSize: '18px', marginBottom: '40px' }}>
        Your gateway to live eSports events and tournaments
      </p>
      
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link href="/esports-grand-final">
          <button style={{
            padding: '15px 30px',
            backgroundColor: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: 'pointer',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            🏆 Watch Grand Final
          </button>
        </Link>
        
        <Link href="/team-liquid-vs-evil-geniuses">
          <button style={{
            padding: '15px 30px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: 'pointer',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            ⚔️ Team Liquid vs Evil Geniuses
          </button>
        </Link>
      </div>
      
      <div style={{ marginTop: '40px', color: '#888' }}>
        <p>🔴 Live streaming with real-time polls and viewer interaction</p>
        <p>📱 Responsive design for all devices</p>
        <p>⚡ Powered by Next.js and Socket.io</p>
      </div>
    </div>
  );
};

const Home: React.FC = () => {
  return (
    <>
      <Head>
        <title>eSports Streaming Platform</title>
        <meta name="description" content="Live eSports streaming and events platform" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <main className="main">
        <Welcome />
      </main>
    </>
  );
};

export default Home;
