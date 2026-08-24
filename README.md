# 🌾 KhetOptima — Simulate. Optimize. Grow for Profit.

AI-powered farm decision & crop portfolio optimization platform for Indian farmers.

> **Core question:** Given land, soil, water, budget, market & risk tolerance, what combination of crops, how much land each, and what profit can you realistically expect?

## ✨ Features Implemented

- **Farm Digital Twin** — land, soil, water, budget, season, state modeled
- **Crop Portfolio Optimization** — LP (HiGHS via scipy) + greedy fallback; maximizes `Expected Profit − Risk Penalty` under land/water/budget/labour constraints
- **Explainable Plan** — soil %, water, profit/acre, risk, rotation benefit per crop
- **What-If Simulator** — rainfall, water, price, fertilizer, budget, yield sliders; single & batch (6 predefined) scenarios
- **Market & Glut Intelligence** — high-demand crops & oversupply warnings (tomato/potato/onion etc.)
- **16 Crops** — wheat, rice, mustard, chickpea, cotton, soybean, maize, tomato, potato, onion, sugarcane, groundnut, moong, barley, sunflower, chilli with MSP, yield, cost, water, risk, sustainability
- **Analytics** — pie (land %), bar (profit/revenue/cost), water %, confidence, sustainability

## 🏗️ Architecture

```
Farmer → Farm Profile → Digital Twin → ML Predictions → Optimization Engine → What-If Simulator → KhetOptima Plan
                              crops DB (yield/price/cost/water/risk) + soil suitability + MSP
```

## 🚀 Quick Start

### Backend (FastAPI)
```bash
cd backend
pip install -r ../requirements.txt
uvicorn main:app --reload --port 8000
# docs: http://localhost:8000/docs
# KhetOptima: http://localhost:8000/api/v1/khet-optima/optimize
```

### Frontend (React)
```bash
cd frontend
npm install
echo "REACT_APP_API_URL=http://localhost:8000" > .env
npm start  # http://localhost:3000
npm run build  # production
```

## 🔌 API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/v1/khet-optima/crops | List 16 crops with economics |
| GET | /api/v1/khet-optima/crops/{id} | Crop detail |
| POST | /api/v1/khet-optima/optimize | Optimize portfolio |
| POST | /api/v1/khet-optima/simulate | Single what-if |
| POST | /api/v1/khet-optima/simulate/all | All 6 scenarios |
| GET | /api/v1/khet-optima/market/intelligence | Glut & demand |
| GET | /api/v1/khet-optima/stats | Platform stats |
| GET | /health | Health |

### Example Optimize Request
```json
{
  "total_land_acres": 10,
  "soil_type": "loamy",
  "water_availability_mm": 500,
  "budget_inr": 145000,
  "state": "Punjab",
  "season": "Rabi",
  "risk_tolerance": "medium",
  "max_crops": 4
}
```
Response includes `allocations[]` (acres, %, yield, revenue, cost, profit, soil %, risk, explanation), `total_profit`, `water_usage_pct`, `risk_level`, `confidence_pct`.

## 🧠 Optimization Details

- **Objective:** maximize risk-adjusted profit per acre = `(yield*price - cost) − riskPenalty*risk_score − glutPenalty` × soilFactor
- **Constraints:** land ≤ available, water ≤ available, cost ≤ budget, labour ≤ available, per-crop cap 45-55% for diversification
- **Solver:** `scipy.optimize.linprog` (HiGHS) if available, else greedy by RAP sorted order

## 📊 Frontend Pages

- `/` — landing (hero, stats, features)
- `/planner` — farm form + pie/bar + explainable cards
- `/simulator` — dials + single/batch impact
- `/crops` — encyclopedia with filters
- `/market` — glut & demand intelligence

## 🛠️ Tech Stack
React 18, Tailwind, Recharts, Framer Motion, FastAPI, Pydantic, scipy/pulp, PostgreSQL (optional — optimizer is stateless)

## ⚠️ Disclaimer
Decision-support only; estimates based on models & available data, not guaranteed outcomes.

## 📜 License
MIT
