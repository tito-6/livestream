@echo off
title Sports Oasis Frontend - Port 3000
color 0C

echo.
echo ========================================
echo    Starting Frontend
echo ========================================
echo.

cd /d "%~dp0\frontend"

echo Installing dependencies...
call npm install

echo.
echo Starting Frontend on http://localhost:3000
echo.

start http://localhost:3000

call npm run dev

pause

