"""
KhetOptima Optimization Engine
Objective: Maximize risk-adjusted profit subject to land, water, budget, labour, and sustainability constraints.

Uses scipy.linprog when available, else greedy heuristic sorted by risk-adjusted profit per acre.
"""
import math
from typing import List, Tuple, Dict
from .crop_data import CROP_DATABASE, compute_soil_suitability
from .schemas import FarmProfile, CropAllocationRequest, OptimizationResult, CropAllocation

# Risk tolerance penalty factor - scaled to INR profit per acre
RISK_PENALTY = {"low": 35000, "medium": 20000, "high": 8000}
SEASON_FILTER = {
    "rabi": ["wheat", "mustard", "chickpea", "barley", "potato", "onion"],
    "kharif": ["rice", "cotton", "soybean", "maize", "groundnut", "chilli"],
    "zaid": ["tomato", "moong", "sunflower", "maize", "chilli"],
    "annual": list(CROP_DATABASE.keys()),
}
GLUT_PENALTY = {"Low": 0, "Medium": 1500, "High": 6000, "Very High": 11000}

def _profit_per_acre(crop: dict) -> float:
    return crop["yield_quintal_per_acre"] * (crop["price_per_quintal"] or 1500) - crop["cost_per_acre"]

def _risk_adjusted_profit_per_acre(crop: dict, risk_tolerance: str, soil_suit: int) -> float:
    base = _profit_per_acre(crop)
    soil_factor = 0.7 + 0.3 * ((soil_suit - 50) / 50) if soil_suit >= 50 else 0.7
    penalty = RISK_PENALTY.get(risk_tolerance, 20000)
    risk_adj = base - penalty * crop["risk_score"] - GLUT_PENALTY.get(crop["glut_risk"], 0)
    return risk_adj * soil_factor

def _filter_crops(req: CropAllocationRequest) -> List[Tuple[str, dict]]:
    season_key = (req.season or "Rabi").lower()
    if req.preferred_crops:
        candidates = [(c, CROP_DATABASE[c]) for c in req.preferred_crops if c in CROP_DATABASE]
    elif season_key in SEASON_FILTER and season_key != "annual":
        seasonal = SEASON_FILTER[season_key]
        candidates = [(c, CROP_DATABASE[c]) for c in seasonal]
        # Only add complementary low-water pulses if rabi and budget/water allows diversification
        # Strict season filtering: do NOT add zaid crops to rabi
        if season_key == "rabi":
            # allow chickpea already in list; no extra
            pass
        elif season_key == "zaid":
            # zaid already includes moong
            pass
    else:
        candidates = list(CROP_DATABASE.items())
    return candidates

def _explain(crop_id: str, crop: dict, soil_suit: int, acres: float, profit_per_acre: float) -> str:
    reasons = []
    if soil_suit >= 85:
        reasons.append(f"Excellent soil match ({soil_suit}%)")
    elif soil_suit >= 75:
        reasons.append(f"Good soil suitability ({soil_suit}%)")
    else:
        reasons.append(f"Moderate soil fit ({soil_suit}%)")
    reasons.append(f"{crop['water_level']} water need")
    reasons.append(f"{crop['risk_label']} risk")
    if crop["rotation_benefit"] in ["High", "Very High"]:
        reasons.append("Improves soil health")
    reasons.append(f"₹{profit_per_acre:,.0f}/acre profit")
    return " • ".join(reasons)

