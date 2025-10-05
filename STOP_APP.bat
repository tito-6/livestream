@echo off
title eSports Streaming Platform - Stop Services
color 0C

echo.
echo ============================================
echo    eSports Streaming Platform
echo    Stopping All Services
echo ============================================
echo.

REM Change to the script's directory
cd /d "%~dp0"

echo Stopping all Docker containers...
docker-compose down

if %errorlevel% equ 0 (
    echo.
    echo ============================================
    echo    All services stopped successfully!
    echo ============================================
    echo.
) else (
    echo.
    echo [ERROR] Failed to stop some services
    echo.
)

pause

