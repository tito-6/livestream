#!/bin/bash

# eSports Platform Startup Script
# This script helps you start the entire platform with Docker

echo "🎮 eSports Streaming Platform Startup"
echo "====================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check if Docker is running
check_docker() {
    echo -n "🐳 Checking Docker... "
    if docker info > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Running${NC}"
        return 0
    else
        echo -e "${RED}✗ Not running${NC}"
        echo -e "${YELLOW}Please start Docker Desktop and try again.${NC}"
        return 1
    fi
}

# Function to check if ports are available
check_ports() {
    echo -n "🔌 Checking ports... "
    local ports=(3000 3001 5432 8080)
    local occupied=()
    
    for port in "${ports[@]}"; do
        if netstat -tuln 2>/dev/null | grep -q ":$port "; then
            occupied+=($port)
        fi
    done
    
    if [ ${#occupied[@]} -eq 0 ]; then
        echo -e "${GREEN}✓ All ports available${NC}"
        return 0
    else
        echo -e "${RED}✗ Ports occupied: ${occupied[*]}${NC}"
        echo -e "${YELLOW}Please stop services using these ports and try again.${NC}"
        return 1
    fi
}

# Function to build and start services
start_services() {
    echo "🚀 Building and starting services..."
    echo ""
    
    # Build all services
    echo -e "${BLUE}Building Docker images...${NC}"
    if docker compose build; then
        echo -e "${GREEN}✓ Images built successfully${NC}"
    else
        echo -e "${RED}✗ Failed to build images${NC}"
        return 1
    fi
    
    echo ""
    
    # Start services
    echo -e "${BLUE}Starting services...${NC}"
    if docker compose up -d; then
        echo -e "${GREEN}✓ Services started successfully${NC}"
    else
        echo -e "${RED}✗ Failed to start services${NC}"
        return 1
    fi
}

# Function to wait for services to be ready
wait_for_services() {
    echo ""
    echo -e "${BLUE}⏳ Waiting for services to be ready...${NC}"
    
    # Wait for database
    echo -n "🗄️  Database... "
    local db_ready=false
    for i in {1..30}; do
        if docker compose exec -T db pg_isready -U esports_user -d esports_platform > /dev/null 2>&1; then
            echo -e "${GREEN}✓ Ready${NC}"
            db_ready=true
            break
        fi
        sleep 2
    done
    
    if [ "$db_ready" = false ]; then
        echo -e "${RED}✗ Timeout${NC}"
        return 1
    fi
    
    # Wait for API Gateway
    echo -n "🌐 API Gateway... "
    local api_ready=false
    for i in {1..30}; do
        if curl -s http://localhost:8080/health > /dev/null 2>&1; then
            echo -e "${GREEN}✓ Ready${NC}"
            api_ready=true
            break
        fi
        sleep 2
    done
    
    if [ "$api_ready" = false ]; then
        echo -e "${RED}✗ Timeout${NC}"
        return 1
    fi
    
    # Wait for Notification Service
    echo -n "📢 Notification Service... "
    local notif_ready=false
    for i in {1..30}; do
        if curl -s http://localhost:3001/health > /dev/null 2>&1; then
            echo -e "${GREEN}✓ Ready${NC}"
            notif_ready=true
            break
        fi
        sleep 2
    done
    
    if [ "$notif_ready" = false ]; then
        echo -e "${RED}✗ Timeout${NC}"
        return 1
    fi
    
    # Wait for Frontend
    echo -n "🎨 Frontend... "
    local frontend_ready=false
    for i in {1..60}; do
        if curl -s http://localhost:3000 > /dev/null 2>&1; then
            echo -e "${GREEN}✓ Ready${NC}"
            frontend_ready=true
            break
        fi
        sleep 2
    done
    
    if [ "$frontend_ready" = false ]; then
        echo -e "${YELLOW}⚠ Still starting...${NC}"
    fi
}

# Function to show service status
show_status() {
    echo ""
    echo "📊 Service Status:"
    echo "=================="
    docker compose ps
}

# Function to show access information
show_access_info() {
    echo ""
    echo "🌐 Platform Access:"
    echo "==================="
    echo -e "${GREEN}Frontend:${NC}        http://localhost:3000"
    echo -e "${GREEN}API Gateway:${NC}     http://localhost:8080"
    echo -e "${GREEN}Notification Svc:${NC} http://localhost:3001"
    echo -e "${GREEN}Database:${NC}        localhost:5432"
    echo ""
    echo "🔑 Admin API Key: SUPER_SECURE_KEY"
    echo "📚 Documentation: See DEPLOYMENT.md"
}

# Function to show useful commands
show_commands() {
    echo ""
    echo "🛠️  Useful Commands:"
    echo "===================="
    echo "View logs:           docker compose logs -f"
    echo "Stop services:       docker compose down"
    echo "Restart services:    docker compose restart"
    echo "View status:         docker compose ps"
    echo "Access database:     docker compose exec db psql -U esports_user -d esports_platform"
}

# Main execution
main() {
    # Check prerequisites
    if ! check_docker; then
        exit 1
    fi
    
    if ! check_ports; then
        exit 1
    fi
    
    echo ""
    
    # Start services
    if start_services; then
        wait_for_services
        show_status
        show_access_info
        show_commands
        
        echo ""
        echo -e "${GREEN}🎉 Platform started successfully!${NC}"
        echo -e "${BLUE}Open http://localhost:3000 in your browser to access the platform.${NC}"
    else
        echo ""
        echo -e "${RED}❌ Failed to start platform. Check the logs above for details.${NC}"
        echo -e "${YELLOW}Run 'docker compose logs' to see detailed error messages.${NC}"
        exit 1
    fi
}

# Handle script arguments
case "${1:-}" in
    "stop")
        echo "🛑 Stopping platform..."
        docker compose down
        echo -e "${GREEN}✓ Platform stopped${NC}"
        ;;
    "restart")
        echo "🔄 Restarting platform..."
        docker compose restart
        echo -e "${GREEN}✓ Platform restarted${NC}"
        ;;
    "status")
        show_status
        ;;
    "logs")
        docker compose logs -f
        ;;
    *)
        main
        ;;
esac
