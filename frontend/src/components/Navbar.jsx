import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSeedling, FaBars, FaTimes, FaHome, FaLeaf, FaFlask, FaStore, FaChartPie } from 'react-icons/fa';

const navItems = [
  { path: '/', label: 'Home', icon: FaHome },
  { path: '/planner', label: 'Planner', icon: FaChartPie },
  { path: '/simulator', label: 'What-If', icon: FaFlask },
  { path: '/crops', label: 'Crops', icon: FaLeaf },
  { path: '/market', label: 'Market', icon: FaStore },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);
  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#0a0a1a]/90 backdrop-blur-xl border-b border-emerald-500/20 shadow-glass' : 'bg-[#0a0a1a]/60 backdrop-blur-md border-b border-white/5'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative w-9 h-9 flex-shrink-0">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-emerald-500 to-green-700 opacity-90 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-0 rounded-xl flex items-center justify-center">
                <FaSeedling className="text-white w-5 h-5" />
              </div>
            </div>
            <span className="hidden sm:block font-heading font-bold text-sm text-white leading-tight">
              KhetOptima <span className="text-emerald-400">🌾</span>
            </span>
            <span className="hidden lg:block text-[10px] text-emerald-300/70 font-medium border border-emerald-500/20 rounded-full px-2 py-0.5 ml-1">Simulate • Optimize • Grow</span>
          </Link>
          <div className="hidden md:flex items-center gap-1">
            {navItems.map(item => {
              const active = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path} className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${active ? 'text-emerald-300 bg-emerald-500/15' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                  <item.icon className={`w-3.5 h-3.5 ${active ? 'text-emerald-400' : ''}`} />
                  {item.label}
                  {active && <motion.div layoutId="nav-indicator" className="absolute inset-0 rounded-lg border border-emerald-500/30" transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }} />}
                </Link>
              );
            })}
          </div>
          <div className="flex items-center gap-2">
            <Link to="/planner" className="hidden sm:inline-flex btn-primary py-2 px-4 text-sm" style={{background:'linear-gradient(135deg,#059669,#16a34a)'}}>
              <FaSeedling className="w-3.5 h-3.5" /> Optimize Farm
            </Link>
            <button onClick={() => setMobileOpen(o=>!o)} className="md:hidden p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10">
              {mobileOpen ? <FaTimes className="w-4 h-4 text-white" /> : <FaBars className="w-4 h-4 text-slate-400" />}
            </button>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="md:hidden overflow-hidden border-t border-white/5 bg-[#0a0a1a]/95 backdrop-blur-xl">
            <div className="px-4 py-3 flex flex-col gap-1">
              {navItems.map(item => {
                const active = location.pathname === item.path;
                return (
                  <Link key={item.path} to={item.path} onClick={()=>setMobileOpen(false)} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${active ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/25' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                    <item.icon className="w-4 h-4" />{item.label}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
