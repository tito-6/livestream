import axios from 'axios';

const API_GATEWAY_URL = 'http://localhost:8080';
const ADMIN_API_KEY = 'SUPER_SECURE_KEY';
const MOCK_AUTH_CODE = 'MOCK_AUTH_CODE';

describe('API Gateway Integration Tests', () => {
    
    test('Health endpoint should return service status', async () => {
        const response = await axios.get(`${API_GATEWAY_URL}/health`);
        
        expect(response.status).toBe(200);
        expect(response.data.status).toBe('UP');
        expect(response.data.service).toBe('eSports-API-Gateway');
        expect(response.data).toHaveProperty('timestamp');
    });

    test('Root endpoint should return service information', async () => {
        const response = await axios.get(`${API_GATEWAY_URL}/`);
        
        expect(response.status).toBe(200);
        expect(response.data.message).toBe('eSports Platform API Gateway');
        expect(response.data.version).toBe('1.0.0');
    });

    test('Admin endpoints should require authentication', async () => {
        // Test without any header
        try {
            await axios.get(`${API_GATEWAY_URL}/api/v1/streams/list`);
            fail('Request should have failed without admin key');
        } catch (error) {
            expect(axios.isAxiosError(error)).toBe(true);
            expect(error.response?.status).toBe(401);
        }

        // Test with wrong key
        try {
            await axios.get(`${API_GATEWAY_URL}/api/v1/streams/list`, {
                headers: { 'X-Admin-Key': 'wrong-key' }
            });
            fail('Request should have failed with wrong admin key');
        } catch (error) {
            expect(axios.isAxiosError(error)).toBe(true);
            expect(error.response?.status).toBe(401);
        }
    });

    test('Admin stream list should work with correct key', async () => {
        const response = await axios.get(`${API_GATEWAY_URL}/api/v1/streams/list`, {
            headers: { 'X-Admin-Key': ADMIN_API_KEY }
        });
        
        expect(response.status).toBe(200);
        expect(response.data.status).toBe('success');
        expect(response.data).toHaveProperty('streams');
        expect(Array.isArray(response.data.streams)).toBe(true);
    });

    test('Admin stream start should work with correct key', async () => {
        const streamData = {
            stream_id: 'test-stream-001',
            stream_url: 'rtmp://test.example.com/stream',
            username: 'test_user',
            password: 'test_pass'
        };

        const response = await axios.post(`${API_GATEWAY_URL}/api/v1/streams/start`, streamData, {
            headers: { 
                'X-Admin-Key': ADMIN_API_KEY,
                'Content-Type': 'application/json'
            }
        });
        
        expect(response.status).toBe(200);
        expect(response.data.status).toBe('success');
        expect(response.data.message).toContain('Stream start request received');
    });

    test('Admin stream stop should work with correct key', async () => {
        const streamData = {
            stream_id: 'test-stream-001'
        };

        const response = await axios.post(`${API_GATEWAY_URL}/api/v1/streams/stop`, streamData, {
            headers: { 
                'X-Admin-Key': ADMIN_API_KEY,
                'Content-Type': 'application/json'
            }
        });
        
        expect(response.status).toBe(200);
        expect(response.data.status).toBe('success');
        expect(response.data.message).toContain('Stream stop request received');
    });

    test('OAuth login endpoint should be accessible without auth', async () => {
        const response = await axios.get(`${API_GATEWAY_URL}/api/v1/auth/google/login`);
        
        expect(response.status).toBe(200);
        expect(response.data.status).toBe('info');
        expect(response.data.message).toContain('Redirecting to Google Login URL');
    });

    test('OAuth callback should return JWT token', async () => {
        const response = await axios.get(`${API_GATEWAY_URL}/api/v1/auth/google/callback?code=${MOCK_AUTH_CODE}`);
        
        expect(response.status).toBe(200);
        expect(response.data.status).toBe('success');
        expect(response.data.message).toBe('Authentication successful.');
        expect(response.data).toHaveProperty('token');
        expect(response.data).toHaveProperty('user_id');
        expect(typeof response.data.token).toBe('string');
        expect(typeof response.data.user_id).toBe('string');
    });

    test('OAuth callback should fail without code', async () => {
        try {
            await axios.get(`${API_GATEWAY_URL}/api/v1/auth/google/callback`);
            fail('Request should have failed without auth code');
        } catch (error) {
            expect(axios.isAxiosError(error)).toBe(true);
            expect(error.response?.status).toBe(401);
            expect(error.response?.data.error).toBe('Missing authorization code.');
        }
    });
});
