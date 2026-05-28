@echo off
echo Starting Williams ^& Seemen Intake System...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed.
    echo Please download it from https://nodejs.org and install it first.
    pause
    exit /b 1
)

REM Install dependencies if needed
if not exist "node_modules" (
    echo Installing dependencies for the first time...
    npm install
    echo.
)

REM Start the server
echo Opening intake system at http://localhost:3000
start "" "http://localhost:3000"
node server.js
pause
