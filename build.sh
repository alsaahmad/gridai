#!/bin/bash
# Railway Build Script
# Runs during the BUILD phase — installs Node deps, builds the React frontend,
# then lets Railway install Python deps via requirements.txt normally.

set -e

echo "=== GridAI Railway Build ==="

echo "→ Installing Node.js dependencies..."
npm ci

echo "→ Building Vite/React frontend..."
npm run build

echo "→ Frontend built to backend/static ✅"

echo "→ Installing Python dependencies..."
pip install -r backend/requirements.txt

echo "=== Build complete ==="
