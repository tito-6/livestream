// Simple Mock API Server for eSports Platform
// This replaces the Go API Gateway for demonstration purposes

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Mock data
const mockStreams = [
    {
        id: 'stream_001',
        name: 'eSports Grand Final',
        status: 'LIVE',
        viewers: 1250,
        url: 'rtmp://mock.example.com/stream1'
    },
    {
        id: 'stream_002', 
        name: 'Team Liquid vs Evil Geniuses',
        status: 'LIVE',
        viewers: 890,
        url: 'rtmp://mock.example.com/stream2'
    }
];

// Health endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'UP',
        service: 'eSports-API-Gateway-Mock',
        timestamp: new Date().toISOString()
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'eSports Platform API Gateway (Mock)',
        version: '1.0.0'
    });
});

// Admin endpoints
app.get('/api/v1/streams/list', (req, res) => {
    const adminKey = req.headers['x-admin-key'];
    if (adminKey !== 'SUPER_SECURE_KEY') {
        return res.status(401).json({
            error: 'Unauthorized: Invalid Admin Key'
        });
    }
    
    res.json({
        status: 'success',
        streams: mockStreams
    });
});

app.post('/api/v1/streams/start', (req, res) => {
    const adminKey = req.headers['x-admin-key'];
    if (adminKey !== 'SUPER_SECURE_KEY') {
        return res.status(401).json({
            error: 'Unauthorized: Invalid Admin Key'
        });
    }
    
    res.json({
        status: 'success',
        message: 'Stream start request received (MOCK)'
    });
});

app.post('/api/v1/streams/stop', (req, res) => {
    const adminKey = req.headers['x-admin-key'];
    if (adminKey !== 'SUPER_SECURE_KEY') {
        return res.status(401).json({
            error: 'Unauthorized: Invalid Admin Key'
        });
    }
    
    res.json({
        status: 'success',
        message: 'Stream stop request received (MOCK)'
    });
});

// OAuth endpoints
app.get('/api/v1/auth/google/login', (req, res) => {
    res.json({
        status: 'info',
        message: 'STUB: Redirecting to Google Login URL.',
        url: '/auth/google/callback?code=MOCK_AUTH_CODE'
    });
});

app.get('/api/v1/auth/google/callback', (req, res) => {
    const code = req.query.code;
    if (!code) {
        return res.status(401).json({
            error: 'Missing authorization code.'
        });
    }
    
    // Mock JWT token
    const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoidXNlcl8xMDk4NzY1NDMyMSIsImlhdCI6MTY5OTEyMzQ1NiwiZXhwIjoxNjk5MjA5ODU2fQ.mock-signature';
    
    res.json({
        status: 'success',
        message: 'Authentication successful.',
        token: mockToken,
        user_id: 'user_10987654321'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Mock API Gateway running on http://localhost:${PORT}`);
    console.log(`📋 Available endpoints:`);
    console.log(`   GET  /health - Health check`);
    console.log(`   GET  / - Root endpoint`);
    console.log(`   GET  /api/v1/streams/list - List streams (requires X-Admin-Key)`);
    console.log(`   POST /api/v1/streams/start - Start stream (requires X-Admin-Key)`);
    console.log(`   POST /api/v1/streams/stop - Stop stream (requires X-Admin-Key)`);
    console.log(`   GET  /api/v1/auth/google/login - OAuth login`);
    console.log(`   GET  /api/v1/auth/google/callback - OAuth callback`);
    console.log(`🔑 Admin Key: SUPER_SECURE_KEY`);
});
