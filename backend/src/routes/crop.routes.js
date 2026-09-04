const express = require('express');
const router = express.Router();
const mlService = require('../services/ml.service');
const { asyncHandler } = require('../middleware/errorHandler');

router.get('/', asyncHandler(async (req, res) => {
  const data = await mlService.getCrops();
  res.json(data.crops || data);
}));

router.get('/:id', asyncHandler(async (req, res) => {
  const crop = await mlService.getCrop(req.params.id);
  if (!crop) return res.status(404).json({ error: 'Crop not found' });
  res.json(crop);
}));

module.exports = router;
