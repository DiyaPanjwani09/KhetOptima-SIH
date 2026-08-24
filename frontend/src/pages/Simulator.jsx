import React, { useState } from 'react';
import { khetApi } from '../services/khetApi';
import { FaFlask, FaWater, FaRupeeSign, FaSeedling } from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function Simulator(){
  const [farm,setFarm]=useState({total_land_acres:10, soil_type:'loamy', water_availability_mm:500, budget_inr:145000, state:'Punjab', season:'Rabi', risk_tolerance:'medium'});
  const [scenario,setScenario]=useState({rainfall_change_pct:0, price_change_pct:0, fertilizer_price_change_pct:0, water_change_pct:0, budget_change_pct:0, yield_change_pct:0});
  const [base,setBase]=useState(null);
  const [result,setResult]=useState(null);
  const [all,setAll]=useState(null);
  const [loading,setLoading]=useState(false);

  const runSingle = async()=>{
    setLoading(true);
    try{
      const r=await khetApi.simulate({farm, ...scenario, scenario_name:'Custom What-If'});
      setResult(r); setBase(r.result); // keep?
      // need base separately: fetch base if not set
      if(!base){
        const b=await khetApi.optimize(farm);
        setBase(b);
      }
      toast.success('Simulation done');
    }catch(e){toast.error('Simulation failed');}
    finally{setLoading(false);}
  };
  const runAll = async()=>{
    setLoading(true);
    try{
      const r=await khetApi.simulateAll(farm);
      setAll(r); setBase(r.base);
      toast.success('All scenarios simulated');
    }catch(e){toast.error('Failed');}
    finally{setLoading(false);}
  };

  const field = (label,key,min,max,step=5)=>(
    <label className="text-xs text-slate-400">{label}
      <div className="flex items-center gap-2 mt-1">
        <input type="range" min={min} max={max} step={step} value={scenario[key]} onChange={e=>setScenario(s=>({...s,[key]:parseInt(e.target.value)}))} className="flex-1 accent-emerald-500"/>
        <span className={`text-xs font-bold min-w-[56px] text-center px-2 py-1 rounded-full border ${scenario[key]===0?'bg-white/5 text-slate-300 border-white/10':scenario[key]>0?'bg-green-500/15 text-green-300 border-green-500/25':'bg-red-500/15 text-red-300 border-red-500/25'}`}>{scenario[key]>0?`+${scenario[key]}%`:`${scenario[key]}%`}</span>
      </div>
    </label>
  );

  return(
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/20 flex items-center justify-center"><FaFlask className="text-cyan-400"/></div><div><h1 className="text-2xl font-bold text-white">What-If Farm Simulator</h1><p className="text-sm text-slate-400">Test drought, price crash, water scarcity before you sow</p></div></div>

      <div className="grid lg:grid-cols-[360px_1fr] gap-6">
        <div className="space-y-4">
          <div className="glass-card p-5 space-y-3">
            <h3 className="font-semibold text-white text-sm">Base Farm (same as Planner)</h3>
            <div className="grid grid-cols-2 gap-2">
              <label className="text-xs text-slate-400">Land<input type="number" value={farm.total_land_acres} onChange={e=>setFarm(s=>({...s,total_land_acres:parseFloat(e.target.value)}))} className="input-glass mt-1"/></label>
              <label className="text-xs text-slate-400">Season<select value={farm.season} onChange={e=>setFarm(s=>({...s,season:e.target.value}))} className="input-glass mt-1"><option>Rabi</option><option>Kharif</option><option>Zaid</option></select></label>
            </div>
            <label className="text-xs text-slate-400">Soil<select value={farm.soil_type} onChange={e=>setFarm(s=>({...s,soil_type:e.target.value}))} className="input-glass mt-1"><option value="loamy">Loamy</option><option value="clay">Clay</option><option value="sandy">Sandy</option><option value="black">Black</option><option value="red">Red</option><option value="alluvial">Alluvial</option></select></label>
            <div className="grid grid-cols-2 gap-2">
              <label className="text-xs text-slate-400">Water mm<input type="number" value={farm.water_availability_mm} onChange={e=>setFarm(s=>({...s,water_availability_mm:parseFloat(e.target.value)}))} className="input-glass mt-1"/></label>
              <label className="text-xs text-slate-400">Budget ₹<input type="number" value={farm.budget_inr} onChange={e=>setFarm(s=>({...s,budget_inr:parseFloat(e.target.value)}))} className="input-glass mt-1"/></label>
            </div>
          </div>

          <div className="glass-card p-5 space-y-4">
            <h3 className="font-semibold text-white text-sm flex items-center gap-2"><FaFlask className="text-cyan-400"/> Scenario Dials</h3>
            {field('Rainfall change', 'rainfall_change_pct', -60, 60)}
            {field('Water availability', 'water_change_pct', -60, 60)}
            {field('Market price', 'price_change_pct', -40, 40)}
            {field('Fertilizer price', 'fertilizer_price_change_pct', -20, 100)}
            {field('Budget change', 'budget_change_pct', -50, 50)}
            {field('Yield change', 'yield_change_pct', -30, 30)}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button onClick={runSingle} disabled={loading} className="btn-primary justify-center py-2.5 rounded-xl" style={{background:'linear-gradient(135deg,#0891b2,#06b6d4)'}}>{loading?'...':'Run What-If'}</button>
              <button onClick={runAll} disabled={loading} className="btn-secondary justify-center py-2.5 rounded-xl">Run All 6</button>
            </div>
            <p className="text-[11px] text-slate-500 text-center">Examples: Drought -30% rainfall • Water -40% • Price -15% • Fertilizer +20%</p>
          </div>
        </div>

        <div className="space-y-4">
          {!result && !all && (
            <div className="glass-card p-12 text-center">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mx-auto mb-4"><FaFlask className="text-cyan-400 w-5 h-5"/></div>
              <h3 className="text-white font-semibold mb-1">No simulation yet</h3><p className="text-sm text-slate-400">Move the dials and run a scenario. The optimizer will re-allocate crops under stressed conditions.</p>
              <div className="mt-4 grid grid-cols-2 gap-2 text-left text-xs max-w-lg mx-auto">
                <div className="bg-white/5 border border-white/10 rounded-xl p-3"><strong className="text-white">Drought</strong><div className="text-slate-400">Rainfall -30% → water-intensive crops penalized, yield drops</div></div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-3"><strong className="text-white">Price Crash</strong><div className="text-slate-400">Market -15% → profit falls, allocation may shift to MSP crops</div></div>
              </div>
            </div>
          )}

          {result && (
            <div className="glass-card p-5">
              <h4 className="font-semibold text-white mb-2">Result: {result.scenario_name} — <span className="text-cyan-300">{result.delta_description}</span></h4>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-white/5 rounded-xl p-3 text-center"><div className="text-[11px] text-slate-400">Profit Change</div><div className={`text-lg font-bold ${result.impact_summary.profit_change>=0?'text-green-400':'text-red-400'}`}>{result.impact_summary.profit_change>=0?'+':''}₹{result.impact_summary.profit_change.toLocaleString('en-IN')} ({result.impact_summary.profit_change_pct}%)</div></div>
                <div className="bg-white/5 rounded-xl p-3 text-center"><div className="text-[11px] text-slate-400">New Profit</div><div className="text-lg font-bold text-white">₹{result.result.total_profit.toLocaleString('en-IN')}</div></div>
                <div className="bg-white/5 rounded-xl p-3 text-center"><div className="text-[11px] text-slate-400">Water Usage</div><div className="text-lg font-bold text-cyan-400">{result.result.water_usage_pct}%</div></div>
              </div>
              <div className="flex flex-wrap gap-2">
                {result.result.allocations.map(a=>(
                  <span key={a.crop_id} className="text-xs bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1 text-emerald-200">{a.crop_name} {a.acres} ac</span>
                ))}
              </div>
              <div className="mt-3 text-xs text-slate-400">Risk now: <span className="text-white">{result.result.risk_level}</span> • Sustainability {result.result.sustainability_score}/100 • Confidence {result.result.confidence_pct}%</div>
            </div>
          )}

          {all && (
            <div className="space-y-3">
              <h4 className="font-semibold text-white">All Predefined Scenarios</h4>
              <div className="grid md:grid-cols-2 gap-3">
                {all.scenarios.map((s,i)=>(
                  <div key={i} className="glass-card p-4">
                    <div className="font-semibold text-white text-sm mb-1">{s.scenario_name}</div>
                    <div className="text-xs text-slate-400 mb-2">{s.delta_description}</div>
                    <div className={`text-sm font-bold ${s.impact_summary.profit_change>=0?'text-green-400':'text-red-400'}`}>{s.impact_summary.profit_change>=0?'+':''}₹{s.impact_summary.profit_change.toLocaleString('en-IN')} ({s.impact_summary.profit_change_pct}%)</div>
                    <div className="text-xs text-slate-400">Profit ₹{s.result.total_profit.toLocaleString('en-IN')} • Water {s.result.water_usage_pct}% • Risk {s.result.risk_level}</div>
                    <div className="flex flex-wrap gap-1 mt-2">{s.result.allocations.slice(0,3).map(a=> <span key={a.crop_id} className="text-[10px] bg-white/5 border border-white/10 rounded-full px-2 py-0.5 text-slate-300">{a.crop_name} {a.acres}ac</span>)}</div>
                  </div>
                ))}
              </div>
              <div className="glass-card p-4">
                <h5 className="font-semibold text-white text-sm mb-2">Base vs Scenarios — Profit Comparison</h5>
                <div className="space-y-2">
                  <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-2"><span className="text-sm text-white">Base (Current Conditions)</span><span className="font-bold text-emerald-400">₹{all.base.total_profit.toLocaleString('en-IN')}</span></div>
                  {all.scenarios.map(s=>(
                    <div key={s.scenario_name} className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-2"><span className="text-sm text-slate-300">{s.scenario_name}</span><span className={`font-bold ${s.impact_summary.profit_change>=0?'text-green-400':'text-red-400'}`}>₹{s.result.total_profit.toLocaleString('en-IN')}</span></div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
