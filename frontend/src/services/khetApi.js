import api from '../api';

export const khetApi = {
  getCrops: () => api.get('/api/v1/khet-optima/crops').then(r=>r.data),
  optimize: (payload) => api.post('/api/v1/khet-optima/optimize', payload).then(r=>r.data),
  simulate: (payload) => api.post('/api/v1/khet-optima/simulate', payload).then(r=>r.data),
  simulateAll: (farm) => api.post('/api/v1/khet-optima/simulate/all', farm).then(r=>r.data),
  market: () => api.get('/api/v1/khet-optima/market/intelligence').then(r=>r.data),
  stats: () => api.get('/api/v1/khet-optima/stats').then(r=>r.data),
};
