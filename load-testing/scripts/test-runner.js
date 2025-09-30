#!/usr/bin/env node

/**
 * Comprehensive Test Runner
 * Orchestrates all load tests and generates reports
 */

const { spawn } = require('child_process');
const fs = require('fs').promises;
const path = require('path');

class TestRunner {
    constructor() {
        this.results = {
            timestamp: new Date().toISOString(),
            tests: [],
            summary: {}
        };
        
        this.testConfigs = [
            {
                name: 'API Load Test',
                command: 'npm run test:api',
                config: 'configs/api-load-test.yml',
                description: 'Tests API Gateway under normal to peak load'
            },
            {
                name: 'WebSocket Load Test',
                command: 'npm run test:websocket',
                config: 'configs/websocket-load-test.yml',
                description: 'Tests WebSocket connections under load'
            },
            {
                name: 'Full Platform Test',
                command: 'npm run test:full',
                config: 'configs/full-platform-test.yml',
                description: 'End-to-end platform testing'
            },
            {
                name: 'Stress Test',
                command: 'npm run test:stress',
                config: 'configs/stress-test.yml',
                description: 'Tests platform breaking points'
            },
            {
                name: 'Spike Test',
                command: 'npm run test:spike',
                config: 'configs/spike-test.yml',
                description: 'Tests platform response to traffic spikes'
            }
        ];
    }

    async run() {
        console.log('🚀 eSports Platform Load Testing Suite');
        console.log('=====================================');
        console.log(`📅 Test Run: ${this.results.timestamp}`);
        console.log('');

        // Check prerequisites
        await this.checkPrerequisites();
        
        // Run all tests
        for (const testConfig of this.testConfigs) {
            await this.runTest(testConfig);
        }
        
        // Generate summary report
        await this.generateReport();
        
        console.log('✅ All tests completed!');
        console.log(`📊 Results saved to: results/test-run-${Date.now()}.json`);
    }

    async checkPrerequisites() {
        console.log('🔍 Checking prerequisites...');
        
        const services = [
            { name: 'API Gateway', url: 'http://localhost:8080/health' },
            { name: 'Notification Service', url: 'http://localhost:3001/health' }
        ];
        
        for (const service of services) {
            try {
                const axios = require('axios');
                const response = await axios.get(service.url, { timeout: 5000 });
                if (response.status === 200) {
                    console.log(`✅ ${service.name}: Running`);
                } else {
                    console.log(`⚠️  ${service.name}: Unexpected status ${response.status}`);
                }
            } catch (error) {
                console.log(`❌ ${service.name}: Not accessible (${error.message})`);
                console.log('   Please ensure all services are running before starting tests.');
                process.exit(1);
            }
        }
        
        console.log('');
    }

    async runTest(testConfig) {
        console.log(`🧪 Running: ${testConfig.name}`);
        console.log(`📝 Description: ${testConfig.description}`);
        console.log(`⚙️  Config: ${testConfig.config}`);
        
        const startTime = Date.now();
        
        try {
            const result = await this.executeCommand(testConfig.command);
            const endTime = Date.now();
            const duration = endTime - startTime;
            
            this.results.tests.push({
                name: testConfig.name,
                config: testConfig.config,
                description: testConfig.description,
                status: 'completed',
                duration: duration,
                startTime: new Date(startTime).toISOString(),
                endTime: new Date(endTime).toISOString(),
                output: result.output,
                error: result.error
            });
            
            console.log(`✅ ${testConfig.name}: Completed in ${duration}ms`);
            
        } catch (error) {
            const endTime = Date.now();
            const duration = endTime - startTime;
            
            this.results.tests.push({
                name: testConfig.name,
                config: testConfig.config,
                description: testConfig.description,
                status: 'failed',
                duration: duration,
                startTime: new Date(startTime).toISOString(),
                endTime: new Date(endTime).toISOString(),
                error: error.message
            });
            
            console.log(`❌ ${testConfig.name}: Failed (${error.message})`);
        }
        
        console.log('');
    }

    async executeCommand(command) {
        return new Promise((resolve, reject) => {
            const [cmd, ...args] = command.split(' ');
            const child = spawn(cmd, args, {
                cwd: process.cwd(),
                stdio: ['pipe', 'pipe', 'pipe']
            });
            
            let output = '';
            let error = '';
            
            child.stdout.on('data', (data) => {
                output += data.toString();
            });
            
            child.stderr.on('data', (data) => {
                error += data.toString();
            });
            
            child.on('close', (code) => {
                if (code === 0) {
                    resolve({ output, error });
                } else {
                    reject(new Error(`Command failed with code ${code}: ${error}`));
                }
            });
            
            child.on('error', (err) => {
                reject(err);
            });
        });
    }

