#!/bin/bash
# KhetOptima Setup

set -e

echo "=========================================="
echo "KhetOptima Setup"
echo "=========================================="

if ! command -v python3 &> /dev/null; then
    echo "Python 3 is required but not installed."
    exit 1
fi

if ! command -v node &> /dev/null; then
    echo "Node.js is required but not installed."
    exit 1
fi

echo "Step 1: Setting up Python ML Service..."
cd ml-service

if [ ! -d "venv" ]; then
    python3 -m venv venv
fi

source venv/bin/activate || . venv/Scripts/activate
pip install --upgrade pip
pip install -r requirements.txt

echo "Step 2: Setting up Node.js Backend..."
cd ../backend
npm install

echo "Step 3: Setting up Frontend..."
cd ../frontend
npm install

echo "Step 4: Setup complete!"
echo "=========================================="
echo ""
echo "To start the ML Service (Terminal 1):"
echo "  cd ml-service && source venv/bin/activate && uvicorn main:app --reload --port 8000"
echo ""
echo "To start the Backend (Terminal 2):"
echo "  cd backend && npm run dev"
echo ""
echo "To start the Frontend (Terminal 3):"
echo "  cd frontend && npm start"
echo ""
