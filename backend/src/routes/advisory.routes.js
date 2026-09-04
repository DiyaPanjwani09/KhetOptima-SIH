const express = require('express');
const router = express.Router();
const { getAdvisory } = require('../data/advisory');

router.get('/', (req, res) => {
  const { category, season } = req.query;
  const advisory = getAdvisory(category, season);
  res.json(advisory);
});

module.exports = router;
