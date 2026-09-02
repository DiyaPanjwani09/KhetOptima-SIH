import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import toast from 'react-hot-toast';
import { khetApi } from '../services/khetApi';

const SOIL_TYPES = ['loamy', 'clay', 'sandy', 'black', 'red', 'alluvial'];
const SEASONS = ['Rabi', 'Kharif', 'Zaid', 'Annual'];
const RISK_LEVELS = ['low', 'medium', 'high'];
const STATES = ['Punjab', 'Haryana', 'UP', 'MP', 'Rajasthan', 'Gujarat', 'Maharashtra', 'Bihar', 'WB', 'Telangana', 'Karnataka', 'Tamil Nadu', 'AP', 'Odisha', 'Chhattisgarh'];
const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#f97316'];

const initialForm = {
  total_land_acres: 10,
  soil_type: 'loamy',
  water_availability_mm: 500,
  budget_inr: 145000,
  state: 'Punjab',
  season: 'Rabi',
  risk_tolerance: 'medium',
  max_crops: 4,
};

export default function Planner() {
  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: ['total_land_acres', 'water_availability_mm', 'budget_inr', 'max_crops'].includes(name)
        ? Number(value) || 0
        : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await khetApi.optimize(form);
      setResult(res.data);
      toast.success('Farm plan generated!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Optimization failed');
    } finally {
      setLoading(false);
    }
  };

  const pieData = result?.allocations?.map((a) => ({
    name: a.crop_name || a.crop_id,
    value: parseFloat(a.acres),
  })) || [];

  const barData = result?.allocations?.map((a) => ({
    name: a.crop_name || a.crop_id,
    revenue: a.revenue,
    cost: a.cost,
    profit: a.profit,
  })) || [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="page-title mb-1">Farm Planner</h1>
      <p className="page-subtitle mb-6">Enter your farm details to get an optimized crop plan</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form onSubmit={handleSubmit} className="lg:col-span-1 card">
          <div className="space-y-4">
            <div>
              <label className="label">Land (acres)</label>
              <input type="number" name="total_land_acres" value={form.total_land_acres} onChange={handleChange} className="input-field" min="0.5" step="0.5" />
            </div>
            <div>
              <label className="label">Soil Type</label>
              <select name="soil_type" value={form.soil_type} onChange={handleChange} className="input-field">
                {SOIL_TYPES.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Water Availability (mm)</label>
              <input type="number" name="water_availability_mm" value={form.water_availability_mm} onChange={handleChange} className="input-field" min="0" step="10" />
            </div>
            <div>
              <label className="label">Budget (INR)</label>
              <input type="number" name="budget_inr" value={form.budget_inr} onChange={handleChange} className="input-field" min="1000" step="1000" />
            </div>
            <div>
              <label className="label">State</label>
              <select name="state" value={form.state} onChange={handleChange} className="input-field">
                {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Season</label>
              <select name="season" value={form.season} onChange={handleChange} className="input-field">
                {SEASONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Risk Tolerance</label>
              <select name="risk_tolerance" value={form.risk_tolerance} onChange={handleChange} className="input-field">
                {RISK_LEVELS.map((r) => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Max Crops</label>
              <input type="number" name="max_crops" value={form.max_crops} onChange={handleChange} className="input-field" min="1" max="8" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Optimizing...' : 'Generate Plan'}
            </button>
          </div>
        </form>

        <div className="lg:col-span-2 space-y-6">
          {loading && (
            <div className="card flex items-center justify-center py-12">
              <div className="loading-spinner"></div>
              <span className="ml-3 text-gray-500">Optimizing your farm plan...</span>
            </div>
          )}

          {result && !loading && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="card">
                  <div className="stat-value text-green-700">₹{result.total_profit?.toLocaleString()}</div>
                  <div className="stat-label">Expected Profit</div>
                </div>
                <div className="card">
                  <div className="stat-value">{result.total_land_used?.toFixed(1)}</div>
                  <div className="stat-label">Acres Used</div>
                </div>
                <div className="card">
                  <div className="stat-value">{result.water_usage_pct?.toFixed(0)}%</div>
                  <div className="stat-label">Water Usage</div>
                </div>
                <div className="card">
                  <div className={`badge ${result.risk_level === 'Low' ? 'badge-green' : result.risk_level === 'Medium' ? 'badge-yellow' : 'badge-red'}`}>
                    {result.risk_level}
                  </div>
                  <div className="stat-label mt-1">Risk Level</div>
                </div>
              </div>

              {result.allocations?.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="card">
                    <h3 className="section-title mb-3">Land Allocation</h3>
                    <ResponsiveContainer width="100%" height={220}>
                      <PieChart>
                        <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, value }) => `${name}: ${value}ac`}>
                          {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="card">
                    <h3 className="section-title mb-3">Revenue vs Cost</h3>
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={barData}>
                        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip />
                        <Bar dataKey="revenue" fill="#22c55e" name="Revenue" />
                        <Bar dataKey="cost" fill="#ef4444" name="Cost" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <h3 className="section-title">Recommended Crops</h3>
                {result.allocations?.map((a, i) => (
                  <div key={i} className="card">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-semibold text-gray-900">{a.crop_name || a.crop_id}</div>
                        <div className="text-sm text-gray-500 mt-0.5">{a.acres?.toFixed(1)} acres ({a.land_percentage?.toFixed(0)}%)</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-green-700">₹{a.profit?.toLocaleString()}</div>
                        <div className="text-xs text-gray-400">profit</div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="badge badge-blue">Yield: {a.yield_quintal?.toFixed(1)} qt</span>
                      <span className="badge badge-green">Revenue: ₹{a.revenue?.toLocaleString()}</span>
                      <span className="badge badge-gray">Soil: {a.soil_suitability_pct?.toFixed(0)}%</span>
                    </div>
                    {a.explanation && <p className="text-xs text-gray-500 mt-2">{a.explanation}</p>}
                  </div>
                ))}
              </div>

              {result.warnings?.length > 0 && (
                <div className="card border-yellow-200 bg-yellow-50">
                  <h4 className="font-medium text-yellow-800 mb-1">Warnings</h4>
                  {result.warnings.map((w, i) => <p key={i} className="text-sm text-yellow-700">{w}</p>)}
                </div>
              )}

              {result.glut_alerts?.length > 0 && (
                <div className="card border-red-200 bg-red-50">
                  <h4 className="font-medium text-red-800 mb-1">Glut Alerts</h4>
                  {result.glut_alerts.map((a, i) => <p key={i} className="text-sm text-red-700">{a}</p>)}
                </div>
              )}
            </>
          )}

          {!result && !loading && (
            <div className="card empty-state">
              <p>Fill in your farm details and click "Generate Plan" to see results.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
