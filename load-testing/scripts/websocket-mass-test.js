#!/usr/bin/env node

/**
 * WebSocket Mass Connection Test
 * Tests the platform's ability to handle massive concurrent WebSocket connections
 */

const { io } = require('socket.io-client');
const { performance } = require('perf_hooks');

// Configuration
const NOTIFICATION_SVC_URL = process.env.NOTIFICATION_SVC_URL || 'http://localhost:3001';
const TARGET_CONNECTIONS = parseInt(process.env.TARGET_CONNECTIONS) || 10000;
const CONNECTION_BATCH_SIZE = parseInt(process.env.BATCH_SIZE) || 100;
const BATCH_DELAY = parseInt(process.env.BATCH_DELAY) || 100; // ms

class WebSocketMassTest {
    constructor() {
        this.connections = [];
        this.stats = {
            connected: 0,
            failed: 0,
            disconnected: 0,
            startTime: null,
            endTime: null,
            errors: []
        };
    }

    async run() {
        console.log(`🚀 Starting WebSocket Mass Connection Test`);
        console.log(`📊 Target: ${TARGET_CONNECTIONS} connections`);
        console.log(`📦 Batch Size: ${CONNECTION_BATCH_SIZE}`);
        console.log(`⏱️  Batch Delay: ${BATCH_DELAY}ms`);
        console.log('');

        this.stats.startTime = performance.now();

        try {
            await this.createConnections();
            await this.monitorConnections();
            await this.triggerPollTest();
            await this.cleanup();
        } catch (error) {
            console.error('❌ Test failed:', error);
            process.exit(1);
        }

        this.printResults();
    }

    async createConnections() {
        console.log('🔌 Creating WebSocket connections...');
        
        for (let i = 0; i < TARGET_CONNECTIONS; i += CONNECTION_BATCH_SIZE) {
            const batchEnd = Math.min(i + CONNECTION_BATCH_SIZE, TARGET_CONNECTIONS);
            const batchSize = batchEnd - i;
            
            console.log(`📦 Creating batch ${Math.floor(i / CONNECTION_BATCH_SIZE) + 1}: connections ${i + 1}-${batchEnd}`);
            
            await this.createBatch(i, batchSize);
            
            if (batchEnd < TARGET_CONNECTIONS) {
                await this.delay(BATCH_DELAY);
            }
        }
    }

    async createBatch(startIndex, batchSize) {
        const promises = [];
        
        for (let i = 0; i < batchSize; i++) {
            const connectionIndex = startIndex + i;
            promises.push(this.createConnection(connectionIndex));
        }
        
        await Promise.allSettled(promises);
    }

    async createConnection(index) {
        return new Promise((resolve) => {
            const socket = io(NOTIFICATION_SVC_URL, {
                timeout: 10000,
                forceNew: true
            });

            const timeout = setTimeout(() => {
                this.stats.failed++;
                this.stats.errors.push(`Connection ${index}: Timeout`);
                resolve();
            }, 10000);

            socket.on('connect', () => {
                clearTimeout(timeout);
                this.stats.connected++;
                this.connections.push(socket);
                
                // Listen for viewer count updates
                socket.on('viewerCount', (data) => {
                    if (index === 0) { // Only log for first connection to avoid spam
                        console.log(`👁️  Viewer count: ${data.count}`);
                    }
                });

                // Listen for poll notifications
                socket.on('newPoll', (poll) => {
                    if (index === 0) { // Only log for first connection
                        console.log(`🗳️  Poll received: ${poll.question}`);
                    }
                });

                resolve();
            });

            socket.on('connect_error', (error) => {
                clearTimeout(timeout);
                this.stats.failed++;
                this.stats.errors.push(`Connection ${index}: ${error.message}`);
                resolve();
            });

            socket.on('disconnect', () => {
                this.stats.disconnected++;
            });
        });
    }

    async monitorConnections() {
        console.log('👀 Monitoring connections for 30 seconds...');
        await this.delay(30000);
        
        console.log(`📊 Current stats: ${this.stats.connected} connected, ${this.stats.failed} failed`);
    }

    async triggerPollTest() {
        console.log('📢 Triggering poll notification test...');
        
        try {
            const axios = require('axios');
            const response = await axios.post(`${NOTIFICATION_SVC_URL}/notify/poll`);
            
            if (response.status === 200) {
                console.log('✅ Poll notification triggered successfully');
                console.log(`📡 Broadcasted to ${this.stats.connected} connections`);
            } else {
                console.log('❌ Failed to trigger poll notification');
            }
        } catch (error) {
            console.log('❌ Error triggering poll:', error.message);
        }
        
        // Wait for poll to be received
        await this.delay(5000);
    }

    async cleanup() {
        console.log('🧹 Cleaning up connections...');
        
        this.connections.forEach(socket => {
            socket.disconnect();
        });
        
        await this.delay(2000);
        this.stats.endTime = performance.now();
    }

    printResults() {
        const duration = (this.stats.endTime - this.stats.startTime) / 1000;
        const successRate = (this.stats.connected / TARGET_CONNECTIONS) * 100;
        
        console.log('');
        console.log('📊 WebSocket Mass Connection Test Results');
        console.log('==========================================');
        console.log(`🎯 Target Connections: ${TARGET_CONNECTIONS}`);
        console.log(`✅ Successful Connections: ${this.stats.connected}`);
        console.log(`❌ Failed Connections: ${this.stats.failed}`);
        console.log(`🔌 Disconnected: ${this.stats.disconnected}`);
        console.log(`📈 Success Rate: ${successRate.toFixed(2)}%`);
        console.log(`⏱️  Total Duration: ${duration.toFixed(2)}s`);
        console.log(`🚀 Connections/Second: ${(this.stats.connected / duration).toFixed(2)}`);
        
        if (this.stats.errors.length > 0) {
            console.log('');
            console.log('❌ Errors:');
            this.stats.errors.slice(0, 10).forEach(error => {
                console.log(`   ${error}`);
            });
            if (this.stats.errors.length > 10) {
                console.log(`   ... and ${this.stats.errors.length - 10} more errors`);
            }
        }
        
        // Performance assessment
        console.log('');
        console.log('🎯 Performance Assessment:');
        if (successRate >= 95) {
            console.log('🟢 EXCELLENT: Platform handles high concurrency well');
        } else if (successRate >= 80) {
            console.log('🟡 GOOD: Platform handles moderate concurrency');
        } else if (successRate >= 60) {
            console.log('🟠 FAIR: Platform struggles with high concurrency');
        } else {
            console.log('🔴 POOR: Platform cannot handle target load');
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Run the test
if (require.main === module) {
    const test = new WebSocketMassTest();
    test.run().catch(console.error);
}

module.exports = WebSocketMassTest;
