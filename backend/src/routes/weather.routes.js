const express = require('express');
const router = express.Router();
const { getWeather } = require('../services/weather.service');
const { asyncHandler } = require('../middleware/errorHandler');

router.get('/', asyncHandler(async (req, res) => {
  const state = req.query.state || 'Delhi';
  const weather = await getWeather(state);
  res.json(weather);
}));

module.exports = router;
