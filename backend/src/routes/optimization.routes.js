const express = require('express');
const router = express.Router();
const mlService = require('../services/ml.service');
const { asyncHandler } = require('../middleware/errorHandler');

router.post('/optimize', asyncHandler(async (req, res) => {
  const result = await mlService.optimize(req.body);
  res.json(result);
}));

module.exports = router;
