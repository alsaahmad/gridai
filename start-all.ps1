# Start both Backend and Frontend for GridAI
Write-Host "Starting GridAI System..." -ForegroundColor Cyan

# Resolve paths
$rootDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendDir = Join-Path $rootDir "backend"
$pythonExe = Join-Path $backendDir "venv_win\Scripts\python.exe"

# 1. Start Backend in a new PowerShell window (Windows venv, no WSL needed)
Write-Host "Starting Backend on http://localhost:8005..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$backendDir'; & '$pythonExe' main.py"

# Small delay to let backend initialise
Start-Sleep -Seconds 2

# 2. Start Frontend in this window
Write-Host "Starting Frontend on http://localhost:8080..." -ForegroundColor Green
Set-Location $rootDir
npm run dev
