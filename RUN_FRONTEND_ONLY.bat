@echo off
title The Oasis of eSports - Frontend Only
color 0A

echo.
echo ============================================
echo    The Oasis of eSports Frontend
echo    Cyber-Oasis Design System
echo ============================================
echo.

REM Change to the script's directory
cd /d "%~dp0"

echo [1/2] Installing frontend dependencies...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo [2/2] Starting frontend development server...
echo.
echo ============================================
echo    Frontend is starting...
echo ============================================
echo.
echo Access your application at:
echo.
echo   Frontend:  http://localhost:3000
echo.
echo ============================================
echo.
echo The browser will open automatically...
echo Press Ctrl+C to stop the server
echo.

timeout /t 2 >nul
start http://localhost:3000

call npm run dev

