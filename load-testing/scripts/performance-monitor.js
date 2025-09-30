#!/usr/bin/env node

/**
 * Performance Monitor
 * Real-time monitoring of system performance during load tests
 */

const axios = require('axios');
const { performance } = require('perf_hooks');

// Configuration
const API_GATEWAY_URL = process.env.API_GATEWAY_URL || 'http://localhost:8080';
const NOTIFICATION_SVC_URL = process.env.NOTIFICATION_SVC_URL || 'http://localhost:3001';
const MONITORING_INTERVAL = parseInt(process.env.MONITORING_INTERVAL) || 5000; // 5 seconds

class PerformanceMonitor {
    constructor() {
        this.metrics = {
            apiGateway: {
                responseTime: [],
                status: 'unknown',
                lastCheck: null
            },
            notificationService: {
                responseTime: [],
                status: 'unknown',
                lastCheck: null,
                connections: 0
            },
            startTime: performance.now()
        };
        
        this.isRunning = false;
    }

    async start() {
        console.log('📊 Starting Performance Monitor');
        console.log(`⏱️  Monitoring interval: ${MONITORING_INTERVAL}ms`);
        console.log('');

        this.isRunning = true;
        
        // Start monitoring loop
        while (this.isRunning) {
            await this.collectMetrics();
            this.displayMetrics();
            await this.delay(MONITORING_INTERVAL);
        }
    }

    stop() {
        console.log('\n🛑 Stopping Performance Monitor');
        this.isRunning = false;
        this.printSummary();
    }

    async collectMetrics() {
        const timestamp = new Date().toISOString();
        
        // Monitor API Gateway
        await this.checkService(
            `${API_GATEWAY_URL}/health`,
            'apiGateway',
            timestamp
        );
        
        // Monitor Notification Service
        await this.checkService(
            `${NOTIFICATION_SVC_URL}/health`,
            'notificationService',
            timestamp
        );
    }

    async checkService(url, serviceName, timestamp) {
        const startTime = performance.now();
        
        try {
            const response = await axios.get(url, { timeout: 5000 });
            const endTime = performance.now();
            const responseTime = endTime - startTime;
            
            this.metrics[serviceName].responseTime.push({
                timestamp,
                responseTime,
                status: response.status
            });
            
            this.metrics[serviceName].status = 'healthy';
            this.metrics[serviceName].lastCheck = timestamp;
            
            // Get connection count for notification service
            if (serviceName === 'notificationService' && response.data.sockets !== undefined) {
                this.metrics[serviceName].connections = response.data.sockets;
            }
            
        } catch (error) {
            const endTime = performance.now();
            const responseTime = endTime - startTime;
            
            this.metrics[serviceName].responseTime.push({
                timestamp,
                responseTime,
                status: 'error',
                error: error.message
            });
            
            this.metrics[serviceName].status = 'unhealthy';
            this.metrics[serviceName].lastCheck = timestamp;
        }
        
        // Keep only last 20 measurements
        if (this.metrics[serviceName].responseTime.length > 20) {
            this.metrics[serviceName].responseTime = this.metrics[serviceName].responseTime.slice(-20);
        }
    }

    displayMetrics() {
        // Clear screen (works on most terminals)
        process.stdout.write('\x1B[2J\x1B[0f');
        
        const duration = (performance.now() - this.metrics.startTime) / 1000;
        
        console.log('📊 eSports Platform Performance Monitor');
        console.log('=====================================');
        console.log(`⏱️  Uptime: ${duration.toFixed(0)}s`);
        console.log(`🕐 Current Time: ${new Date().toLocaleTimeString()}`);
        console.log('');
        
        // API Gateway Metrics
        this.displayServiceMetrics('API Gateway', 'apiGateway');
        console.log('');
        
        // Notification Service Metrics
        this.displayServiceMetrics('Notification Service', 'notificationService');
        
        console.log('');
        console.log('Press Ctrl+C to stop monitoring');
    }

    displayServiceMetrics(serviceName, serviceKey) {
        const service = this.metrics[serviceKey];
        const recentTimes = service.responseTime.slice(-10);
        
        if (recentTimes.length === 0) {
            console.log(`🔴 ${serviceName}: No data`);
            return;
        }
        
        const avgResponseTime = recentTimes.reduce((sum, m) => sum + m.responseTime, 0) / recentTimes.length;
        const status = service.status === 'healthy' ? '🟢' : '🔴';
        const lastCheck = service.lastCheck ? new Date(service.lastCheck).toLocaleTimeString() : 'Never';
        
        console.log(`${status} ${serviceName}:`);
        console.log(`   Status: ${service.status}`);
        console.log(`   Avg Response Time: ${avgResponseTime.toFixed(2)}ms`);
        console.log(`   Last Check: ${lastCheck}`);
        
        if (serviceKey === 'notificationService' && service.connections > 0) {
            console.log(`   Active Connections: ${service.connections}`);
        }
        
        // Show recent response times
        const recentTimesStr = recentTimes.map(m => 
            m.status === 'error' ? 'ERR' : `${m.responseTime.toFixed(0)}ms`
        ).join(' ');
        console.log(`   Recent: ${recentTimesStr}`);
    }

    printSummary() {
        console.log('\n📊 Performance Monitoring Summary');
        console.log('=================================');
        
        const duration = (performance.now() - this.metrics.startTime) / 1000;
        console.log(`⏱️  Total Monitoring Time: ${duration.toFixed(2)}s`);
        console.log('');
        
        // API Gateway Summary
        this.printServiceSummary('API Gateway', 'apiGateway');
        console.log('');
        
        // Notification Service Summary
        this.printServiceSummary('Notification Service', 'notificationService');
    }

    printServiceSummary(serviceName, serviceKey) {
        const service = this.metrics[serviceKey];
        const allTimes = service.responseTime;
        
        if (allTimes.length === 0) {
            console.log(`🔴 ${serviceName}: No data collected`);
            return;
        }
        
        const responseTimes = allTimes.map(m => m.responseTime);
        const avgResponseTime = responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length;
        const maxResponseTime = Math.max(...responseTimes);
        const minResponseTime = Math.min(...responseTimes);
        
        const errors = allTimes.filter(m => m.status === 'error').length;
        const errorRate = (errors / allTimes.length) * 100;
        
        console.log(`📊 ${serviceName} Summary:`);
        console.log(`   Total Checks: ${allTimes.length}`);
        console.log(`   Average Response Time: ${avgResponseTime.toFixed(2)}ms`);
        console.log(`   Min Response Time: ${minResponseTime.toFixed(2)}ms`);
        console.log(`   Max Response Time: ${maxResponseTime.toFixed(2)}ms`);
        console.log(`   Error Rate: ${errorRate.toFixed(2)}%`);
        
        if (serviceKey === 'notificationService') {
            const maxConnections = Math.max(...allTimes.map(m => m.connections || 0));
            console.log(`   Max Connections: ${maxConnections}`);
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Received SIGINT, shutting down gracefully...');
    if (global.monitor) {
        global.monitor.stop();
    }
    process.exit(0);
});

// Run the monitor
if (require.main === module) {
    const monitor = new PerformanceMonitor();
    global.monitor = monitor;
    monitor.start().catch(console.error);
}

module.exports = PerformanceMonitor;
