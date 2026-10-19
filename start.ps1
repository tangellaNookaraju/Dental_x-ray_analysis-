# DentAI Quick Start Script

Write-Host "🦷 Starting DentAI Application..." -ForegroundColor Cyan
Write-Host ""

# Check if MongoDB is running
Write-Host "Checking MongoDB..." -ForegroundColor Yellow
$mongoProcess = Get-Process mongod -ErrorAction SilentlyContinue
if ($mongoProcess) {
    Write-Host "✅ MongoDB is running" -ForegroundColor Green
} else {
    Write-Host "⚠️  MongoDB is not running. Please start MongoDB first." -ForegroundColor Red
    Write-Host "   Run: net start MongoDB" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "Starting Backend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\server'; npm run dev"

Write-Host "Waiting for backend to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

Write-Host ""
Write-Host "Starting Frontend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\client'; npm start"

Write-Host ""
Write-Host "✅ DentAI is starting!" -ForegroundColor Green
Write-Host ""
Write-Host "📍 Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "📍 Backend:  http://localhost:5000" -ForegroundColor Cyan
Write-Host "📍 API Docs: http://localhost:5000/api/health" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C in each window to stop the servers" -ForegroundColor Yellow