def optimize_farm(req: CropAllocationRequest) -> OptimizationResult:
    candidates = _filter_crops(req)
    if not candidates:
        candidates = list(CROP_DATABASE.items())

    # Score and sort by risk-adjusted profit
    scored = []
    for cid, c in candidates:
        soil_suit = compute_soil_suitability(cid, req.soil_type.value)
        # previous crop rotation penalty
        rotation_penalty = 0
        if req.previous_crop and req.previous_crop.lower() == cid.lower():
            rotation_penalty = 4000
        rap = _risk_adjusted_profit_per_acre(c, req.risk_tolerance.value, soil_suit) - rotation_penalty
        profit = _profit_per_acre(c)
        scored.append((rap, profit, cid, c, soil_suit))
    scored.sort(key=lambda x: x[0], reverse=True)

    # Limit to max_crops
    max_c = req.max_crops or 5
    scored = scored[: max( max_c * 2, 6)]  # consider a bit larger set before allocation
    # Re-sort top max_c by rap but allocation will use greedy with constraints
    scored.sort(key=lambda x: x[0], reverse=True)
    # Try to use LINPROG if available
    allocations = _allocate_linprog(scored, req, max_c)
    if allocations is None:
        allocations = _allocate_greedy(scored, req, max_c)

    # If nothing allocated (budget too low), pick cheapest single crop partially
    if not allocations:
        cheapest = min(scored, key=lambda x: x[3]["cost_per_acre"])
        rap, profit, cid, c, soil_suit = cheapest
        acres = min(req.total_land_acres, req.budget_inr / c["cost_per_acre"], req.water_availability_mm / max(c["water_requirement_mm"], 1))
        acres = max(0.5, round(acres, 2))
        if acres > 0:
            allocations = [(cid, c, soil_suit, acres)]

    # Build CropAllocation objects
    result_allocs: List[CropAllocation] = []
    total_cost = 0
    total_rev = 0
    total_water = 0
    weighted_risk = 0
    weighted_sustain = 0
    warnings: List[str] = []
    glut_alerts: List[str] = []

    for cid, c, soil_suit, acres in allocations:
        acres = round(acres, 2)
        if acres < 0.1:
            continue
        yld = round(c["yield_quintal_per_acre"] * acres, 2)
        price = c["price_per_quintal"] or 1500
        rev = round(yld * price, 2)
        cost = round(c["cost_per_acre"] * acres, 2)
        profit = round(rev - cost, 2)
        pct = round(acres / req.total_land_acres * 100, 1)
        profit_pa = _profit_per_acre(c)
        result_allocs.append(CropAllocation(
            crop_id=cid,
            crop_name=c["name"],
            acres=acres,
            percentage=pct,
            expected_yield_quintal=yld,
            expected_revenue=rev,
            expected_cost=cost,
            expected_profit=profit,
            soil_suitability=soil_suit,
            water_requirement_mm=c["water_requirement_mm"],
            risk_label=c["risk_label"],
            risk_score=c["risk_score"],
            sustainability_score=c["sustainability_score"],
            season=c["season"],
            explanation=_explain(cid, c, soil_suit, acres, profit_pa)
        ))
        total_cost += cost
        total_rev += rev
        total_water += c["water_requirement_mm"] * acres
        weighted_risk += c["risk_score"] * acres
        weighted_sustain += c["sustainability_score"] * acres
        if c["glut_risk"] in ["High", "Very High"]:
            glut_alerts.append(f"⚠️ {c['name']} has {c['glut_risk']} glut risk — regional oversupply may depress prices. Consider reducing allocation.")

    total_land_used = round(sum(a.acres for a in result_allocs), 2)
    if total_land_used < req.total_land_acres - 0.5:
        warnings.append(f"{round(req.total_land_acres - total_land_used,2)} acres left fallow due to budget/water constraints.")
    if total_cost > req.budget_inr:
        warnings.append("Budget exceeded — allocation trimmed. Consider increasing budget or choosing lower-cost crops.")
    water_pct = round((total_water / max(req.water_availability_mm * req.total_land_acres, 1) * 100) if req.water_availability_mm < 5000 else (total_water / max(req.water_availability_mm,1)*100), 1)
    # Normalize water usage: if water_availability given as total mm (not per acre), handle
    # Heuristic: if water_availability_mm > 5000 treat as total water budget
    if req.water_availability_mm > 5000:
        water_pct = round(total_water / req.water_availability_mm * 100, 1)
        water_available = req.water_availability_mm
    else:
        # per-acre value * acres
        water_available = req.water_availability_mm * req.total_land_acres
        water_pct = round(total_water / max(water_available,1) * 100, 1)

    avg_risk = round(weighted_risk / max(total_land_used,1), 3)
    if avg_risk < 0.32:
        risk_level = "Low"
    elif avg_risk < 0.45:
        risk_level = "Medium"
    elif avg_risk < 0.58:
        risk_level = "High"
    else:
        risk_level = "Very High"

    total_profit = round(total_rev - total_cost, 2)
    # risk-adjusted profit
    rap_total = round(total_profit * (1 - avg_risk * 0.5), 2)
    sustain = round(weighted_sustain / max(total_land_used,1), 1) if total_land_used else 0
    # confidence based on soil match avg and diversification
    avg_soil = sum(a.soil_suitability for a in result_allocs) / max(len(result_allocs),1)
    diversification_bonus = min(10, len(result_allocs)*2)
    confidence = round(min(94, avg_soil*0.85 + diversification_bonus), 1)

    return OptimizationResult(
        allocations=result_allocs,
        total_land_used=total_land_used,
        total_land_available=req.total_land_acres,
        total_cost=round(total_cost,2),
        total_revenue=round(total_rev,2),
        total_profit=total_profit,
        risk_adjusted_profit=rap_total,
        water_used_mm=round(total_water,1),
        water_available_mm=round(water_available,1),
        water_usage_pct=water_pct,
        avg_risk_score=avg_risk,
        risk_level=risk_level,
        confidence_pct=confidence,
        sustainability_score=sustain,
        warnings=warnings,
        glut_alerts=glut_alerts,
        season=req.season or "Rabi"
    )

