# Start ASL Learning Platform (SIGNVISION)
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "  Starting ASL Learning Platform (SIGNVISION)" -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan

# 1. Start FastAPI Backend in background or separate window
Write-Host "`n[1/2] Starting Python FastAPI Backend on port 8000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; python main.py"

# 2. Start Next.js Frontend in separate window
Write-Host "[2/2] Starting Next.js Frontend on port 3000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; npm run dev"

# Wait a moment for servers to spin up
Start-Sleep -Seconds 3

# Open default browser
Write-Host "`nOpening application at http://localhost:3000..." -ForegroundColor Green
Start-Process "http://localhost:3000"

Write-Host "`n===================================================" -ForegroundColor Cyan
Write-Host "  ASL Platform is running!" -ForegroundColor Green
Write-Host "  Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "  Backend:  http://localhost:8000/docs" -ForegroundColor White
Write-Host "===================================================" -ForegroundColor Cyan
