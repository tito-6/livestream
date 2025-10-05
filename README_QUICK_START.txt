╔══════════════════════════════════════════════════════════════╗
║     eSports Live Streaming Platform - Quick Start Guide     ║
╚══════════════════════════════════════════════════════════════╝

🚀 HOW TO START THE APPLICATION:
═════════════════════════════════════════════════════════════

1. Make sure Docker Desktop is running on your computer
   (Download from: https://www.docker.com/products/docker-desktop)

2. Double-click on: START_APP_HERE.bat

3. Wait for all services to build and start (first time may take 5-10 minutes)

4. Your browser will automatically open to: http://localhost:3000


📱 ACCESS YOUR APPLICATION:
═════════════════════════════════════════════════════════════

Frontend (Web Interface):    http://localhost:3000
API Gateway (Backend):       http://localhost:8080
Notification Service:        http://localhost:3001
Database (PostgreSQL):       localhost:5432
Cache (Redis):               localhost:6379


🛠️  USEFUL BATCH FILES:
═════════════════════════════════════════════════════════════

START_APP_HERE.bat    - Start all services
STOP_APP.bat          - Stop all services
VIEW_LOGS.bat         - View live logs from all services


📋 SERVICES INCLUDED:
═════════════════════════════════════════════════════════════

✓ Frontend - Next.js/React web interface
✓ API Gateway - Go REST API server
✓ Notification Service - WebSocket real-time service
✓ Streaming Processor - Video streaming service
✓ PostgreSQL Database - Data storage
✓ Redis Cache - Session & real-time data


🔧 MANUAL COMMANDS (if needed):
═════════════════════════════════════════════════════════════

Open Command Prompt in this folder and run:

Start services:      docker-compose up -d
Stop services:       docker-compose down
View logs:           docker-compose logs -f
Check status:        docker-compose ps
Rebuild:             docker-compose up -d --build


❓ TROUBLESHOOTING:
═════════════════════════════════════════════════════════════

Problem: Docker is not running
Solution: Start Docker Desktop and wait for it to fully load

Problem: Port already in use
Solution: Stop other services using ports 3000, 8080, 3001, 5432, 6379
         Or run: docker-compose down

Problem: Services won't start
Solution: Run: docker-compose down
         Then run: START_APP_HERE.bat again


📚 MORE INFORMATION:
═════════════════════════════════════════════════════════════

See: README.md for full documentation
See: DEPLOYMENT.md for deployment instructions


═════════════════════════════════════════════════════════════
Ready to start? Double-click START_APP_HERE.bat
═════════════════════════════════════════════════════════════

