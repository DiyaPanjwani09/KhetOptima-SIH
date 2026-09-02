import React, { useState, useEffect } from 'react';
import { khetApi } from '../services/khetApi';

const STATES = ['Delhi', 'Punjab', 'Haryana', 'UP', 'MP', 'Rajasthan', 'Gujarat', 'Maharashtra', 'Bihar', 'WB', 'Karnataka', 'Tamil Nadu'];

export default function Weather() {
  const [state, setState] = useState('Delhi');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    khetApi.getWeather(state)
      .then((r) => setWeather(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [state]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="page-title mb-1">Weather</h1>
      <p className="page-subtitle mb-6">Current conditions and farm advisory for your region</p>

      <div className="mb-4">
        <label className="label">Select State</label>
        <select value={state} onChange={(e) => setState(e.target.value)} className="input-field w-48">
          {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="loading-spinner"></div></div>
      ) : weather ? (
        <div className="space-y-6">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-4xl font-bold text-gray-900">{weather.temperature}°C</div>
                <div className="text-lg text-gray-600 mt-1">{weather.condition}</div>
                <div className="text-sm text-gray-500 mt-1">{state}</div>
              </div>
              <div className="text-right space-y-1">
                <div className="text-sm"><span className="text-gray-500">Rainfall:</span> <span className="font-medium">{weather.rainfall} mm</span></div>
                <div className="text-sm"><span className="text-gray-500">Humidity:</span> <span className="font-medium">{weather.humidity}%</span></div>
                <div className="text-sm"><span className="text-gray-500">Wind:</span> <span className="font-medium">{weather.windSpeed} km/h</span></div>
              </div>
            </div>
          </div>

          {weather.forecast && (
            <div className="card">
              <h3 className="section-title mb-3">5-Day Forecast</h3>
              <div className="grid grid-cols-5 gap-2">
                {weather.forecast.map((day, i) => (
                  <div key={i} className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-xs text-gray-500 mb-1">{day.day}</div>
                    <div className="font-semibold text-gray-900">{day.temp}°C</div>
                    <div className="text-xs text-gray-500">{day.condition}</div>
                    <div className="text-xs text-blue-500 mt-1">{day.rainfall}mm</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {weather.advisory && weather.advisory.length > 0 && (
            <div className="card border-green-200 bg-green-50">
              <h3 className="section-title mb-2">Farm Advisory</h3>
              <ul className="space-y-2">
                {weather.advisory.map((tip, i) => (
                  <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">&#10003;</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <div className="card empty-state">Could not load weather data.</div>
      )}
    </div>
  );
}
