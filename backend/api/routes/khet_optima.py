from fastapi import APIRouter
from typing import List
from khet_optima.schemas import CropAllocationRequest, OptimizationResult, WhatIfResult, FarmProfile
from khet_optima.crop_data import get_crop_list, CROP_DATABASE
from khet_optima.optimizer import optimize_farm
from khet_optima.simulator import simulate_scenario, run_all_scenarios, PREDEFINED_SCENARIOS
from pydantic import BaseModel

router = APIRouter(prefix="/khet-optima", tags=["khet-optima"])

class SimulateRequest(BaseModel):
    farm: FarmProfile
    base_result: OptimizationResult | None = None
    rainfall_change_pct: float = 0
    price_change_pct: float = 0
    fertilizer_price_change_pct: float = 0
    water_change_pct: float = 0
    budget_change_pct: float = 0
    yield_change_pct: float = 0
    scenario_name: str = "Custom What-If"

@router.get("/crops")
def list_crops():
    crops = get_crop_list()
    # enrich with profit per acre
    for c in crops:
        price = c["price_per_quintal"] or 1500
        c["profit_per_acre"] = round(c["yield_quintal_per_acre"] * price - c["cost_per_acre"], 2)
        c["revenue_per_acre"] = round(c["yield_quintal_per_acre"] * price, 2)
    return {"crops": crops, "count": len(crops)}

@router.get("/crops/{crop_id}")
def get_crop_detail(crop_id: str):
    c = CROP_DATABASE.get(crop_id.lower())
    if not c:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Crop not found")
    price = c["price_per_quintal"] or 1500
    return {"id": crop_id.lower(), **c, "profit_per_acre": round(c["yield_quintal_per_acre"]*price - c["cost_per_acre"],2), "revenue_per_acre": round(c["yield_quintal_per_acre"]*price,2)}

@router.post("/optimize", response_model=OptimizationResult)
def optimize(request: CropAllocationRequest):
    result = optimize_farm(request)
    return result

@router.post("/simulate", response_model=WhatIfResult)
def simulate(req: SimulateRequest):
    # Build CropAllocationRequest from farm
    base_req = CropAllocationRequest(**req.farm.model_dump())
    if req.base_result:
        base = req.base_result
    else:
        base = optimize_farm(base_req)
    scenario = {
        "rainfall_change_pct": req.rainfall_change_pct,
        "price_change_pct": req.price_change_pct,
        "fertilizer_price_change_pct": req.fertilizer_price_change_pct,
        "water_change_pct": req.water_change_pct,
        "budget_change_pct": req.budget_change_pct,
        "yield_change_pct": req.yield_change_pct,
    }
    # remove zeros
    scenario = {k: v for k, v in scenario.items() if v != 0}
    result = simulate_scenario(base_req, base, scenario, req.scenario_name)
    return result

@router.post("/simulate/all")
def simulate_all(farm: FarmProfile):
    base_req = CropAllocationRequest(**farm.model_dump())
    base = optimize_farm(base_req)
    results = run_all_scenarios(base_req, base)
    return {"base": base, "scenarios": results}

@router.get("/market/intelligence")
def market_intelligence():
    # Simple glut detection + trends from crop DB
    alerts = []
    trending = []
    for cid, c in CROP_DATABASE.items():
        if c["glut_risk"] in ["High", "Very High"]:
            alerts.append({"crop": c["name"], "crop_id": cid, "risk": c["glut_risk"], "message": f"{c['name']} oversupply risk in current season — price may fall 10-18%."})
        if c["demand_trend"] in ["High", "Very High"]:
            trending.append({"crop": c["name"], "crop_id": cid, "trend": c["demand_trend"]})
    return {"glut_alerts": alerts, "high_demand": trending, "season_note": "Rabi MSP crops (wheat, mustard, chickpea) remain stable; vegetables remain volatile."}

@router.get("/stats")
def khet_stats():
    total_crops = len(CROP_DATABASE)
    avg_profit = sum((c["yield_quintal_per_acre"]*(c["price_per_quintal"] or 1500) - c["cost_per_acre"]) for c in CROP_DATABASE.values()) / total_crops
    return {
        "total_crops": total_crops,
        "avg_profit_per_acre": round(avg_profit,2),
        "seasons": ["Rabi", "Kharif", "Zaid", "Annual"],
        "optimization_methods": ["Linear Programming (HiGHS)", "Greedy Heuristic", "Risk-Adjusted Profit"],
        "features": ["Portfolio Optimization", "Digital Twin", "What-If Simulator", "Glut Risk Detection", "Market Intelligence"],
    }
