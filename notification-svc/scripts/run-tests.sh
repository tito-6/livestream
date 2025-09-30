#!/bin/bash

# Integration Test Runner Script
# This script ensures all services are running before executing tests

echo "🧪 eSports Platform Integration Test Runner"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if a service is running
check_service() {
    local url=$1
    local service_name=$2
    
    echo -n "Checking $service_name... "
    
    if curl -s "$url" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Running${NC}"
        return 0
    else
        echo -e "${RED}✗ Not running${NC}"
        return 1
    fi
}

# Check if all required services are running
echo "🔍 Checking service availability..."
echo ""

API_GATEWAY_RUNNING=false
NOTIFICATION_SVC_RUNNING=false

if check_service "http://localhost:8080/health" "API Gateway"; then
    API_GATEWAY_RUNNING=true
fi

if check_service "http://localhost:3001/health" "Notification Service"; then
    NOTIFICATION_SVC_RUNNING=true
fi

echo ""

# If services are not running, provide instructions
if [ "$API_GATEWAY_RUNNING" = false ] || [ "$NOTIFICATION_SVC_RUNNING" = false ]; then
    echo -e "${YELLOW}⚠️  Some services are not running. Please start them first:${NC}"
    echo ""
    
    if [ "$API_GATEWAY_RUNNING" = false ]; then
        echo "API Gateway:"
        echo "  cd api-gateway && go run main.go"
        echo ""
    fi
    
    if [ "$NOTIFICATION_SVC_RUNNING" = false ]; then
        echo "Notification Service:"
        echo "  cd notification-svc && npm run dev"
        echo ""
    fi
    
    echo "PostgreSQL (if needed):"
    echo "  docker-compose up postgres"
    echo ""
    
    read -p "Continue with tests anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Tests cancelled."
        exit 1
    fi
fi

# Run the tests
echo "🚀 Running integration tests..."
echo ""

# Change to the notification-svc directory
cd "$(dirname "$0")/.."

# Run Jest tests
npm test

# Capture exit code
TEST_EXIT_CODE=$?

echo ""
if [ $TEST_EXIT_CODE -eq 0 ]; then
    echo -e "${GREEN}✅ All tests passed!${NC}"
else
    echo -e "${RED}❌ Some tests failed.${NC}"
fi

exit $TEST_EXIT_CODE
