# Integration Test Suite

This directory contains comprehensive integration tests for the eSports streaming platform.

## Test Structure

- `integration/fullFlow.test.ts` - End-to-end integration tests covering the complete user journey
- `integration/notificationService.test.ts` - Notification service specific tests
- `integration/apiGateway.test.ts` - API Gateway specific tests
- `setup.ts` - Test configuration and setup

## Prerequisites

Before running the tests, ensure all services are running:

1. **API Gateway** (port 8080):
   ```bash
   cd api-gateway
   go run main.go
   ```

2. **Notification Service** (port 3001):
   ```bash
   cd notification-svc
   npm run dev
   ```

3. **PostgreSQL** (port 5432):
   ```bash
   # Using Docker Compose
   docker-compose up postgres
   ```

## Running Tests

### Run All Tests
```bash
cd notification-svc
npm test
```

### Run Specific Test Files
```bash
# Run only the full flow tests
npm test -- fullFlow.test.ts

# Run only API Gateway tests
npm test -- apiGateway.test.ts

# Run only notification service tests
npm test -- notificationService.test.ts
```

### Run Tests with Coverage
```bash
npm test -- --coverage
```

## Test Scenarios

### 1. Full Flow Integration Tests
- ✅ Admin API security (unauthorized access rejection)
- ✅ Admin API access (authorized access success)
- ✅ OAuth authentication flow (JWT token generation)
- ✅ Real-time notification broadcasting (WebSocket events)

### 2. API Gateway Tests
- ✅ Health check endpoint
- ✅ Service information endpoint
- ✅ Admin authentication middleware
- ✅ Stream management endpoints (start/stop/list)
- ✅ OAuth endpoints (login/callback)

### 3. Notification Service Tests
- ✅ Health check endpoint
- ✅ Service information endpoint
- ✅ WebSocket connection establishment
- ✅ Viewer count tracking
- ✅ Poll notification broadcasting

## Test Configuration

### Environment Variables
The tests use the following default configuration:
- API Gateway URL: `http://localhost:8080`
- Notification Service URL: `http://localhost:3001`
- Admin API Key: `SUPER_SECURE_KEY`
- Mock Auth Code: `MOCK_AUTH_CODE`

### Timeouts
- Default test timeout: 15 seconds
- Socket connection timeout: 5 seconds
- Async test timeout: 10 seconds

## Troubleshooting

### Common Issues

1. **Connection Refused Errors**
   - Ensure all services are running on the correct ports
   - Check firewall settings
   - Verify service health endpoints

2. **Socket Connection Failures**
   - Ensure notification service is running
   - Check CORS configuration
   - Verify WebSocket support

3. **Database Connection Errors**
   - Ensure PostgreSQL is running
   - Check DATABASE_URL environment variable
   - Verify database permissions

### Debug Mode
Run tests with verbose output:
```bash
npm test -- --verbose
```

### Test Isolation
Tests are designed to run independently and clean up after themselves. Each test:
- Establishes its own connections
- Uses mock data to avoid conflicts
- Properly disconnects and cleans up resources

## Continuous Integration

These tests are designed to run in CI/CD pipelines:
- No external dependencies beyond the services themselves
- Deterministic test data and scenarios
- Proper cleanup and resource management
- Clear pass/fail criteria
