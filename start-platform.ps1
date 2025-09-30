# eSports Platform Startup Script (PowerShell)
# This script helps you start the entire platform with Docker

Write-Host "🎮 eSports Streaming Platform Startup" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

# Function to check if Docker is running
function Test-Docker {
    Write-Host "🐳 Checking Docker... " -NoNewline
    try {
        docker info | Out-Null
        Write-Host "✓ Running" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "✗ Not running" -ForegroundColor Red
        Write-Host "Please start Docker Desktop and try again." -ForegroundColor Yellow
        return $false
    }
}

# Function to check if ports are available
function Test-Ports {
    Write-Host "🔌 Checking ports... " -NoNewline
    $ports = @(3000, 3001, 5432, 8080)
    $occupied = @()
    
    foreach ($port in $ports) {
        $connection = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
        if ($connection) {
            $occupied += $port
        }
    }
    
    if ($occupied.Count -eq 0) {
        Write-Host "✓ All ports available" -ForegroundColor Green
        return $true
    }
    else {
        Write-Host "✗ Ports occupied: $($occupied -join ', ')" -ForegroundColor Red
        Write-Host "Please stop services using these ports and try again." -ForegroundColor Yellow
        return $false
    }
}

# Function to build and start services
function Start-Services {
    Write-Host "🚀 Building and starting services..." -ForegroundColor Blue
    Write-Host ""
    
    # Build all services
    Write-Host "Building Docker images..." -ForegroundColor Blue
    try {
        docker compose build
        Write-Host "✓ Images built successfully" -ForegroundColor Green
    }
    catch {
        Write-Host "✗ Failed to build images" -ForegroundColor Red
        return $false
    }
    
    Write-Host ""
    
    # Start services
    Write-Host "Starting services..." -ForegroundColor Blue
    try {
        docker compose up -d
        Write-Host "✓ Services started successfully" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "✗ Failed to start services" -ForegroundColor Red
        return $false
    }
}

# Function to wait for services to be ready
function Wait-ForServices {
    Write-Host ""
    Write-Host "⏳ Waiting for services to be ready..." -ForegroundColor Blue
    
    # Wait for database
    Write-Host "🗄️  Database... " -NoNewline
    $dbReady = $false
    for ($i = 1; $i -le 30; $i++) {
        try {
            docker compose exec -T db pg_isready -U esports_user -d esports_platform | Out-Null
            Write-Host "✓ Ready" -ForegroundColor Green
            $dbReady = $true
            break
        }
        catch {
            Start-Sleep -Seconds 2
        }
    }
    
    if (-not $dbReady) {
        Write-Host "✗ Timeout" -ForegroundColor Red
        return $false
    }
    
    # Wait for API Gateway
    Write-Host "🌐 API Gateway... " -NoNewline
    $apiReady = $false
    for ($i = 1; $i -le 30; $i++) {
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:8080/health" -TimeoutSec 5 -ErrorAction SilentlyContinue
            if ($response.StatusCode -eq 200) {
                Write-Host "✓ Ready" -ForegroundColor Green
                $apiReady = $true
                break
            }
        }
        catch {
            Start-Sleep -Seconds 2
        }
    }
    
    if (-not $apiReady) {
        Write-Host "✗ Timeout" -ForegroundColor Red
        return $false
    }
    
    # Wait for Notification Service
    Write-Host "📢 Notification Service... " -NoNewline
    $notifReady = $false
    for ($i = 1; $i -le 30; $i++) {
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:3001/health" -TimeoutSec 5 -ErrorAction SilentlyContinue
            if ($response.StatusCode -eq 200) {
                Write-Host "✓ Ready" -ForegroundColor Green
                $notifReady = $true
                break
            }
        }
        catch {
            Start-Sleep -Seconds 2
        }
    }
    
    if (-not $notifReady) {
        Write-Host "✗ Timeout" -ForegroundColor Red
        return $false
    }
    
    # Wait for Frontend
    Write-Host "🎨 Frontend... " -NoNewline
    $frontendReady = $false
    for ($i = 1; $i -le 60; $i++) {
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 5 -ErrorAction SilentlyContinue
            if ($response.StatusCode -eq 200) {
                Write-Host "✓ Ready" -ForegroundColor Green
                $frontendReady = $true
                break
            }
        }
        catch {
            Start-Sleep -Seconds 2
        }
    }
    
    if (-not $frontendReady) {
        Write-Host "⚠ Still starting..." -ForegroundColor Yellow
    }
    
    return $true
}

# Function to show service status
function Show-Status {
    Write-Host ""
    Write-Host "📊 Service Status:" -ForegroundColor Cyan
    Write-Host "==================" -ForegroundColor Cyan
    docker compose ps
}

# Function to show access information
function Show-AccessInfo {
    Write-Host ""
    Write-Host "🌐 Platform Access:" -ForegroundColor Cyan
    Write-Host "===================" -ForegroundColor Cyan
    Write-Host "Frontend:        http://localhost:3000" -ForegroundColor Green
    Write-Host "API Gateway:     http://localhost:8080" -ForegroundColor Green
    Write-Host "Notification Svc: http://localhost:3001" -ForegroundColor Green
    Write-Host "Database:        localhost:5432" -ForegroundColor Green
    Write-Host ""
    Write-Host "🔑 Admin API Key: SUPER_SECURE_KEY" -ForegroundColor Yellow
    Write-Host "📚 Documentation: See DEPLOYMENT.md" -ForegroundColor Yellow
}

# Function to show useful commands
function Show-Commands {
    Write-Host ""
    Write-Host "🛠️  Useful Commands:" -ForegroundColor Cyan
    Write-Host "====================" -ForegroundColor Cyan
    Write-Host "View logs:           docker compose logs -f"
    Write-Host "Stop services:       docker compose down"
    Write-Host "Restart services:    docker compose restart"
    Write-Host "View status:         docker compose ps"
    Write-Host "Access database:     docker compose exec db psql -U esports_user -d esports_platform"
}

# Main execution
function Main {
    # Check prerequisites
    if (-not (Test-Docker)) {
        exit 1
    }
    
    if (-not (Test-Ports)) {
        exit 1
    }
    
    Write-Host ""
    
    # Start services
    if (Start-Services) {
        Wait-ForServices
        Show-Status
        Show-AccessInfo
        Show-Commands
        
        Write-Host ""
        Write-Host "🎉 Platform started successfully!" -ForegroundColor Green
        Write-Host "Open http://localhost:3000 in your browser to access the platform." -ForegroundColor Blue
    }
    else {
        Write-Host ""
        Write-Host "❌ Failed to start platform. Check the logs above for details." -ForegroundColor Red
        Write-Host "Run 'docker compose logs' to see detailed error messages." -ForegroundColor Yellow
        exit 1
    }
}

# Handle script arguments
param(
    [string]$Action = "start"
)

switch ($Action.ToLower()) {
    "stop" {
        Write-Host "🛑 Stopping platform..." -ForegroundColor Yellow
        docker compose down
        Write-Host "✓ Platform stopped" -ForegroundColor Green
    }
    "restart" {
        Write-Host "🔄 Restarting platform..." -ForegroundColor Yellow
        docker compose restart
        Write-Host "✓ Platform restarted" -ForegroundColor Green
    }
    "status" {
        Show-Status
    }
    "logs" {
        docker compose logs -f
    }
    default {
        Main
    }
}
