@echo off
title Sports Oasis - Full Platform with Real Data
color 0A

echo.
echo ============================================
echo    The Sports Oasis - Full Platform
echo    With Real Sports Data from Kooora API
echo ============================================
echo.

REM Change to the script's directory
cd /d "%~dp0"

echo [1/4] Installing Kooora API Service...
cd kooora-service
python -m pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install Kooora service dependencies
    echo Make sure Python 3 is installed
    pause
    exit /b 1
)
cd ..

echo.
echo [2/4] Installing Frontend dependencies...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install frontend dependencies
    pause
    exit /b 1
)
cd ..

echo.
echo [3/4] Starting Kooora API Service (Port 5000)...
start "Kooora API Service" cmd /k "cd kooora-service && python app.py"
timeout /t 3 >nul

echo.
echo [4/4] Starting Frontend (Port 3000)...
cd frontend

echo.
echo ============================================
echo    Platform is starting...
echo ============================================
echo.
echo Access your application at:
echo.
echo   Frontend:        http://localhost:3000
echo   Kooora API:      http://localhost:5000
echo.
echo ============================================
echo.
echo Real Sports Data:
echo   - Today's matches from kooora.com
echo   - League tables and standings
echo   - Top scorers
echo   - Arabic sports content
echo.
echo ============================================
echo.
echo Opening frontend in browser...
timeout /t 3 >nul
start http://localhost:3000

echo.
echo Press Ctrl+C to stop the frontend
echo (Kooora API service runs in separate window)
echo.

call npm run dev

