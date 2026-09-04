# KhetOptima

AI-powered farm decision and crop portfolio optimization platform for Indian farmers.

## Architecture

```
React Frontend
       |
Node.js / Express API
       |
 +-------+-------+
 |       |       |
Python  Weather  Marketplace
ML      Service  Service/Data
Service
```

## Features

- **Farm Planner** - AI-optimized crop portfolio based on land, soil, water, budget, and risk
- **What-If Simulator** - Test drought, price crash, budget cut, and other scenarios
- **Crop Encyclopedia** - 16 Indian crops with MSP, yield, cost, risk, sustainability
- **Market Intelligence** - Glut alerts, demand trends, mandi prices
- **Marketplace** - Buy seeds, equipment, fertilizers, and farming services
- **Weather** - Current conditions, 5-day forecast, farm advisory
- **Advisory** - Irrigation, crop management, soil, and market tips

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Tailwind CSS, Recharts |
| Backend | Node.js, Express |
| ML Service | Python, FastAPI, SciPy |

## Quick Start

### 1. Python ML Service

```bash
cd ml-service
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 2. Node.js Backend

```bash
cd backend
npm install
npm run dev
```

### 3. React Frontend

```bash
cd frontend
npm install
npm start
```

The app will be available at `http://localhost:3000`.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/health | Backend health check |
| GET | /api/crops | List all crops |
| GET | /api/crops/:id | Crop detail |
| POST | /api/optimization/optimize | Optimize farm plan |
| POST | /api/simulation | Run what-if scenario |
| POST | /api/simulation/all | Run all 6 scenarios |
| GET | /api/market/intelligence | Market data |
| GET | /api/weather | Weather forecast |
| GET | /api/marketplace/products | Browse products |
| GET | /api/marketplace/services | Browse services |
| POST | /api/marketplace/listings | Create listing |
| GET | /api/advisory | Farming tips |

## Environment Variables

### Backend (.env)

```
PORT=3001
ML_SERVICE_URL=http://localhost:8000
WEATHER_API_KEY=
CORS_ORIGIN=http://localhost:3000
NODE_ENV=development
```

### ML Service (.env)

```
PORT=8000
ENVIRONMENT=development
```

### Frontend (.env)

```
REACT_APP_API_URL=http://localhost:3001
```

## Deployment

The project deploys as three services:

1. **Python ML Service** - FastAPI optimizer
2. **Node.js Backend** - Express API layer
3. **React Frontend** - Static site

Use the provided `render.yaml` for Render Blueprint deployment.

## License

MIT
