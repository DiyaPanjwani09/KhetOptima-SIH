import React, { useState, useEffect } from 'react';
import { khetApi } from '../services/khetApi';

export default function Market() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    khetApi.market()
      .then((r) => setData(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="max-w-6xl mx-auto px-4 py-8"><div className="flex justify-center py-12"><div className="loading-spinner"></div></div></div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="page-title mb-1">Market Intelligence</h1>
      <p className="page-subtitle mb-6">Mandi prices, glut alerts, and demand trends for Indian agriculture</p>

      {data?.glut_alerts?.length > 0 && (
        <div className="mb-8">
          <h2 className="section-title mb-3">Glut Risk Alerts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {data.glut_alerts.map((alert, i) => (
              <div key={i} className="card border-red-200 bg-red-50">
                <div className="font-medium text-red-800">{alert.crop}</div>
                <div className="text-sm text-red-600">Glut risk: {alert.glut_risk}</div>
                {alert.message && <div className="text-xs text-red-500 mt-1">{alert.message}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {data?.high_demand?.length > 0 && (
        <div className="mb-8">
          <h2 className="section-title mb-3">High Demand Crops</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {data.high_demand.map((item, i) => (
              <div key={i} className="card border-green-200 bg-green-50">
                <div className="font-medium text-green-800">{item.crop}</div>
                <div className="text-sm text-green-600">Demand: {item.demand_trend}</div>
                {item.msp && <div className="text-xs text-green-500 mt-1">MSP: ₹{item.msp}/quintal</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card">
        <h3 className="section-title mb-2">How KhetOptima Uses Market Data</h3>
        <div className="text-sm text-gray-600 space-y-2">
          <p>Our optimization engine factors in:</p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Historical mandi prices and MSP (Minimum Support Price)</li>
            <li>Glut risk detection for oversupplied crops</li>
            <li>Demand trends to identify profitable opportunities</li>
            <li>Market conditions to help you decide before harvest</li>
          </ul>
          <p className="text-xs text-gray-400 mt-3">Market data is for reference. Actual prices may vary by location and time.</p>
        </div>
      </div>
    </div>
  );
}
