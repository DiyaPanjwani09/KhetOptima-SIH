import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSeedling, FaChartPie, FaFlask, FaLeaf, FaArrowRight, FaWater, FaRupeeSign, FaShieldAlt, FaMapMarkedAlt } from 'react-icons/fa';
import { khetApi } from '../services/khetApi';

function Stat({value,label}){return(<div className="glass-card p-5 text-center"><div className="text-2xl font-bold text-emerald-400 mb-1">{value}</div><div className="text-xs text-slate-400">{label}</div></div>)}
export default function KhetHome(){
  const [stats,setStats]=useState(null);
  useEffect(()=>{khetApi.stats().then(setStats).catch(()=>{});},[]);
  return(
  <div className="max-w-7xl mx-auto space-y-16 pb-16">
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden rounded-3xl border border-emerald-500/20" style={{background:'radial-gradient(ellipse 80% 60% at 50% 30%, rgba(16,185,129,0.18) 0%, transparent 60%), linear-gradient(180deg, rgba(5,150,105,0.08), transparent)'}}>
      <div className="absolute top-6 left-6 w-64 h-64 rounded-full blur-3xl bg-emerald-500/10" />
      <div className="absolute bottom-6 right-6 w-64 h-64 rounded-full blur-3xl bg-cyan-500/10" />
      <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{duration:0.7}} className="relative z-10 text-center px-6 py-14 max-w-4xl">
        <div className="inline-flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/30 rounded-full px-4 py-1.5 text-xs font-semibold text-emerald-300 mb-6">🌾 AI-Powered Farm Decision Platform • For Indian Farmers</div>
        <h1 className="font-heading text-5xl md:text-6xl font-extrabold leading-tight mb-4"><span className="text-white">Simulate.</span> <span className="text-emerald-400">Optimize.</span> <span className="text-white">Grow for Profit.</span></h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-8 leading-relaxed">Instead of “which crop to grow?”, KhetOptima answers <span className="text-white font-semibold">how much land to allocate to each crop</span> to maximize profit — respecting soil, water, budget, market risk & sustainability.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/planner" className="btn-primary text-base px-8 py-3.5 rounded-xl" style={{background:'linear-gradient(135deg,#059669,#16a34a)'}}><FaSeedling/> Plan My Farm <FaArrowRight className="w-3 h-3"/></Link>
          <Link to="/crops" className="btn-secondary text-base px-8 py-3.5 rounded-xl">Explore 16 Crops</Link>
        </div>
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 text-left max-w-3xl mx-auto">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4"><FaChartPie className="text-emerald-400 mb-2"/><div className="text-sm font-semibold text-white">Portfolio Optimization</div><div className="text-xs text-slate-400">Land allocation, not just recommendation</div></div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4"><FaFlask className="text-cyan-400 mb-2"/><div className="text-sm font-semibold text-white">What-If Simulator</div><div className="text-xs text-slate-400">Drought, price crash, scarcity</div></div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4"><FaWater className="text-blue-400 mb-2"/><div className="text-sm font-semibold text-white">Digital Twin</div><div className="text-xs text-slate-400">Your farm, modeled digitally</div></div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4"><FaShieldAlt className="text-amber-400 mb-2"/><div className="text-sm font-semibold text-white">Risk & Glut Alerts</div><div className="text-xs text-slate-400">Oversupply detection</div></div>
        </div>
      </motion.div>
    </section>

    {stats && (
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat value={`${stats.total_crops} Crops`} label="In Database" />
        <Stat value={`₹${Number(stats.avg_profit_per_acre).toLocaleString('en-IN')}`} label="Avg Profit / Acre" />
        <Stat value="HiGHS + Greedy" label="Optimization Engine" />
        <Stat value="Rabi • Kharif • Zaid" label="Seasons Covered" />
      </section>
    )}

    <section className="grid md:grid-cols-3 gap-6">
      {[
        {icon:FaMapMarkedAlt,title:'Farm Digital Twin',desc:'Land, soil, water, budget, location, season — your farm digitized to experiment safely before sowing.',to:'/planner'},
        {icon:FaChartPie,title:'Crop Portfolio Optimizer',desc:'Maximize risk-adjusted profit under real constraints. Linear Programming (HiGHS) + heuristic fallback.',to:'/planner'},
        {icon:FaRupeeSign,title:'Profit & Revenue Forecast',desc:'Revenue = Yield × Price • Profit = Revenue − Cost • confidence & sustainability scores.',to:'/planner'},
      ].map((c,i)=>(
        <Link to={c.to} key={i} className="glass-card p-6 hover:border-emerald-500/40 transition-colors group">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center mb-4 group-hover:bg-emerald-500/25"><c.icon className="text-emerald-400"/></div>
          <h3 className="font-semibold text-white mb-2">{c.title}</h3><p className="text-sm text-slate-400 leading-relaxed">{c.desc}</p>
        </Link>
      ))}
    </section>

    <section className="glass-card p-8 md:p-10 rounded-3xl border-emerald-500/20" style={{background:'linear-gradient(135deg, rgba(16,185,129,0.12), rgba(6,182,212,0.08))'}}>
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div><h2 className="text-2xl font-bold text-white mb-2">Ready to plan your season?</h2><p className="text-slate-400">Enter your farm details and get an explainable plan with acres, profit, water use & risk.</p></div>
        <Link to="/planner" className="btn-primary px-8 py-3 rounded-xl whitespace-nowrap" style={{background:'linear-gradient(135deg,#059669,#16a34a)'}}>Start Optimizing →</Link>
      </div>
    </section>

    <section className="text-xs text-slate-500 text-center border-t border-white/5 pt-6">KhetOptima is a decision-support platform. Recommendations are estimates, not guaranteed outcomes. • MSP & market data for 2024-26.</section>
  </div>
  );
}
