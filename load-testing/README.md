# eSports Platform Load Testing Suite

Comprehensive load testing suite designed to validate the platform's performance under high concurrency scenarios typical of live eSports streaming events.

## 🎯 Testing Objectives

### Performance Targets
- **API Gateway**: Handle 10,000+ concurrent requests
- **Notification Service**: Support 100,000+ concurrent WebSocket connections
- **Response Times**: < 200ms for API calls, < 50ms for WebSocket events
- **Uptime**: 99.9% availability during peak load

### Scenarios Covered
1. **Normal Load**: Typical daily usage patterns
2. **Peak Load**: High-traffic events (tournament finals)
3. **Spike Load**: Sudden traffic surges
4. **Stress Load**: Beyond normal capacity limits
5. **WebSocket Load**: Real-time connection stress testing

## 🛠️ Tools & Technologies

- **Artillery.js**: Primary load testing framework
- **Custom Scripts**: Node.js for complex scenarios
- **Monitoring**: Real-time metrics collection
- **Reporting**: Detailed performance analysis

## 📊 Test Categories

### 1. API Load Testing
- Admin endpoint stress testing
- OAuth authentication flow testing
- Stream management operations
- Health check performance

### 2. WebSocket Load Testing
- Connection establishment under load
- Real-time message broadcasting
- Viewer count updates
- Poll notification delivery

### 3. Full Platform Testing
- End-to-end user journey simulation
- Cross-service communication testing
- Database performance under load
- Memory and CPU utilization

## 🚀 Quick Start

### Prerequisites
```bash
# Install dependencies
npm install

# Ensure all services are running
# API Gateway: http://localhost:8080
# Notification Service: http://localhost:3001
# PostgreSQL: localhost:5432
```

### Running Tests

#### Basic API Load Test
```bash
npm run test:api
```

#### WebSocket Load Test
```bash
npm run test:websocket
```

#### Full Platform Test
```bash
npm run test:full
```

#### Stress Test (High Load)
```bash
npm run test:stress
```

#### Spike Test (Sudden Load)
```bash
npm run test:spike
```

#### All Tests
```bash
npm run test:all
```

## 📈 Monitoring & Results

### Real-time Monitoring
```bash
npm run monitor
```

### Results Location
- **Reports**: `results/` directory
- **Logs**: `logs/` directory
- **Metrics**: JSON and HTML formats

## 🔧 Configuration

### Environment Variables
```bash
API_GATEWAY_URL=http://localhost:8080
NOTIFICATION_SVC_URL=http://localhost:3001
ADMIN_API_KEY=SUPER_SECURE_KEY
```

### Custom Scenarios
Modify configuration files in `configs/` directory to adjust:
- User arrival rates
- Test duration
- Concurrent users
- Request patterns

## 📋 Test Scenarios

### Scenario 1: Normal Load (1,000 users)
- Gradual user arrival over 5 minutes
- Typical API usage patterns
- Standard WebSocket connections
- Expected: All requests < 200ms

### Scenario 2: Peak Load (10,000 users)
- Rapid user arrival over 2 minutes
- High API call frequency
- Maximum WebSocket connections
- Expected: 95% requests < 500ms

### Scenario 3: Spike Load (50,000 users)
- Sudden traffic surge
- Stress on all services
- Connection pool exhaustion testing
- Expected: Graceful degradation

### Scenario 4: Stress Load (100,000+ users)
- Beyond normal capacity
- Breaking point identification
- Resource exhaustion testing
- Expected: Service recovery

## 🎛️ Performance Benchmarks

### API Gateway Benchmarks
| Metric | Target | Warning | Critical |
|--------|--------|---------|----------|
| Response Time | < 200ms | > 500ms | > 1000ms |
| Throughput | > 1000 req/s | < 500 req/s | < 100 req/s |
| Error Rate | < 0.1% | > 1% | > 5% |
| CPU Usage | < 70% | > 85% | > 95% |

### Notification Service Benchmarks
| Metric | Target | Warning | Critical |
|--------|--------|---------|----------|
| WebSocket Connections | > 100k | < 50k | < 10k |
| Message Latency | < 50ms | > 100ms | > 500ms |
| Connection Time | < 100ms | > 500ms | > 2000ms |
| Memory Usage | < 2GB | > 4GB | > 8GB |

## 🔍 Troubleshooting

### Common Issues

1. **Connection Refused**
   - Verify all services are running
   - Check port availability
   - Review firewall settings

2. **High Error Rates**
   - Monitor service logs
   - Check database connections
   - Review resource utilization

3. **Memory Leaks**
   - Monitor memory usage over time
   - Check for connection cleanup
   - Review garbage collection

### Performance Optimization

1. **Database Optimization**
   - Connection pooling
   - Query optimization
   - Index optimization

2. **WebSocket Optimization**
   - Connection pooling
   - Message batching
   - Memory management

3. **API Optimization**
   - Response caching
   - Request batching
   - Load balancing

## 📊 Reporting

### Metrics Collected
- Response times (min, max, avg, p95, p99)
- Throughput (requests per second)
- Error rates and types
- Resource utilization (CPU, memory, network)
- WebSocket connection metrics

### Report Formats
- **HTML Reports**: Visual charts and graphs
- **JSON Reports**: Machine-readable data
- **CSV Reports**: Spreadsheet analysis
- **Real-time Dashboard**: Live monitoring

## 🔄 Continuous Integration

### Automated Testing
- Pre-deployment load tests
- Performance regression detection
- Capacity planning validation
- SLA compliance verification

### Integration with CI/CD
```yaml
# Example GitHub Actions workflow
- name: Load Testing
  run: |
    cd load-testing
    npm install
    npm run test:api
    npm run test:websocket
```

## 📚 Additional Resources

- [Artillery.js Documentation](https://artillery.io/docs/)
- [Load Testing Best Practices](https://artillery.io/docs/guides/load-testing-best-practices.html)
- [WebSocket Load Testing](https://artillery.io/docs/guides/websocket-testing.html)
- [Performance Monitoring](https://artillery.io/docs/guides/monitoring.html)
