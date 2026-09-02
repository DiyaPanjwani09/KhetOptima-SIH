#!/bin/bash
# KhetOptima - Farm Decision & Crop Portfolio Optimization Engine

set -e

echo "=========================================="
echo "KhetOptima Setup"
echo "=========================================="

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Python 3 is required but not installed."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is required but not installed."
    exit 1
fi

echo "Step 1: Setting up backend..."
cd backend

# Create virtual environment
if [ ! -d "venv" ]; then
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate || . venv/Scripts/activate

# Install dependencies
pip install --upgrade pip
pip install -r ../requirements.txt

# Create necessary directories
mkdir -p uploads

echo "Step 2: Setting up frontend..."
cd ../frontend

# Install dependencies
npm install

echo "Step 3: Setup complete!"
echo "=========================================="
echo ""
echo "To start the backend:"
echo "  cd backend && uvicorn main:app --reload --port 8000"
echo "  API docs: http://localhost:8000/docs"
echo "  KhetOptima: http://localhost:8000/api/v1/khet-optima/optimize"
echo ""
echo "To start the frontend:"
echo "  cd frontend && npm start  # http://localhost:3000"
echo ""
