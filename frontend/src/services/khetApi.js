import api from '../api';

export const khetApi = {
  getCrops: () => api.get('/api/crops'),
  getCrop: (id) => api.get(`/api/crops/${id}`),
  optimize: (payload) => api.post('/api/optimization/optimize', payload),
  simulate: (payload) => api.post('/api/simulation', payload),
  simulateAll: (payload) => api.post('/api/simulation/all', payload),
  market: () => api.get('/api/market/intelligence'),
  stats: () => api.get('/api/crops').then((r) => {
    const crops = Array.isArray(r.data) ? r.data : [];
    const totalCrops = crops.length;
    const avgProfit = crops.length > 0
      ? Math.round(crops.reduce((sum, c) => sum + (c.profit_per_acre || 0), 0) / crops.length)
      : 0;
    return { totalCrops, avgProfit };
  }),
  getWeather: (state) => api.get(`/api/weather?state=${state || 'Delhi'}`),
  getProducts: (params) => api.get('/api/marketplace/products', { params }),
  getServices: (params) => api.get('/api/marketplace/services', { params }),
  getListing: (id) => api.get(`/api/marketplace/${id}`),
  createListing: (data) => api.post('/api/marketplace/listings', data),
  getAdvisory: (params) => api.get('/api/advisory', { params }),
};
