import React, { useEffect, useState } from 'react';
import { khetApi } from '../services/khetApi';
import { FaStore, FaExclamationTriangle, FaChartLine } from 'react-icons/fa';

export default function Market(){
  const [data,setData]=useState(null);
  useEffect(()=>{khetApi.market().then(setData).catch(()=>{});},[]);
  if(!data) return <div className="max-w-7xl mx-auto p-8 text-center text-slate-400">Loading market intelligence...</div>;
  return(
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/20 flex items-center justify-center"><FaStore className="text-amber-400"/></div><div><h1 className="text-2xl font-bold text-white">Market & Price Intelligence</h1><p className="text-sm text-slate-400">{data.season_note}</p></div></div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass-card p-5">
          <h3 className="font-semibold text-white flex items-center gap-2 mb-4"><FaExclamationTriangle className="text-red-400"/> Glut Risk Alerts</h3>
          {data.glut_alerts.length===0 ? <p className="text-sm text-slate-400">No high glut risks detected for MSP crops.</p> : (
            <div className="space-y-3">
              {data.glut_alerts.map((a,i)=>(
                <div key={i} className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                  <div className="font-semibold text-red-300 text-sm">{a.crop} — <span className="text-xs font-normal">{a.risk} Risk</span></div>
                  <div className="text-xs text-red-200/80 mt-1">{a.message}</div>
                  <div className="text-[11px] text-slate-400 mt-2">Recommendation: Reduce allocation & diversify to pulses/oilseeds.</div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="glass-card p-5">
          <h3 className="font-semibold text-white flex items-center gap-2 mb-4"><FaChartLine className="text-emerald-400"/> High Demand Crops</h3>
          <div className="space-y-2">
            {data.high_demand.map((h,i)=>(
              <div key={i} className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3">
                <span className="text-sm font-medium text-white">{h.crop}</span>
                <span className="text-xs font-bold bg-green-500/20 text-green-300 border border-green-500/25 rounded-full px-2 py-1">{h.trend}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-slate-400">
            MSP crops (wheat ₹2275, mustard ₹5650, chickpea ₹5440) offer price floor. Vegetables are volatile — plant with risk-adjusted allocation.
          </div>
        </div>
      </div>

      <div className="glass-card p-5">
        <h3 className="font-semibold text-white mb-3">How KhetOptima Uses Market Data</h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="bg-white/5 border border-white/10 rounded-xl p-4"><div className="font-semibold text-white mb-1">Historical Mandi Prices</div><div className="text-slate-400 text-xs">Seasonal trends, MSP, regional supply/demand, export/import signals feed price forecasts.</div></div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4"><div className="font-semibold text-white mb-1">Glut Detection</div><div className="text-slate-400 text-xs">If regional cultivation of tomato/onion spikes, system warns to reduce exposure before sowing.</div></div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4"><div className="font-semibold text-white mb-1">Decision Before Harvest</div><div className="text-slate-400 text-xs">Decide <em>before planting</em>, not after harvest — portfolio optimized for expected price, not today’s price.</div></div>
        </div>
      </div>
    </div>
  );
}
