@echo off
title eSports Streaming Platform - View Logs
color 0B

REM Change to the script's directory
cd /d "%~dp0"

echo.
echo ============================================
echo    eSports Streaming Platform
echo    Live Service Logs
echo ============================================
echo.
echo Press Ctrl+C to stop viewing logs
echo.

docker-compose logs -f

