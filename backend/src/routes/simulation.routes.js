const express = require('express');
const router = express.Router();
const mlService = require('../services/ml.service');
const { asyncHandler } = require('../middleware/errorHandler');

router.post('/', asyncHandler(async (req, res) => {
  const result = await mlService.simulate(req.body);
  res.json(result);
}));

router.post('/all', asyncHandler(async (req, res) => {
  const result = await mlService.simulateAll(req.body);
  res.json(result);
}));

module.exports = router;
