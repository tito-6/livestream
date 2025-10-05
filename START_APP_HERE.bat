@echo off
title eSports Streaming Platform - Quick Start
color 0A

echo.
echo ============================================
echo    eSports Streaming Platform
echo    Quick Start Script
echo ============================================
echo.

REM Change to the script's directory
cd /d "%~dp0"

echo [1/4] Checking Docker...
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Docker is not running!
    echo Please start Docker Desktop first, then run this script again.
    echo.
    pause
    exit /b 1
)
echo [OK] Docker is running

echo.
echo [2/4] Installing root dependencies...
call npm install
if %errorlevel% neq 0 (
    echo [WARNING] Failed to install root dependencies
)

echo.
echo [3/4] Building Docker images...
docker-compose build
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Failed to build Docker images
    pause
    exit /b 1
)

echo.
echo [4/4] Starting all services...
docker-compose up -d
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Failed to start services
    pause
    exit /b 1
)

echo.
echo ============================================
echo    SUCCESS! Platform is now running
echo ============================================
echo.
echo Access your application at:
echo.
echo   Frontend:           http://localhost:3000
echo   API Gateway:        http://localhost:8080
echo   Notification Svc:   http://localhost:3001
echo   PostgreSQL:         localhost:5432
echo   Redis:              localhost:6379
echo.
echo ============================================
echo    Useful Commands
echo ============================================
echo.
echo   View logs:          docker-compose logs -f
echo   Stop services:      docker-compose down
echo   Restart services:   docker-compose restart
echo   Check status:       docker-compose ps
echo.
echo Opening frontend in your browser...
timeout /t 3 >nul
start http://localhost:3000
echo.
echo Press any key to view live logs (Ctrl+C to exit logs)...
pause >nul
docker-compose logs -f

