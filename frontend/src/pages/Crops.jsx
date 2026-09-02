import React, { useState, useEffect } from 'react';
import { khetApi } from '../services/khetApi';

const SEASONS = ['All', 'Rabi', 'Kharif', 'Zaid', 'Annual'];

export default function Crops() {
  const [crops, setCrops] = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    khetApi.getCrops()
      .then((r) => setCrops(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'All' ? crops : crops.filter((c) => c.season === filter);

  if (loading) return <div className="max-w-6xl mx-auto px-4 py-8"><div className="flex justify-center py-12"><div className="loading-spinner"></div></div></div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="page-title mb-1">Crop Encyclopedia</h1>
      <p className="page-subtitle mb-4">Browse {crops.length} crops with economics, soil suitability, and market data</p>

      <div className="flex flex-wrap gap-2 mb-6">
        {SEASONS.map((s) => (
          <button key={s} onClick={() => setFilter(s)} className={`btn-sm ${filter === s ? 'btn-primary' : 'btn-secondary'}`}>
            {s}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((crop) => (
          <div key={crop.id} className="card">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-gray-900">{crop.name}</h3>
                <div className="text-sm text-gray-500">{crop.category} &middot; {crop.duration_days} days</div>
              </div>
              <span className={`badge ${crop.season === 'Rabi' ? 'badge-blue' : crop.season === 'Kharif' ? 'badge-green' : crop.season === 'Zaid' ? 'badge-yellow' : 'badge-gray'}`}>
                {crop.season}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm mb-3">
              <div>
                <span className="text-gray-500">MSP:</span>
                <span className="ml-1 font-medium">₹{crop.msp?.toLocaleString()}/qt</span>
              </div>
              <div>
                <span className="text-gray-500">Yield:</span>
                <span className="ml-1 font-medium">{crop.yield_quintal_per_acre} qt/ac</span>
              </div>
              <div>
                <span className="text-gray-500">Cost:</span>
                <span className="ml-1 font-medium">₹{crop.cost_per_acre?.toLocaleString()}/ac</span>
              </div>
              <div>
                <span className="text-gray-500">Profit:</span>
                <span className="ml-1 font-medium text-green-700">₹{crop.profit_per_acre?.toLocaleString()}/ac</span>
              </div>
              <div>
                <span className="text-gray-500">Water:</span>
                <span className="ml-1 font-medium">{crop.water_requirement_mm}mm</span>
              </div>
              <div>
                <span className="text-gray-500">Risk:</span>
                <span className={`ml-1 font-medium ${crop.risk_score <= 3 ? 'text-green-700' : crop.risk_score <= 6 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {crop.risk_label}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1">
              <span className="badge badge-green">Sustainability: {crop.sustainability_score}/10</span>
              {crop.glut_risk === 'High' || crop.glut_risk === 'Very High' ? (
                <span className="badge badge-red">Glut: {crop.glut_risk}</span>
              ) : null}
              <span className="badge badge-gray">Demand: {crop.demand_trend}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
