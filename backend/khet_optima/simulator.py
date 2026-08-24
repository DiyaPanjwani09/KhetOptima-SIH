"""
What-If Simulator - recalculates optimization under stressed scenarios.
"""
from copy import deepcopy
from typing import Dict
from .schemas import FarmProfile, CropAllocationRequest, OptimizationResult, WhatIfResult
from .optimizer import optimize_farm
from .crop_data import CROP_DATABASE

def _apply_stress(base_req: CropAllocationRequest, scenario: dict) -> CropAllocationRequest:
    req = deepcopy(base_req)
    # Water
    if scenario.get("water_change_pct"):
        pct = scenario["water_change_pct"]
        req.water_availability_mm = max(100, req.water_availability_mm * (1 + pct/100))
    if scenario.get("rainfall_change_pct"):
        pct = scenario["rainfall_change_pct"]
        # rainfall affects water availability by 0.6 factor
        req.water_availability_mm = max(100, req.water_availability_mm * (1 + pct/100 * 0.6))
    if scenario.get("budget_change_pct"):
        pct = scenario["budget_change_pct"]
        req.budget_inr = max(1000, req.budget_inr * (1 + pct/100))
    return req

def _adjust_crop_economics(req: CropAllocationRequest, scenario: dict) -> Dict[str, dict]:
    """Return overrides for price/yield/cost without mutating global DB."""
    overrides = {}
    for cid, crop in CROP_DATABASE.items():
        ov = {}
        if scenario.get("price_change_pct"):
            pct = scenario["price_change_pct"]
            # vegetables more volatile
            mult = 1.4 if crop["category"] == "Vegetable" else 1.0
            ov["price_per_quintal"] = (crop["price_per_quintal"] or 1500) * (1 + pct/100 * mult)
        if scenario.get("yield_change_pct"):
            pct = scenario["yield_change_pct"]
            ov["yield_quintal_per_acre"] = crop["yield_quintal_per_acre"] * (1 + pct/100)
        if scenario.get("fertilizer_price_change_pct"):
            pct = scenario["fertilizer_price_change_pct"]
            # cost impact 30% of input cost
            ov["cost_per_acre"] = crop["cost_per_acre"] * (1 + pct/100 * 0.35)
        if scenario.get("rainfall_change_pct"):
            pct = scenario["rainfall_change_pct"]
            # yield impact if negative rainfall: up to -20% for water-intensive crops
            if pct < 0:
                water_factor = {"Very High": 0.6, "High": 0.4, "Medium": 0.25, "Low": 0.1, "Very Low": 0.05}.get(crop["water_level"], 0.25)
                ov["yield_quintal_per_acre"] = ov.get("yield_quintal_per_acre", crop["yield_quintal_per_acre"]) * (1 + pct/100 * water_factor)
        if ov:
            overrides[cid] = ov
    return overrides

def simulate_scenario(base_req: CropAllocationRequest, base_result: OptimizationResult, scenario: dict, name: str = "What-If") -> WhatIfResult:
    # Temporarily patch CROP_DATABASE
    overrides = _adjust_crop_economics(base_req, scenario)
    # Save originals
    saved = {}
    for cid, ov in overrides.items():
        saved[cid] = {k: CROP_DATABASE[cid][k] for k in ov}
        CROP_DATABASE[cid].update(ov)
    try:
        stressed_req = _apply_stress(base_req, scenario)
        new_result = optimize_farm(stressed_req)
        # Impact
        profit_delta = new_result.total_profit - base_result.total_profit
        profit_delta_pct = (profit_delta / max(abs(base_result.total_profit), 1) * 100)
        impact = {
            "profit_change": round(profit_delta, 2),
            "profit_change_pct": round(profit_delta_pct, 2),
            "revenue_change": round(new_result.total_revenue - base_result.total_revenue, 2),
            "cost_change": round(new_result.total_cost - base_result.total_cost, 2),
            "water_usage_change_pct": round(new_result.water_usage_pct - base_result.water_usage_pct, 2),
            "risk_change": round(new_result.avg_risk_score - base_result.avg_risk_score, 3),
        }
        # describe scenario
        parts = []
        if scenario.get("rainfall_change_pct"): parts.append(f"Rainfall {scenario['rainfall_change_pct']:+.0f}%")
        if scenario.get("water_change_pct"): parts.append(f"Water {scenario['water_change_pct']:+.0f}%")
        if scenario.get("price_change_pct"): parts.append(f"Prices {scenario['price_change_pct']:+.0f}%")
        if scenario.get("fertilizer_price_change_pct"): parts.append(f"Fertilizer {scenario['fertilizer_price_change_pct']:+.0f}%")
        if scenario.get("budget_change_pct"): parts.append(f"Budget {scenario['budget_change_pct']:+.0f}%")
        if scenario.get("yield_change_pct"): parts.append(f"Yield {scenario['yield_change_pct']:+.0f}%")
        desc = ", ".join(parts) if parts else "Baseline check"
        return WhatIfResult(
            scenario_name=name,
            delta_description=desc,
            result=new_result,
            impact_summary=impact
        )
    finally:
        for cid, vals in saved.items():
            CROP_DATABASE[cid].update(vals)

PREDEFINED_SCENARIOS = {
    "drought": {"name": "Drought (-30% rainfall)", "params": {"rainfall_change_pct": -30}},
    "water_scarcity": {"name": "Water Scarcity (-40% water)", "params": {"water_change_pct": -40}},
    "price_crash": {"name": "Market Crash (-15% prices)", "params": {"price_change_pct": -15}},
    "fertilizer_hike": {"name": "Fertilizer Hike (+20%)", "params": {"fertilizer_price_change_pct": 20}},
    "budget_cut": {"name": "Budget Cut (-25%)", "params": {"budget_change_pct": -25}},
    "bumper_yield": {"name": "Bumper Yield (+15%)", "params": {"yield_change_pct": 15}},
}

def run_all_scenarios(base_req: CropAllocationRequest, base_result: OptimizationResult):
    results = []
    for key, cfg in PREDEFINED_SCENARIOS.items():
        r = simulate_scenario(base_req, base_result, cfg["params"], cfg["name"])
        results.append(r)
    return results
