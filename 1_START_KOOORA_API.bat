@echo off
title Kooora API Service - Port 5000
color 0A

echo.
echo ========================================
echo    Starting Kooora API Service
echo ========================================
echo.

cd /d "%~dp0\kooora-service"

echo Installing dependencies...
python -m pip install -r requirements.txt

echo.
echo Starting Kooora API on http://localhost:5000
echo.

python app.py

pause