def _allocate_greedy(scored: List[Tuple], req: CropAllocationRequest, max_c: int) -> List[Tuple[str, dict, int, float]] | None:
    """Greedy knap-like: fill land sorted by RAP respecting water/budget/labour."""
    remaining_land = req.total_land_acres
    remaining_budget = req.budget_inr
    # Interpret water_availability: if <5000 treat as mm per acre equivalent, else total
    if req.water_availability_mm > 5000:
        remaining_water = req.water_availability_mm
    else:
        remaining_water = req.water_availability_mm * req.total_land_acres
    remaining_labour = req.labour_availability_days if req.labour_availability_days else float('inf')

    allocations: List[Tuple[str, dict, int, float]] = []
    min_acres = 0.5

    for rap, profit, cid, c, soil_suit in scored:
        if len(allocations) >= max_c:
            break
        if remaining_land < min_acres:
            break
        # max acres allowed by constraints
        max_by_land = remaining_land
        max_by_budget = remaining_budget / max(c["cost_per_acre"],1)
        max_by_water = remaining_water / max(c["water_requirement_mm"],1)
        max_by_labour = remaining_labour / max(c["labour_days_per_acre"],1)
        # farm should be diversified: cap single crop at 45% unless only 1 crop
        max_by_diversification = req.total_land_acres * 0.45 if max_c > 1 else req.total_land_acres
        # For top crop allow slightly more
        if len(allocations) == 0:
            max_by_diversification = req.total_land_acres * 0.55
        feasible = min(max_by_land, max_by_budget, max_by_water, max_by_labour, max_by_diversification)
        if feasible < min_acres:
            continue
        # allocate feasible but leave room for remaining crops: don't take all
        # heuristic: take 70% of feasible or at least min
        # but ensure we can fill at least 2-3 crops
        remaining_slots = max_c - len(allocations) - 1
        if remaining_slots > 0:
            # reserve at least min_acres per remaining slot
            reserve_land = remaining_slots * min_acres
            feasible = min(feasible, remaining_land - reserve_land)
            if feasible < min_acres:
                continue
        acres = round(feasible, 2)
        # snap to 0.5 increments for readability
        acres = math.floor(acres * 2) / 2
        if acres < min_acres:
            continue
        allocations.append((cid, c, soil_suit, acres))
        remaining_land -= acres
        remaining_budget -= acres * c["cost_per_acre"]
        remaining_water -= acres * c["water_requirement_mm"]
        remaining_labour -= acres * c["labour_days_per_acre"]

    # If leftover land >1 acre, distribute proportionally to lowest water crops
    if remaining_land >= 0.8 and allocations:
        # try to fill with best remaining scoring that fits budget/water
        for rap, profit, cid, c, soil_suit in scored:
            if any(a[0]==cid for a in allocations):
                continue
            if remaining_land < 0.5:
                break
            feasible = min(remaining_land, remaining_budget/max(c["cost_per_acre"],1), remaining_water/max(c["water_requirement_mm"],1))
            if feasible >= 0.5:
                ac = math.floor(min(feasible, remaining_land)*2)/2
                allocations.append((cid, c, soil_suit, ac))
                remaining_land -= ac
                remaining_budget -= ac*c["cost_per_acre"]
                remaining_water -= ac*c["water_requirement_mm"]
                if len(allocations) >= max_c:
                    break
    return allocations

def _allocate_linprog(scored: List[Tuple], req: CropAllocationRequest, max_c: int):
    """Try scipy.optimize.linprog; fallback to None on failure or if scipy missing."""
    try:
        import numpy as np
        from scipy.optimize import linprog
    except Exception:
        return None
    # Only use linprog if number of variables small
    n = min(len(scored), max_c + 2)
    vars_scored = scored[:n]
    # Objective: maximize RAP -> minimize negative
    c_obj = np.array([-s[0] for s in vars_scored], dtype=float)
    # Constraints:
    # 1) sum acres <= total_land
    # 2) sum cost*acres <= budget
    # 3) sum water*acres <= water_available
    water_avail = req.water_availability_mm * req.total_land_acres if req.water_availability_mm <= 5000 else req.water_availability_mm
    A_ub = []
    b_ub = []
    A_ub.append([1]*n); b_ub.append(req.total_land_acres)
    A_ub.append([s[3]["cost_per_acre"] for s in vars_scored]); b_ub.append(req.budget_inr)
    A_ub.append([s[3]["water_requirement_mm"] for s in vars_scored]); b_ub.append(water_avail)
    if req.labour_availability_days:
        A_ub.append([s[3]["labour_days_per_acre"] for s in vars_scored]); b_ub.append(req.labour_availability_days)
    A_ub = np.array(A_ub, dtype=float)
    b_ub = np.array(b_ub, dtype=float)
    bounds = [(0, req.total_land_acres*0.55 if i==0 else req.total_land_acres*0.45) for i in range(n)]
    try:
        res = linprog(c_obj, A_ub=A_ub, b_ub=b_ub, bounds=bounds, method='highs')
        if not res.success:
            return None
        x = res.x
        # Filter small allocations, pick top max_c
        allocs = []
        for i, acres in enumerate(x):
            if acres >= 0.5:
                rap, profit, cid, c, soil_suit = vars_scored[i]
                allocs.append((cid, c, soil_suit, float(acres)))
        # keep only max_c best by acres*rap
        allocs.sort(key=lambda a: a[3], reverse=True)
        allocs = allocs[:max_c]
        # If linprog left large fallow, supplement with greedy for remaining land
        used = sum(a[3] for a in allocs)
        if req.total_land_acres - used > 1.0:
            # refine via greedy for remaining?
            pass
        if not allocs:
            return None
        return allocs
    except Exception:
        return None
