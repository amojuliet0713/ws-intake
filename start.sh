#!/bin/bash
echo "Starting Williams & Seemen Intake System..."

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js not installed. Download from https://nodejs.org"
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies for the first time..."
    npm install
fi

# Open browser and start server
sleep 1 && open "http://localhost:3000" &   # Mac
sleep 1 && xdg-open "http://localhost:3000" &  # Linux (ignore error if not applicable)

node server.js
