@echo off
title Sports Oasis - Full Platform with Real-Time Data
color 0A

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║     The Sports Oasis - Full Platform Launch                 ║
echo ║     Real-Time Data from Kooora + LiveSoccer APIs             ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

cd /d "%~dp0"

echo [1/5] Installing Kooora API Service (Arabic Sports Data)...
cd kooora-service
python -m pip install -q -r requirements.txt
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install Kooora service
    pause
    exit /b 1
)
cd ..

echo [2/5] Installing LiveSoccer API Service (Live Scores)...
cd livesoccer-service
python -m pip install -q -r requirements.txt
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install LiveSoccer service
    pause
    exit /b 1
)
cd ..

echo [3/5] Installing Frontend dependencies...
cd frontend
call npm install --silent
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install frontend dependencies
    pause
    exit /b 1
)
cd ..

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                   Starting Services...                       ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo [4/5] Starting Kooora API (Port 5000)...
start "Kooora API - Arabic Sports" cmd /k "cd kooora-service && python app.py"
timeout /t 2 >nul

echo [5/5] Starting LiveSoccer API (Port 5001)...
start "LiveSoccer API - Live Scores" cmd /k "cd livesoccer-service && python app.py"
timeout /t 2 >nul

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║              All Services Started Successfully!              ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo 🌐 Platform Access:
echo   ┌──────────────────────────────────────────────────────────┐
echo   │ Frontend:        http://localhost:3000                   │
echo   │ Kooora API:      http://localhost:5000                   │
echo   │ LiveSoccer API:  http://localhost:5001                   │
echo   └──────────────────────────────────────────────────────────┘
echo.
echo 📊 Data Sources:
echo   • Kooora.com - Arabic sports (teams, leagues, fixtures)
echo   • LiveSoccer - Real-time live scores
echo   • Auto-refresh every 30 seconds
echo.
echo 🎯 Features:
echo   ✓ Real-time live match scores
echo   ✓ Arabic team and league names  
echo   ✓ Today's fixtures and results
echo   ✓ Tomorrow's schedule
echo   ✓ League tables and standings
echo   ✓ Bilingual support (Arabic/English)
echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                Starting Frontend...                          ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

timeout /t 3 >nul
start http://localhost:3000

echo Opening browser...
echo.
echo Press Ctrl+C to stop the frontend
echo (Backend services run in separate windows)
echo.

cd frontend
call npm run dev

