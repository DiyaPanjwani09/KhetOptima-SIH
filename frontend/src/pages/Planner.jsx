import React, { useState } from 'react';
import { khetApi } from '../services/khetApi';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { FaSeedling, FaWater, FaRupeeSign, FaExclamationTriangle, FaLeaf, FaChartPie } from 'react-icons/fa';
import toast from 'react-hot-toast';

const COLORS = ['#10b981','#06b6d4','#f59e0b','#8b5cf6','#ec4899','#6366f1','#14b8a6','#f97316'];

export default function Planner(){
  const [form,setForm]=useState({total_land_acres:10, soil_type:'loamy', water_availability_mm:500, budget_inr:145000, state:'Punjab', season:'Rabi', risk_tolerance:'medium', max_crops:4});
  const [loading,setLoading]=useState(false);
  const [result,setResult]=useState(null);

  const handleChange = (k,v)=> setForm(s=>({...s,[k]:v}));

  const submit = async(e)=>{
    e.preventDefault();
    setLoading(true);
    try{
      const r=await khetApi.optimize(form);
      setResult(r);
      toast.success('Farm plan optimized!');
    }catch(err){ toast.error(err?.response?.data?.detail || 'Optimization failed');}
    finally{setLoading(false);}
  };

  const pieData = result ? result.allocations.map(a=>({name:a.crop_name, value:a.acres})) : [];
  const profitData = result ? result.allocations.map(a=>({name:a.crop_name, profit:a.expected_profit, revenue:a.expected_revenue, cost:a.expected_cost})) : [];

  return(
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center"><FaChartPie className="text-emerald-400"/></div>
        <div><h1 className="text-2xl font-bold text-white">Crop Portfolio Optimizer</h1><p className="text-sm text-slate-400">Digital twin → ML predictions → risk-adjusted optimization</p></div>
      </div>

      <div className="grid lg:grid-cols-[380px_1fr] gap-6">
        <form onSubmit={submit} className="glass-card p-6 space-y-4 h-fit sticky top-20">
          <h3 className="font-semibold text-white flex items-center gap-2"><FaSeedling className="text-emerald-400"/> Farm Profile</h3>
          <div className="grid grid-cols-2 gap-3">
            <label className="text-xs text-slate-400">Total Land (acres)
              <input type="number" step="0.5" min="0.5" value={form.total_land_acres} onChange={e=>handleChange('total_land_acres', parseFloat(e.target.value))} className="input-glass mt-1" required/>
            </label>
            <label className="text-xs text-slate-400">Season
              <select value={form.season} onChange={e=>handleChange('season', e.target.value)} className="input-glass mt-1">
                <option>Rabi</option><option>Kharif</option><option>Zaid</option><option>Annual</option>
              </select>
            </label>
          </div>
          <label className="text-xs text-slate-400">Soil Type
            <select value={form.soil_type} onChange={e=>handleChange('soil_type', e.target.value)} className="input-glass mt-1">
              <option value="loamy">Loamy</option><option value="clay">Clay</option><option value="sandy">Sandy</option><option value="black">Black</option><option value="red">Red</option><option value="alluvial">Alluvial</option>
            </select>
          </label>
          <label className="text-xs text-slate-400">Water Availability (mm per acre)
            <input type="number" value={form.water_availability_mm} onChange={e=>handleChange('water_availability_mm', parseFloat(e.target.value))} className="input-glass mt-1" required/>
            <span className="text-[10px] text-slate-500">e.g., 500 = good, 250 = scarce, 1200 = abundant</span>
          </label>
          <label className="text-xs text-slate-400">Budget (₹)
            <input type="number" value={form.budget_inr} onChange={e=>handleChange('budget_inr', parseFloat(e.target.value))} className="input-glass mt-1" required/>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="text-xs text-slate-400">Risk Tolerance
              <select value={form.risk_tolerance} onChange={e=>handleChange('risk_tolerance', e.target.value)} className="input-glass mt-1">
                <option value="low">Low (Conservative)</option><option value="medium">Medium</option><option value="high">High (Aggressive)</option>
              </select>
            </label>
            <label className="text-xs text-slate-400">Max Crops
              <select value={form.max_crops} onChange={e=>handleChange('max_crops', parseInt(e.target.value))} className="input-glass mt-1">
                <option value={3}>3</option><option value={4}>4</option><option value={5}>5</option><option value={6}>6</option>
              </select>
            </label>
          </div>
          <label className="text-xs text-slate-400">State (optional)
            <input value={form.state} onChange={e=>handleChange('state', e.target.value)} placeholder="Punjab, Maharashtra..." className="input-glass mt-1"/>
          </label>
          <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 rounded-xl mt-2" style={{background:'linear-gradient(135deg,#059669,#16a34a)'}}>
            {loading? <span className="flex items-center gap-2"><span className="spinner w-4 h-4 border-2" style={{borderTopColor:'#fff'}}/> Optimizing...</span> : <><FaSeedling/> Optimize My Farm</>}
          </button>
          <p className="text-[11px] text-slate-500 text-center">Maximizes Expected Profit − Risk Penalty under land, water & budget constraints.</p>
        </form>

        <div className="space-y-6">
          {!result && (
            <div className="glass-card p-12 text-center">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4"><FaChartPie className="text-emerald-400 w-6 h-6"/></div>
              <h3 className="text-white font-semibold mb-2">No plan yet</h3><p className="text-sm text-slate-400 max-w-md mx-auto">Fill your farm profile on the left and click <span className="text-emerald-400 font-medium">Optimize My Farm</span> to generate a portfolio allocation with profit, water & risk analysis.</p>
              <div className="mt-6 bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-left text-xs text-amber-200 max-w-lg mx-auto">
                <strong>Example:</strong> 10 acres, loamy soil, 500 mm water, ₹1,45,000 budget, Rabi season, medium risk → Chickpea/Mustard/Potato mix with ~₹4L profit (see spec).
              </div>
            </div>
          )}
          {result && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="glass-card p-4"><div className="text-xs text-slate-400">Expected Profit</div><div className="text-xl font-bold text-emerald-400">₹{result.total_profit.toLocaleString('en-IN')}</div><div className="text-[11px] text-slate-500">Revenue ₹{result.total_revenue.toLocaleString('en-IN')} • Cost ₹{result.total_cost.toLocaleString('en-IN')}</div></div>
                <div className="glass-card p-4"><div className="text-xs text-slate-400">Land Used</div><div className="text-xl font-bold text-white">{result.total_land_used} / {result.total_land_available} acres</div><div className="text-[11px] text-slate-500">{result.allocations.length} crops • {result.confidence_pct}% confidence</div></div>
                <div className="glass-card p-4"><div className="text-xs text-slate-400 flex items-center gap-1"><FaWater className="text-cyan-400"/> Water</div><div className="text-xl font-bold text-cyan-400">{result.water_usage_pct}%</div><div className="text-[11px] text-slate-500">{result.water_used_mm} / {result.water_available_mm} mm</div></div>
                <div className="glass-card p-4"><div className="text-xs text-slate-400">Risk • Sustainability</div><div className={`text-xl font-bold ${result.risk_level==='Low'?'text-green-400':result.risk_level==='Medium'?'text-yellow-400':'text-red-400'}`}>{result.risk_level}</div><div className="text-[11px] text-slate-500">Sustainability {result.sustainability_score}/100</div></div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="glass-card p-5">
                  <h4 className="font-semibold text-white mb-3">Land Allocation</h4>
                  <ResponsiveContainer width="100%" height={240}>
                    <PieChart>
                      <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} innerRadius={45} label={({name,percent})=> `${name} ${(percent*100).toFixed(0)}%`}>
                        {pieData.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={{background:'rgba(16,16,38,0.95)', border:'1px solid rgba(16,185,129,0.3)', borderRadius:8}}/>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {result.allocations.map((a,i)=>(
                      <span key={a.crop_id} className="inline-flex items-center gap-1.5 text-xs bg-white/5 border border-white/10 rounded-full px-2.5 py-1"><span className="w-2 h-2 rounded-full" style={{background:COLORS[i%COLORS.length]}}/> {a.crop_name} — {a.acres} ac ({a.percentage}%)</span>
                    ))}
                  </div>
                </div>
                <div className="glass-card p-5">
                  <h4 className="font-semibold text-white mb-3">Profit Breakdown (₹)</h4>
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={profitData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.07)"/>
                      <XAxis dataKey="name" tick={{fill:'#94a3b8', fontSize:11}} interval={0} angle={-15} textAnchor="end" height={60}/>
                      <YAxis tick={{fill:'#94a3b8', fontSize:11}}/>
                      <Tooltip contentStyle={{background:'rgba(16,16,38,0.95)', border:'1px solid rgba(16,185,129,0.3)', borderRadius:8}}/>
                      <Legend/>
                      <Bar dataKey="revenue" fill="#10b981" name="Revenue" radius={[6,6,0,0]}/>
                      <Bar dataKey="cost" fill="#64748b" name="Cost" radius={[6,6,0,0]}/>
                      <Bar dataKey="profit" fill="#f59e0b" name="Profit" radius={[6,6,0,0]}/>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="glass-card p-5">
                <h4 className="font-semibold text-white mb-3">Explainable Recommendation</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  {result.allocations.map(a=>(
                    <div key={a.crop_id} className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-semibold text-white flex items-center gap-2"><FaLeaf className="text-emerald-400 w-3 h-3"/> {a.crop_name} — {a.acres} Acres <span className="text-xs font-normal text-slate-400">({a.percentage}%)</span></div>
                          <div className="text-[11px] text-slate-400 mt-1">{a.explanation}</div>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${a.risk_label==='Low'?'bg-green-500/15 text-green-300 border-green-500/25':a.risk_label==='Medium'?'bg-yellow-500/15 text-yellow-300 border-yellow-500/25':'bg-red-500/15 text-red-300 border-red-500/25'}`}>{a.risk_label} Risk</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 mt-3 text-center">
                        <div className="bg-black/20 rounded-lg p-2"><div className="text-[10px] text-slate-500">Yield</div><div className="text-xs font-semibold text-white">{a.expected_yield_quintal} q</div></div>
                        <div className="bg-black/20 rounded-lg p-2"><div className="text-[10px] text-slate-500">Revenue</div><div className="text-xs font-semibold text-emerald-300">₹{a.expected_revenue.toLocaleString('en-IN')}</div></div>
                        <div className="bg-black/20 rounded-lg p-2"><div className="text-[10px] text-slate-500">Profit</div><div className="text-xs font-semibold text-amber-300">₹{a.expected_profit.toLocaleString('en-IN')}</div></div>
                      </div>
                      <div className="flex gap-2 mt-3 text-[10px]">
                        <span className="bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2 py-1 text-emerald-300">Soil {a.soil_suitability}%</span>
                        <span className="bg-cyan-500/10 border border-cyan-500/20 rounded-full px-2 py-1 text-cyan-300">{a.water_requirement_mm} mm</span>
                        <span className="bg-white/5 border border-white/10 rounded-full px-2 py-1 text-slate-300">{a.season}</span>
                      </div>
                    </div>
                  ))}
                </div>
                {(result.warnings.length>0 || result.glut_alerts.length>0) && (
                  <div className="mt-4 space-y-2">
                    {result.warnings.map((w,i)=><div key={i} className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-xs text-amber-200 flex gap-2"><FaExclamationTriangle className="mt-0.5 flex-shrink-0"/> {w}</div>)}
                    {result.glut_alerts.map((w,i)=><div key={i} className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-xs text-red-200 flex gap-2"><FaExclamationTriangle className="mt-0.5 flex-shrink-0"/> {w}</div>)}
                  </div>
                )}
                <div className="mt-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex flex-wrap justify-between gap-4 text-sm">
                  <span className="text-slate-300">Risk-Adjusted Profit: <strong className="text-white">₹{result.risk_adjusted_profit.toLocaleString('en-IN')}</strong></span>
                  <span className="text-slate-300">Water Usage: <strong className="text-cyan-300">{result.water_usage_pct}%</strong></span>
                  <span className="text-slate-300">Confidence: <strong className="text-emerald-300">{result.confidence_pct}%</strong></span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
