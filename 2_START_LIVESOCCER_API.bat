@echo off
title LiveSoccer API Service - Port 5001
color 0B

echo.
echo ========================================
echo    Starting LiveSoccer API Service
echo ========================================
echo.

cd /d "%~dp0\livesoccer-service"

echo Installing dependencies...
python -m pip install -r requirements.txt

echo.
echo Starting LiveSoccer API on http://localhost:5001
echo.

python app.py

pause

