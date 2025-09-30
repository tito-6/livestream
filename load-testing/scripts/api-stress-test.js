#!/usr/bin/env node

/**
 * API Stress Test
 * Tests the API Gateway's ability to handle high-frequency requests
 */

const axios = require('axios');
const { performance } = require('perf_hooks');

// Configuration
const API_GATEWAY_URL = process.env.API_GATEWAY_URL || 'http://localhost:8080';
const NOTIFICATION_SVC_URL = process.env.NOTIFICATION_SVC_URL || 'http://localhost:3001';
const ADMIN_API_KEY = process.env.ADMIN_API_KEY || 'SUPER_SECURE_KEY';

class APIStressTest {
    constructor() {
        this.stats = {
            requests: 0,
            successful: 0,
            failed: 0,
            responseTimes: [],
            errors: [],
            startTime: null,
            endTime: null
        };
    }

    async run() {
        console.log('🚀 Starting API Stress Test');
        console.log('');

        this.stats.startTime = performance.now();

        try {
            await this.testHealthEndpoints();
            await this.testAdminEndpoints();
            await this.testOAuthEndpoints();
            await this.testStreamEndpoints();
            await this.testNotificationEndpoints();
        } catch (error) {
            console.error('❌ Test failed:', error);
        }

        this.stats.endTime = performance.now();
        this.printResults();
    }

    async testHealthEndpoints() {
        console.log('🏥 Testing Health Endpoints...');
        
        const endpoints = [
            { url: `${API_GATEWAY_URL}/health`, name: 'API Gateway Health' },
            { url: `${NOTIFICATION_SVC_URL}/health`, name: 'Notification Service Health' }
        ];

        for (const endpoint of endpoints) {
            await this.stressEndpoint(endpoint.url, endpoint.name, 100);
        }
    }

    async testAdminEndpoints() {
        console.log('🔐 Testing Admin Endpoints...');
        
        const endpoints = [
            { 
                url: `${API_GATEWAY_URL}/api/v1/streams/list`, 
                name: 'Stream List',
                headers: { 'X-Admin-Key': ADMIN_API_KEY }
            },
            { 
                url: `${API_GATEWAY_URL}/api/v1/streams/start`, 
                name: 'Start Stream',
                method: 'POST',
                headers: { 
                    'X-Admin-Key': ADMIN_API_KEY,
                    'Content-Type': 'application/json'
                },
                data: {
                    stream_id: `stress-test-${Date.now()}`,
                    stream_url: 'rtmp://stress.test.com/stream',
                    username: 'stress_user',
                    password: 'stress_pass'
                }
            }
        ];

        for (const endpoint of endpoints) {
            await this.stressEndpoint(endpoint.url, endpoint.name, 50, endpoint);
        }
    }

    async testOAuthEndpoints() {
        console.log('🔑 Testing OAuth Endpoints...');
        
        const endpoints = [
            { url: `${API_GATEWAY_URL}/api/v1/auth/google/login`, name: 'OAuth Login' },
            { url: `${API_GATEWAY_URL}/api/v1/auth/google/callback?code=MOCK_AUTH_CODE`, name: 'OAuth Callback' }
        ];

        for (const endpoint of endpoints) {
            await this.stressEndpoint(endpoint.url, endpoint.name, 75);
        }
    }

    async testStreamEndpoints() {
        console.log('📺 Testing Stream Endpoints...');
        
        const endpoints = [
            { 
                url: `${API_GATEWAY_URL}/api/v1/streams/stop`, 
                name: 'Stop Stream',
                method: 'POST',
                headers: { 
                    'X-Admin-Key': ADMIN_API_KEY,
                    'Content-Type': 'application/json'
                },
                data: {
                    stream_id: `stress-test-${Date.now()}`
                }
            }
        ];

        for (const endpoint of endpoints) {
            await this.stressEndpoint(endpoint.url, endpoint.name, 25, endpoint);
        }
    }

    async testNotificationEndpoints() {
        console.log('📢 Testing Notification Endpoints...');
        
        const endpoints = [
            { 
                url: `${NOTIFICATION_SVC_URL}/notify/poll`, 
                name: 'Trigger Poll',
                method: 'POST'
            }
        ];

        for (const endpoint of endpoints) {
            await this.stressEndpoint(endpoint.url, endpoint.name, 30, endpoint);
        }
    }

