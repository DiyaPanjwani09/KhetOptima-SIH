const express = require('express');
const router = express.Router();
const mlService = require('../services/ml.service');
const { asyncHandler } = require('../middleware/errorHandler');

router.get('/intelligence', asyncHandler(async (req, res) => {
  const result = await mlService.getMarketIntelligence();
  res.json(result);
}));

module.exports = router;
