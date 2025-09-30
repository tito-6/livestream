import axios from 'axios';
import { io, Socket } from 'socket.io-client';

const NOTIFICATION_SVC_URL = 'http://localhost:3001';

describe('Notification Service Integration Tests', () => {
    
    test('Health endpoint should return service status', async () => {
        const response = await axios.get(`${NOTIFICATION_SVC_URL}/health`);
        
        expect(response.status).toBe(200);
        expect(response.data.status).toBe('UP');
        expect(response.data).toHaveProperty('sockets');
        expect(response.data).toHaveProperty('timestamp');
    });

    test('Root endpoint should return service information', async () => {
        const response = await axios.get(`${NOTIFICATION_SVC_URL}/`);
        
        expect(response.status).toBe(200);
        expect(response.data.service).toBe('Notification-Service');
        expect(response.data.version).toBe('1.0');
    });

    test('Socket connection should establish successfully', (done) => {
        const client: Socket = io(NOTIFICATION_SVC_URL, { timeout: 5000 });

        client.on('connect', () => {
            expect(client.connected).toBe(true);
            client.disconnect();
            done();
        });

        client.on('connect_error', (err) => {
            client.disconnect();
            done(new Error(`Connection failed: ${err.message}`));
        });
    });

    test('Viewer count should update on connection and disconnection', (done) => {
        const client1: Socket = io(NOTIFICATION_SVC_URL, { timeout: 5000 });
        const client2: Socket = io(NOTIFICATION_SVC_URL, { timeout: 5000 });
        
        let viewerCountUpdates: number[] = [];
        let connectionsEstablished = 0;

        const handleViewerCount = (data: { count: number }) => {
            viewerCountUpdates.push(data.count);
            
            // After both clients connect and we get viewer count updates
            if (connectionsEstablished === 2 && viewerCountUpdates.length >= 2) {
                // Should have at least 2 viewers when both are connected
                expect(Math.max(...viewerCountUpdates)).toBeGreaterThanOrEqual(2);
                
                // Disconnect one client
                client1.disconnect();
                
                // Wait a bit for the viewer count to update
                setTimeout(() => {
                    client2.disconnect();
                    done();
                }, 1000);
            }
        };

        client1.on('connect', () => {
            connectionsEstablished++;
            client1.on('viewerCount', handleViewerCount);
        });

        client2.on('connect', () => {
            connectionsEstablished++;
            client2.on('viewerCount', handleViewerCount);
        });

        client1.on('connect_error', (err) => {
            client1.disconnect();
            client2.disconnect();
            done(new Error(`Client 1 connection failed: ${err.message}`));
        });

        client2.on('connect_error', (err) => {
            client1.disconnect();
            client2.disconnect();
            done(new Error(`Client 2 connection failed: ${err.message}`));
        });
    }, 15000);

    test('Poll notification should have correct structure', async () => {
        const response = await axios.post(`${NOTIFICATION_SVC_URL}/notify/poll`);
        
        expect(response.status).toBe(200);
        expect(response.data.status).toBe('success');
        expect(response.data).toHaveProperty('payload');
        
        const payload = response.data.payload;
        expect(payload.type).toBe('poll');
        expect(payload).toHaveProperty('streamId');
        expect(payload).toHaveProperty('question');
        expect(payload).toHaveProperty('options');
        expect(payload).toHaveProperty('expiresAt');
        expect(Array.isArray(payload.options)).toBe(true);
        expect(payload.options.length).toBeGreaterThan(0);
    });
});