    async stressEndpoint(url, name, requestCount, options = {}) {
        console.log(`   📡 ${name}: ${requestCount} requests`);
        
        const promises = [];
        
        for (let i = 0; i < requestCount; i++) {
            promises.push(this.makeRequest(url, options));
        }
        
        await Promise.allSettled(promises);
    }

    async makeRequest(url, options = {}) {
        const startTime = performance.now();
        
        try {
            const config = {
                url,
                method: options.method || 'GET',
                headers: options.headers || {},
                data: options.data,
                timeout: 10000
            };
            
            const response = await axios(config);
            const endTime = performance.now();
            const responseTime = endTime - startTime;
            
            this.stats.requests++;
            this.stats.successful++;
            this.stats.responseTimes.push(responseTime);
            
            return response;
        } catch (error) {
            const endTime = performance.now();
            const responseTime = endTime - startTime;
            
            this.stats.requests++;
            this.stats.failed++;
            this.stats.responseTimes.push(responseTime);
            this.stats.errors.push({
                url,
                error: error.message,
                status: error.response?.status,
                responseTime
            });
            
            return null;
        }
    }

    printResults() {
        const duration = (this.stats.endTime - this.stats.startTime) / 1000;
        const successRate = (this.stats.successful / this.stats.requests) * 100;
        const avgResponseTime = this.stats.responseTimes.reduce((a, b) => a + b, 0) / this.stats.responseTimes.length;
        const maxResponseTime = Math.max(...this.stats.responseTimes);
        const minResponseTime = Math.min(...this.stats.responseTimes);
        
        // Calculate percentiles
        const sortedTimes = this.stats.responseTimes.sort((a, b) => a - b);
        const p95 = sortedTimes[Math.floor(sortedTimes.length * 0.95)];
        const p99 = sortedTimes[Math.floor(sortedTimes.length * 0.99)];
        
        console.log('');
        console.log('📊 API Stress Test Results');
        console.log('==========================');
        console.log(`📡 Total Requests: ${this.stats.requests}`);
        console.log(`✅ Successful: ${this.stats.successful}`);
        console.log(`❌ Failed: ${this.stats.failed}`);
        console.log(`📈 Success Rate: ${successRate.toFixed(2)}%`);
        console.log(`⏱️  Total Duration: ${duration.toFixed(2)}s`);
        console.log(`🚀 Requests/Second: ${(this.stats.requests / duration).toFixed(2)}`);
        console.log('');
        console.log('⏱️  Response Time Statistics:');
        console.log(`   Average: ${avgResponseTime.toFixed(2)}ms`);
        console.log(`   Minimum: ${minResponseTime.toFixed(2)}ms`);
        console.log(`   Maximum: ${maxResponseTime.toFixed(2)}ms`);
        console.log(`   95th Percentile: ${p95.toFixed(2)}ms`);
        console.log(`   99th Percentile: ${p99.toFixed(2)}ms`);
        
        if (this.stats.errors.length > 0) {
            console.log('');
            console.log('❌ Error Summary:');
            const errorCounts = {};
            this.stats.errors.forEach(error => {
                const key = `${error.status || 'Network'}: ${error.error}`;
                errorCounts[key] = (errorCounts[key] || 0) + 1;
            });
            
            Object.entries(errorCounts).forEach(([error, count]) => {
                console.log(`   ${error}: ${count} occurrences`);
            });
        }
        
        // Performance assessment
        console.log('');
        console.log('🎯 Performance Assessment:');
        if (successRate >= 95 && avgResponseTime < 500) {
            console.log('🟢 EXCELLENT: API handles stress well');
        } else if (successRate >= 90 && avgResponseTime < 1000) {
            console.log('🟡 GOOD: API handles moderate stress');
        } else if (successRate >= 80 && avgResponseTime < 2000) {
            console.log('🟠 FAIR: API struggles under stress');
        } else {
            console.log('🔴 POOR: API cannot handle stress load');
        }
    }
}

// Run the test
if (require.main === module) {
    const test = new APIStressTest();
    test.run().catch(console.error);
}

module.exports = APIStressTest;
