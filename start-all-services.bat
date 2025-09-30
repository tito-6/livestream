@echo off
echo 🎮 Starting eSports Platform Services
echo ====================================

REM Set Go path
set PATH=%PATH%;C:\Program Files\Go\bin

echo 🚀 Starting API Gateway (Go)...
start "API Gateway" cmd /k "cd /d %~dp0api-gateway && go run main.go"

timeout /t 3 /nobreak >nul

echo 📢 Starting Notification Service (Node.js)...
start "Notification Service" cmd /k "cd /d %~dp0notification-svc && npm run dev"

timeout /t 3 /nobreak >nul

echo 🎨 Starting Frontend (Next.js)...
start "Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo ✅ All services are starting in separate windows
echo.
echo 🌐 Platform Access:
echo ===================
echo Frontend:        http://localhost:3000
echo API Gateway:     http://localhost:8080
echo Notification Svc: http://localhost:3001
echo.
echo 🔑 Admin API Key: SUPER_SECURE_KEY
echo.
echo Press any key to exit...
pause >nul
