const fetch = require('node-fetch');
const config = require('../config/env');

const ML_BASE = config.mlServiceUrl;

async function callML(endpoint, method = 'GET', body = null) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (body) options.body = JSON.stringify(body);

  const response = await fetch(`${ML_BASE}${endpoint}`, options);
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`ML service error: ${response.status} - ${text}`);
  }
  return response.json();
}

async function optimize(payload) {
  return callML('/api/v1/khet-optima/optimize', 'POST', payload);
}

async function simulate(payload) {
  return callML('/api/v1/khet-optima/simulate', 'POST', payload);
}

async function simulateAll(payload) {
  return callML('/api/v1/khet-optima/simulate/all', 'POST', payload);
}

async function getCrops() {
  return callML('/api/v1/khet-optima/crops');
}

async function getCrop(cropId) {
  return callML(`/api/v1/khet-optima/crops/${cropId}`);
}

async function getMarketIntelligence() {
  return callML('/api/v1/khet-optima/market/intelligence');
}

async function getStats() {
  return callML('/api/v1/khet-optima/stats');
}

module.exports = { optimize, simulate, simulateAll, getCrops, getCrop, getMarketIntelligence, getStats };
