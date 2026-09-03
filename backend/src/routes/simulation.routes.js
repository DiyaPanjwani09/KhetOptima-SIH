const express = require('express');
const router = express.Router();
const mlService = require('../services/ml.service');
const { asyncHandler } = require('../middleware/errorHandler');

router.post('/', asyncHandler(async (req, res) => {
  const { rainfall_change_pct, water_change_pct, price_change_pct,
    fertilizer_cost_change_pct, budget_change_pct, yield_change_pct,
    scenario_name, ...farmFields } = req.body;

  const payload = {
    farm: farmFields,
    rainfall_change_pct: rainfall_change_pct || 0,
    water_change_pct: water_change_pct || 0,
    price_change_pct: price_change_pct || 0,
    fertilizer_price_change_pct: fertilizer_cost_change_pct || 0,
    budget_change_pct: budget_change_pct || 0,
    yield_change_pct: yield_change_pct || 0,
    scenario_name: scenario_name || 'Custom',
  };

  const result = await mlService.simulate(payload);
  res.json(result);
}));

router.post('/all', asyncHandler(async (req, res) => {
  const result = await mlService.simulateAll(req.body);
  res.json(result);
}));

module.exports = router;
