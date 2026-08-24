import React, { useEffect, useState } from 'react';
import { khetApi } from '../services/khetApi';
import { FaLeaf, FaWater, FaRupeeSign } from 'react-icons/fa';

const RISK_COLOR={Low:'bg-green-500/15 text-green-300 border-green-500/25',Medium:'bg-yellow-500/15 text-yellow-300 border-yellow-500/25',High:'bg-orange-500/15 text-orange-300 border-orange-500/25','Very High':'bg-red-500/15 text-red-300 border-red-500/25'};
const GLUT_COLOR={Low:'text-green-400',Medium:'text-yellow-400',High:'text-orange-400','Very High':'text-red-400'};

export default function Crops(){
  const [crops,setCrops]=useState([]);
  const [filter,setFilter]=useState('all');
  useEffect(()=>{khetApi.getCrops().then(d=>setCrops(d.crops)).catch(()=>{});},[]);
  const filtered = crops.filter(c=> filter==='all' || c.season===filter || c.category===filter);
  const seasons=['all','Rabi','Kharif','Zaid','Annual'];
  return(
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-green-500/15 border border-green-500/20 flex items-center justify-center"><FaLeaf className="text-green-400"/></div><div><h1 className="text-2xl font-bold text-white">Crop Encyclopedia</h1><p className="text-sm text-slate-400">16 crops • MSP, yield, cost, water, risk & sustainability</p></div></div>
      <div className="flex flex-wrap gap-2">
        {seasons.map(s=>(
          <button key={s} onClick={()=>setFilter(s)} className={`px-4 py-1.5 rounded-full text-xs font-semibold border ${filter===s?'bg-emerald-500/20 text-emerald-300 border-emerald-500/30':'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10'}`}>{s==='all'?'All Crops':s}</button>
        ))}
        <button onClick={()=>setFilter('Vegetable')} className={`px-4 py-1.5 rounded-full text-xs font-semibold border ${filter==='Vegetable'?'bg-emerald-500/20 text-emerald-300 border-emerald-500/30':'bg-white/5 text-slate-400 border-white/10'}`}>Vegetables</button>
        <button onClick={()=>setFilter('Pulse')} className={`px-4 py-1.5 rounded-full text-xs font-semibold border ${filter==='Pulse'?'bg-emerald-500/20 text-emerald-300 border-emerald-500/30':'bg-white/5 text-slate-400 border-white/10'}`}>Pulses</button>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(c=>(
          <div key={c.id} className="glass-card p-5 hover:border-emerald-500/30 transition-colors">
            <div className="flex items-start justify-between gap-2 mb-3">
              <div>
                <div className="font-bold text-white flex items-center gap-2">{c.name} <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/10 border border-white/10 text-slate-300">{c.season}</span></div>
                <div className="text-xs text-slate-400">{c.category} • {c.duration_days} days • {c.water_level} water</div>
              </div>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${RISK_COLOR[c.risk_label]||RISK_COLOR.Medium}`}>{c.risk_label}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center mb-3">
              <div className="bg-black/20 rounded-xl p-2"><div className="text-[10px] text-slate-500">Yield</div><div className="text-sm font-bold text-white">{c.yield_quintal_per_acre} q/ac</div></div>
              <div className="bg-black/20 rounded-xl p-2"><div className="text-[10px] text-slate-500">Price</div><div className="text-sm font-bold text-emerald-300">{c.price_per_quintal?`₹${c.price_per_quintal}/q`:'Market'}</div></div>
              <div className="bg-black/20 rounded-xl p-2"><div className="text-[10px] text-slate-500">Cost</div><div className="text-sm font-bold text-slate-300">₹{c.cost_per_acre.toLocaleString('en-IN')}</div></div>
            </div>
            <div className="bg-emerald-500/10 border border-emerald-500/15 rounded-xl p-2.5 flex justify-between text-xs mb-3">
              <span className="text-slate-400">Profit / acre</span><span className="font-bold text-emerald-300">₹{c.profit_per_acre.toLocaleString('en-IN')}</span>
              <span className="text-slate-500">Revenue ₹{c.revenue_per_acre.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex flex-wrap gap-1.5 text-[10px]">
              <span className="bg-white/5 border border-white/10 rounded-full px-2 py-1 text-slate-300">Water {c.water_requirement_mm} mm</span>
              <span className="bg-white/5 border border-white/10 rounded-full px-2 py-1 text-slate-300">Sustain {c.sustainability_score}/100</span>
              <span className={`border rounded-full px-2 py-1 ${c.glut_risk==='Low'?'bg-green-500/10 border-green-500/20 text-green-300':'bg-red-500/10 border-red-500/20 text-red-300'}`}>Glut {c.glut_risk}</span>
              <span className="bg-cyan-500/10 border border-cyan-500/20 rounded-full px-2 py-1 text-cyan-300">{c.demand_trend} demand</span>
            </div>
            <div className="mt-3 text-[11px] text-slate-500">Soil fit — Loamy {c.soil_suitability.loamy}% • Clay {c.soil_suitability.clay}% • Sandy {c.soil_suitability.sandy}% • Black {c.soil_suitability.black}%</div>
          </div>
        ))}
      </div>
    </div>
  );
}
