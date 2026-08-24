from pydantic import BaseModel, Field
from typing import List, Optional, Dict
from enum import Enum

class SoilType(str, Enum):
    loamy = "loamy"
    clay = "clay"
    sandy = "sandy"
    black = "black"
    red = "red"
    alluvial = "alluvial"

class Season(str, Enum):
    rabi = "Rabi"
    kharif = "Kharif"
    zaid = "Zaid"
    annual = "Annual"

class RiskTolerance(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"

class FarmProfile(BaseModel):
    total_land_acres: float = Field(..., gt=0, le=1000, description="Total cultivable land in acres")
    soil_type: SoilType = Field(..., description="Dominant soil type")
    water_availability_mm: float = Field(..., gt=0, description="Water available per acre equivalent in mm or total mm")
    budget_inr: float = Field(..., gt=0, description="Total budget for cultivation")
    state: Optional[str] = Field(None, description="State for regional tuning")
    season: Optional[str] = Field("Rabi", description="Season: Rabi/Kharif/Zaid/Annual")
    risk_tolerance: RiskTolerance = Field(RiskTolerance.medium)
    previous_crop: Optional[str] = Field(None)
    labour_availability_days: Optional[float] = Field(None, description="Total labour days available")

class CropAllocationRequest(FarmProfile):
    # Allows filtering
    preferred_crops: Optional[List[str]] = Field(None, description="Subset of crop IDs to consider")
    max_crops: Optional[int] = Field(5, ge=1, le=8)

class CropAllocation(BaseModel):
    crop_id: str
    crop_name: str
    acres: float
    percentage: float
    expected_yield_quintal: float
    expected_revenue: float
    expected_cost: float
    expected_profit: float
    soil_suitability: int
    water_requirement_mm: float
    risk_label: str
    risk_score: float
    sustainability_score: int
    season: str
    explanation: str

class OptimizationResult(BaseModel):
    allocations: List[CropAllocation]
    total_land_used: float
    total_land_available: float
    total_cost: float
    total_revenue: float
    total_profit: float
    risk_adjusted_profit: float
    water_used_mm: float
    water_available_mm: float
    water_usage_pct: float
    avg_risk_score: float
    risk_level: str
    confidence_pct: float
    sustainability_score: float
    warnings: List[str]
    glut_alerts: List[str]
    season: str

class WhatIfScenario(BaseModel):
    farm: FarmProfile
    base_result: OptimizationResult
    # Deltas
    rainfall_change_pct: Optional[float] = Field(0, ge=-80, le=100)
    price_change_pct: Optional[float] = Field(0, ge=-50, le=100)
    fertilizer_price_change_pct: Optional[float] = Field(0, ge=-50, le=200)
    water_change_pct: Optional[float] = Field(0, ge=-80, le=100)
    budget_change_pct: Optional[float] = Field(0, ge=-80, le=100)
    yield_change_pct: Optional[float] = Field(0, ge=-50, le=50)

class WhatIfResult(BaseModel):
    scenario_name: str
    delta_description: str
    result: OptimizationResult
    impact_summary: Dict[str, float]

class CropInfo(BaseModel):
    id: str
    name: str
    season: str
    category: str
    yield_quintal_per_acre: float
    price_per_quintal: float | None
    cost_per_acre: float
    profit_per_acre: float
    water_level: str
    water_requirement_mm: float
    risk_label: str
    sustainability_score: int
    soil_suitability: Dict[str, int]
