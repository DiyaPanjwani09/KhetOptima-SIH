import React, { useState, useEffect } from 'react';
import { khetApi } from '../services/khetApi';

const CATEGORIES = [
  { value: '', label: 'All' },
  { value: 'irrigation', label: 'Irrigation' },
  { value: 'crop_management', label: 'Crop Management' },
  { value: 'weather', label: 'Weather' },
  { value: 'soil', label: 'Soil' },
  { value: 'market', label: 'Market' },
];

const SEASONS = [
  { value: '', label: 'All Seasons' },
  { value: 'Rabi', label: 'Rabi' },
  { value: 'Kharif', label: 'Kharif' },
];

export default function Advisory() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [season, setSeason] = useState('');

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (category) params.category = category;
    if (season) params.season = season;
    khetApi.getAdvisory(params)
      .then((r) => setItems(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [category, season]);

  const categoryIcon = {
    irrigation: '💧',
    crop_management: '🌾',
    weather: '🌤',
    soil: '🌱',
    market: '📊',
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="page-title mb-1">Farming Advisory</h1>
      <p className="page-subtitle mb-6">Expert tips on irrigation, crops, soil, weather, and market</p>

      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORIES.map((c) => (
          <button key={c.value} onClick={() => setCategory(c.value)} className={`btn-sm ${category === c.value ? 'btn-primary' : 'btn-secondary'}`}>
            {c.label}
          </button>
        ))}
        <span className="border-l border-gray-300 mx-1"></span>
        {SEASONS.map((s) => (
          <button key={s.value} onClick={() => setSeason(s.value)} className={`btn-sm ${season === s.value ? 'btn-primary' : 'btn-secondary'}`}>
            {s.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="loading-spinner"></div></div>
      ) : items.length === 0 ? (
        <div className="card empty-state">No advisory items found for this filter.</div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="card">
              <div className="flex items-start gap-3">
                <span className="text-2xl">{categoryIcon[item.category] || '📌'}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{item.title}</h3>
                    <span className="badge badge-gray capitalize">{item.category.replace('_', ' ')}</span>
                    {item.season !== 'All' && <span className="badge badge-blue">{item.season}</span>}
                  </div>
                  <p className="text-sm text-gray-600">{item.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