    async generateReport() {
        console.log('📊 Generating test report...');
        
        // Calculate summary statistics
        const completedTests = this.results.tests.filter(t => t.status === 'completed');
        const failedTests = this.results.tests.filter(t => t.status === 'failed');
        
        this.results.summary = {
            totalTests: this.results.tests.length,
            completedTests: completedTests.length,
            failedTests: failedTests.length,
            successRate: (completedTests.length / this.results.tests.length) * 100,
            totalDuration: this.results.tests.reduce((sum, t) => sum + t.duration, 0),
            averageDuration: this.results.tests.reduce((sum, t) => sum + t.duration, 0) / this.results.tests.length
        };
        
        // Create results directory if it doesn't exist
        await this.ensureResultsDirectory();
        
        // Save JSON report
        const timestamp = Date.now();
        const jsonFile = `results/test-run-${timestamp}.json`;
        await fs.writeFile(jsonFile, JSON.stringify(this.results, null, 2));
        
        // Generate HTML report
        const htmlFile = `results/test-run-${timestamp}.html`;
        await this.generateHTMLReport(htmlFile);
        
        // Print summary
        this.printSummary();
    }

    async ensureResultsDirectory() {
        try {
            await fs.mkdir('results', { recursive: true });
        } catch (error) {
            // Directory might already exist
        }
    }

    async generateHTMLReport(filename) {
        const html = `
<!DOCTYPE html>
<html>
<head>
    <title>eSports Platform Load Test Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { background: #f0f0f0; padding: 20px; border-radius: 5px; }
        .summary { background: #e8f5e8; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .test { border: 1px solid #ddd; margin: 10px 0; padding: 15px; border-radius: 5px; }
        .success { border-left: 5px solid #4CAF50; }
        .failure { border-left: 5px solid #f44336; }
        .details { background: #f9f9f9; padding: 10px; margin: 10px 0; border-radius: 3px; }
        pre { background: #f4f4f4; padding: 10px; border-radius: 3px; overflow-x: auto; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🚀 eSports Platform Load Test Report</h1>
        <p><strong>Test Run:</strong> ${this.results.timestamp}</p>
        <p><strong>Total Tests:</strong> ${this.results.summary.totalTests}</p>
        <p><strong>Success Rate:</strong> ${this.results.summary.successRate.toFixed(2)}%</p>
    </div>
    
    <div class="summary">
        <h2>📊 Summary</h2>
        <p><strong>Completed Tests:</strong> ${this.results.summary.completedTests}</p>
        <p><strong>Failed Tests:</strong> ${this.results.summary.failedTests}</p>
        <p><strong>Total Duration:</strong> ${(this.results.summary.totalDuration / 1000).toFixed(2)}s</p>
        <p><strong>Average Duration:</strong> ${(this.results.summary.averageDuration / 1000).toFixed(2)}s</p>
    </div>
    
    <h2>🧪 Test Results</h2>
    ${this.results.tests.map(test => `
        <div class="test ${test.status === 'completed' ? 'success' : 'failure'}">
            <h3>${test.name}</h3>
            <p><strong>Status:</strong> ${test.status}</p>
            <p><strong>Duration:</strong> ${(test.duration / 1000).toFixed(2)}s</p>
            <p><strong>Description:</strong> ${test.description}</p>
            ${test.error ? `<div class="details"><strong>Error:</strong><pre>${test.error}</pre></div>` : ''}
        </div>
    `).join('')}
</body>
</html>`;
        
        await fs.writeFile(filename, html);
    }

    printSummary() {
        console.log('📊 Test Run Summary');
        console.log('==================');
        console.log(`📅 Timestamp: ${this.results.timestamp}`);
        console.log(`🧪 Total Tests: ${this.results.summary.totalTests}`);
        console.log(`✅ Completed: ${this.results.summary.completedTests}`);
        console.log(`❌ Failed: ${this.results.summary.failedTests}`);
        console.log(`📈 Success Rate: ${this.results.summary.successRate.toFixed(2)}%`);
        console.log(`⏱️  Total Duration: ${(this.results.summary.totalDuration / 1000).toFixed(2)}s`);
        console.log(`📊 Average Duration: ${(this.results.summary.averageDuration / 1000).toFixed(2)}s`);
        
        if (this.results.summary.failedTests > 0) {
            console.log('');
            console.log('❌ Failed Tests:');
            this.results.tests.filter(t => t.status === 'failed').forEach(test => {
                console.log(`   - ${test.name}: ${test.error}`);
            });
        }
    }
}

// Run the test suite
if (require.main === module) {
    const runner = new TestRunner();
    runner.run().catch(console.error);
}

module.exports = TestRunner;
