# Start both Backend and Frontend for GridAI
Write-Host "🚀 Starting GridAI System..." -ForegroundColor Cyan

# 1. Start Backend in a new window via WSL
Write-Host "Starting Backend on http://localhost:8005 (via WSL)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "wsl -d Ubuntu-24.04 bash -c 'cd /mnt/c/Users/hamza/OneDrive/Desktop/abc/abcd/backend && ./venv_wsl/bin/python3 main.py'"

# 2. Start Frontend in this window
Write-Host "Starting Frontend on http://localhost:8080..." -ForegroundColor Green
npm run dev
