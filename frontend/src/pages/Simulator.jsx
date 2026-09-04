import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { khetApi } from '../services/khetApi';

const SOIL_TYPES = ['loamy', 'clay', 'sandy', 'black', 'red', 'alluvial'];
const SEASONS = ['Rabi', 'Kharif', 'Zaid', 'Annual'];
const STATES = ['Punjab', 'Haryana', 'UP', 'MP', 'Rajasthan', 'Gujarat', 'Maharashtra', 'Bihar', 'WB'];

const initialFarm = {
  total_land_acres: 10, soil_type: 'loamy', water_availability_mm: 500,
  budget_inr: 145000, state: 'Punjab', season: 'Rabi',
  risk_tolerance: 'medium', max_crops: 4,
};

const initialDelta = {
  rainfall_change_pct: 0, water_change_pct: 0, price_change_pct: 0,
  fertilizer_cost_change_pct: 0, budget_change_pct: 0, yield_change_pct: 0,
};

export default function Simulator() {
  const [farm, setFarm] = useState(initialFarm);
  const [delta, setDelta] = useState(initialDelta);
  const [scenarioName, setScenarioName] = useState('Custom');
  const [result, setResult] = useState(null);
  const [allResults, setAllResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFarm = (e) => {
    const { name, value } = e.target;
    setFarm((p) => ({ ...p, [name]: ['total_land_acres', 'water_availability_mm', 'budget_inr', 'max_crops'].includes(name) ? Number(value) || 0 : value }));
  };

  const handleDelta = (e) => {
    setDelta((p) => ({ ...p, [e.target.name]: Number(e.target.value) || 0 }));
  };

  const runSingle = async () => {
    setLoading(true);
    try {
      const res = await khetApi.simulate({ ...farm, ...delta, scenario_name: scenarioName });
      setResult(res.data);
      setAllResults(null);
      toast.success('Scenario simulated!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Simulation failed');
    } finally {
      setLoading(false);
    }
  };

  const runAll = async () => {
    setLoading(true);
    try {
      const res = await khetApi.simulateAll(farm);
      const data = res.data;
      setAllResults(data.scenarios || (Array.isArray(data) ? data : []));
      setResult(null);
      toast.success('All scenarios simulated!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Simulation failed');
    } finally {
      setLoading(false);
    }
  };

  const Slider = ({ label, name, value, unit = '%' }) => (
    <div>
      <div className="flex justify-between mb-1">
        <label className="label mb-0">{label}</label>
        <span className="text-sm text-gray-600">{value > 0 ? '+' : ''}{value}{unit}</span>
      </div>
      <input type="range" name={name} value={value} onChange={handleDelta} min="-50" max="50" step="5" className="w-full accent-green-600" />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="page-title mb-1">What-If Simulator</h1>
      <p className="page-subtitle mb-6">Test how changes affect your farm profitability</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <div className="card">
            <h3 className="section-title mb-3">Farm Parameters</h3>
            <div className="space-y-3">
              <div>
                <label className="label">Land (acres)</label>
                <input type="number" name="total_land_acres" value={farm.total_land_acres} onChange={handleFarm} className="input-field" min="0.5" step="0.5" />
              </div>
              <div>
                <label className="label">Soil Type</label>
                <select name="soil_type" value={farm.soil_type} onChange={handleFarm} className="input-field">
                  {SOIL_TYPES.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Water (mm)</label>
                <input type="number" name="water_availability_mm" value={farm.water_availability_mm} onChange={handleFarm} className="input-field" min="0" />
              </div>
              <div>
                <label className="label">Budget (INR)</label>
                <input type="number" name="budget_inr" value={farm.budget_inr} onChange={handleFarm} className="input-field" min="1000" />
              </div>
              <div>
                <label className="label">State</label>
                <select name="state" value={farm.state} onChange={handleFarm} className="input-field">
                  {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Season</label>
                <select name="season" value={farm.season} onChange={handleFarm} className="input-field">
                  {SEASONS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="section-title mb-3">Scenario Sliders</h3>
            <div className="space-y-4">
              <Slider label="Rainfall" name="rainfall_change_pct" value={delta.rainfall_change_pct} />
              <Slider label="Water" name="water_change_pct" value={delta.water_change_pct} />
              <Slider label="Market Price" name="price_change_pct" value={delta.price_change_pct} />
              <Slider label="Fertilizer Cost" name="fertilizer_cost_change_pct" value={delta.fertilizer_cost_change_pct} />
              <Slider label="Budget" name="budget_change_pct" value={delta.budget_change_pct} />
              <Slider label="Yield" name="yield_change_pct" value={delta.yield_change_pct} />
            </div>
            <div className="mt-3">
              <label className="label">Scenario Name</label>
              <input type="text" value={scenarioName} onChange={(e) => setScenarioName(e.target.value)} className="input-field" />
            </div>
          </div>

          <div className="flex gap-2">
            <button onClick={runSingle} disabled={loading} className="btn-primary flex-1">
              {loading ? 'Running...' : 'Run What-If'}
            </button>
            <button onClick={runAll} disabled={loading} className="btn-secondary flex-1">
              Run All 6
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          {loading && (
            <div className="card flex items-center justify-center py-12">
              <div className="loading-spinner"></div>
              <span className="ml-3 text-gray-500">Simulating...</span>
            </div>
          )}

          {result && !loading && (
            <div className="space-y-4">
              <div className="card">
                <h3 className="section-title mb-2">{result.scenario_name || 'Scenario Result'}</h3>
                {result.impact_summary && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                    {Object.entries(result.impact_summary).map(([key, val]) => (
                      <div key={key}>
                        <div className="text-xs text-gray-500 capitalize">{key.replace(/_/g, ' ')}</div>
                        <div className="font-semibold">{typeof val === 'number' ? val.toLocaleString() : val}</div>
                      </div>
                    ))}
                  </div>
                )}
                {result.result && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                    <div>
                      <div className="stat-label">Profit</div>
                      <div className="font-semibold text-green-700">₹{result.result.total_profit?.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="stat-label">Water Usage</div>
                      <div className="font-semibold">{result.result.water_usage_pct?.toFixed(0)}%</div>
                    </div>
                    <div>
                      <div className="stat-label">Risk Level</div>
                      <div className="font-semibold">{result.result.risk_level}</div>
                    </div>
                    <div>
                      <div className="stat-label">Confidence</div>
                      <div className="font-semibold">{result.result.confidence_pct?.toFixed(0)}%</div>
                    </div>
                  </div>
                )}
              </div>

              {result.result?.allocations?.map((a, i) => (
                <div key={i} className="card">
                  <div className="flex justify-between">
                    <span className="font-medium">{a.crop_name || a.crop_id}</span>
                    <span className="text-green-700 font-medium">₹{a.expected_profit?.toLocaleString()}</span>
                  </div>
                  <div className="text-sm text-gray-500">{a.acres?.toFixed(1)} acres</div>
                </div>
              ))}
            </div>
          )}

          {allResults && !loading && (
            <div className="space-y-4">
              <h3 className="section-title">All 6 Scenarios</h3>
              {allResults.map((r, i) => (
                <div key={i} className="card">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold">{r.scenario_name}</div>
                      <div className="text-sm text-gray-500">{r.delta_description}</div>
                    </div>
                    <div className="text-right">
                      <div className={`font-semibold ${r.result?.total_profit > 0 ? 'text-green-700' : 'text-red-600'}`}>
                        ₹{r.result?.total_profit?.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-400">profit</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!result && !allResults && !loading && (
            <div className="card empty-state">
              <p>Adjust the sliders and click "Run What-If" to simulate a scenario.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
