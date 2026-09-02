const express = require('express');
const router = express.Router();
const { getProducts, getServices, getListing, addListing } = require('../data/marketplace');
const { asyncHandler } = require('../middleware/errorHandler');

router.get('/products', (req, res) => {
  const { category, location, search } = req.query;
  const products = getProducts({ category, location, search });
  res.json(products);
});

router.get('/services', (req, res) => {
  const { category, location, search } = req.query;
  const services = getServices({ category, location, search });
  res.json(services);
});

router.get('/:id', (req, res) => {
  const listing = getListing(req.params.id);
  if (!listing) return res.status(404).json({ error: 'Listing not found' });
  res.json(listing);
});

router.post('/listings', (req, res) => {
  const { type, category, name, description, price, unit, vendor, location, contact, availability } = req.body;
  if (!type || !name || !price || !vendor) {
    return res.status(400).json({ error: 'Missing required fields: type, name, price, vendor' });
  }
  const listing = addListing({ type, category, name, description, price, unit, vendor, location, contact, availability });
  res.status(201).json(listing);
});

module.exports = router;
