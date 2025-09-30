import axios from 'axios';
import { io, Socket } from 'socket.io-client';

// --- MOCK CONFIGURATION ---
// In a real setup, these would be read from environment variables or a config file.
const API_GATEWAY_URL = 'http://localhost:8080';
const NOTIFICATION_SVC_URL = 'http://localhost:3001';
const ADMIN_API_KEY = 'SUPER_SECURE_KEY';
const MOCK_AUTH_CODE = 'MOCK_AUTH_CODE'; 

// Use describe.skip if you don't want to run these during development unless needed.
describe('E2E Integration Test Suite (API Gateway & Notification Service)', () => {
    
    // Test 1: Admin API Security
    test('1. Admin API must fail without correct X-Admin-Key', async () => {
        try {
            await axios.get(`${API_GATEWAY_URL}/api/v1/streams/list`, {
                headers: { 'X-Admin-Key': 'WRONG_KEY' },
            });
            // Fail if the request succeeded unexpectedly
            fail('Request should have failed with 401 Unauthorized'); 
        } catch (error) {
            // Check that we received an HTTP error, and it's 401
            expect(axios.isAxiosError(error)).toBe(true);
            expect(error.response?.status).toBe(401);
            expect(error.response?.data.error).toContain('Unauthorized');
        }
    });

    // Test 2: Admin API Access
    test('2. Admin API must succeed with correct X-Admin-Key', async () => {
        const response = await axios.get(`${API_GATEWAY_URL}/api/v1/streams/list`, {
            headers: { 'X-Admin-Key': ADMIN_API_KEY },
        });
        
        expect(response.status).toBe(200);
        expect(response.data.status).toBe('success');
        expect(response.data).toHaveProperty('streams');
    });

    // Test 3: Viewer Authentication Flow (Stub/Simulated)
    test('3. Viewer OAuth callback must succeed and return a JWT token', async () => {
        const response = await axios.get(`${API_GATEWAY_URL}/api/v1/auth/google/callback?code=${MOCK_AUTH_CODE}`);
        
        expect(response.status).toBe(200);
        expect(response.data.status).toBe('success');
        expect(response.data).toHaveProperty('token');
        expect(typeof response.data.token).toBe('string');
        
        // Optionally store token for later tests
        // const jwtToken = response.data.token;
    });

    // Test 4: Real-time Notification E2E
    test('4. Notification service must broadcast poll event after API trigger', (done) => {
        // Setup Socket.io client
        const client: Socket = io(NOTIFICATION_SVC_URL, { 
            // Add a timeout for the test to fail if connection is slow
            timeout: 5000 
        });

        // 1. Listen for the event first
        client.on('newPoll', (pollData) => {
            try {
                // 3. Verify the event data structure
                expect(pollData).toHaveProperty('question');
                expect(pollData).toHaveProperty('options');
                expect(pollData.options.length).toBeGreaterThan(0);
                
                // Final check, then signal Jest the async test is complete
                client.disconnect();
                done(); 
            } catch (error) {
                // Catch any assertion failure and fail the test
                client.disconnect();
                done(error);
            }
        });

        client.on('connect', async () => {
            // 2. Client is connected, now trigger the API to broadcast
            try {
                const apiResponse = await axios.post(`${NOTIFICATION_SVC_URL}/notify/poll`);
                expect(apiResponse.status).toBe(200);
                expect(apiResponse.data.message).toContain('broadcasted');
            } catch (error) {
                client.disconnect();
                done(error);
            }
        });

        client.on('connect_error', (err) => {
            client.disconnect();
            done(new Error(`Socket connection error: ${err.message}`));
        });
        
        // This test will fail if the 'newPoll' event is not received within Jest's default timeout.
    }, 10000); // Set a higher timeout for the async socket test
});
