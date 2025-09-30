import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

// Define the expected types for real-time data
interface PollNotification {
    streamId: string;
    question: string;
    options: { id: number; text: string }[];
    expiresAt: number;
}

/**
 * Component to handle and display real-time data from the Notification Service.
 */
const RealtimeChat: React.FC = () => {
    const [viewerCount, setViewerCount] = useState<number>(0);
    const [activePoll, setActivePoll] = useState<PollNotification | null>(null);
    const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');

    useEffect(() => {
        // Connect to the Notification Service running on port 3001
        const socket: Socket = io('http://localhost:3001');

        socket.on('connect', () => {
            setConnectionStatus('connected');
            console.log('🔗 Socket.io Connected to Notification Service!');
        });

        socket.on('disconnect', () => {
            setConnectionStatus('disconnected');
            console.log('🔌 Socket.io Disconnected.');
        });

        // Listener for live viewer count updates
        socket.on('viewerCount', (data: { count: number }) => {
            console.log(`👁️ Viewer count updated: ${data.count}`);
            setViewerCount(data.count);
        });

        // Listener for new poll notifications
        socket.on('newPoll', (poll: PollNotification) => {
            console.log('🗳️ New Poll Received:', poll.question);
            setActivePoll(poll);

            // Set a timeout to clear the poll after its mock expiration time
            const expirationInSeconds = poll.expiresAt - Math.floor(Date.now() / 1000);
            if (expirationInSeconds > 0) {
                setTimeout(() => {
                    setActivePoll(null);
                    console.log('🗳️ Active poll expired and cleared.');
                }, expirationInSeconds * 1000);
            }
        });

        // Cleanup function to close the socket connection on unmount
        return () => {
            socket.disconnect();
        };
    }, []); // Empty dependency array means this runs only once on mount

    return (
        <div style={{ padding: '15px', borderLeft: '1px solid #ccc', height: '100%' }}>
            <h3>Real-time Feed</h3>
            <p style={{ color: connectionStatus === 'connected' ? 'green' : 'red' }}>
                Status: **{connectionStatus.toUpperCase()}**
            </p>
            <p>👁️ Live Viewers: **{viewerCount}**</p>
            <hr />

            {activePoll ? (
                <div style={{ border: '2px solid #0070f3', padding: '10px', borderRadius: '5px' }}>
                    <h4>🗳️ Live Poll: {activePoll.question}</h4>
                    <p style={{ fontSize: '12px', color: '#666' }}>Stream: {activePoll.streamId}</p>
                    <ul>
                        {activePoll.options.map(opt => (
                            <li key={opt.id} style={{ listStyleType: 'none', padding: '5px 0' }}>
                                <button style={{ padding: '5px 10px', backgroundColor: '#f0f0f0', border: '1px solid #ddd' }}>
                                    {opt.text}
                                </button>
                            </li>
                        ))}
                    </ul>
                    <small>Poll expires in {Math.max(0, activePoll.expiresAt - Math.floor(Date.now() / 1000))} seconds.</small>
                </div>
            ) : (
                <p>No active polls at the moment.</p>
            )}

            {/* STUB for Chat messages/input to be added later */}
            <div style={{ marginTop: '20px' }}>
                <p style={{ color: '#999' }}>*(Chat window integration coming soon)*</p>
            </div>
        </div>
    );
};

export default RealtimeChat;
