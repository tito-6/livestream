@echo off
echo 🎮 eSports Streaming Platform Startup
echo =====================================

REM Check if Docker is running
echo 🐳 Checking Docker...
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ✗ Docker is not running. Please start Docker Desktop and try again.
    pause
    exit /b 1
)
echo ✓ Docker is running

echo.
echo 🚀 Building and starting services...

REM Build and start services
docker compose build
if %errorlevel% neq 0 (
    echo ✗ Failed to build images
    pause
    exit /b 1
)

docker compose up -d
if %errorlevel% neq 0 (
    echo ✗ Failed to start services
    pause
    exit /b 1
)

echo ✓ Services started successfully

echo.
echo 🌐 Platform Access:
echo ===================
echo Frontend:        http://localhost:3000
echo API Gateway:     http://localhost:8080
echo Notification Svc: http://localhost:3001
echo Database:        localhost:5432
echo.
echo 🔑 Admin API Key: SUPER_SECURE_KEY
echo 📚 Documentation: See DEPLOYMENT.md

echo.
echo 🛠️  Useful Commands:
echo ====================
echo View logs:           docker compose logs -f
echo Stop services:       docker compose down
echo Restart services:    docker compose restart
echo View status:         docker compose ps

echo.
echo 🎉 Platform started successfully!
echo Open http://localhost:3000 in your browser to access the platform.
echo.
pause
