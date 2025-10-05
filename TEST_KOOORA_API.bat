@echo off
title Test Kooora API
color 0B

echo.
echo ============================================
echo    Testing Kooora API
echo ============================================
echo.

cd /d "%~dp0"

echo Installing Kooora library...
cd kooora-service
python -m pip install -r requirements.txt

echo.
echo ============================================
echo    Running API Tests
echo ============================================
echo.

python test_api.py

echo.
echo ============================================
echo    Test Complete!
echo ============================================
echo.
pause

