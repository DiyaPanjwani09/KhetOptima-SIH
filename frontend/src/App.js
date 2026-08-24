import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar.jsx';
import ErrorBoundary from './components/ErrorBoundary';

const KhetHome = lazy(() => import('./pages/KhetHome.jsx'));
const Planner = lazy(() => import('./pages/Planner.jsx'));
const Simulator = lazy(() => import('./pages/Simulator.jsx'));
const Crops = lazy(() => import('./pages/Crops.jsx'));
const Market = lazy(() => import('./pages/Market.jsx'));

function LoadingFallback(){return(<div className="flex flex-col items-center justify-center py-32 space-y-4"><div className="spinner"/><p className="text-slate-400 text-sm animate-pulse">Loading KhetOptima...</p></div>);}

export default function App(){
  return(
    <ErrorBoundary>
      <Router>
        <div className="bg-mesh" aria-hidden="true"/>
        <div className="min-h-screen text-slate-100">
          <Navbar/>
          <main className="pt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
              <Suspense fallback={<LoadingFallback/>}>
                <Routes>
                  <Route path="/" element={<KhetHome/>}/>
                  <Route path="/planner" element={<Planner/>}/>
                  <Route path="/simulator" element={<Simulator/>}/>
                  <Route path="/crops" element={<Crops/>}/>
                  <Route path="/market" element={<Market/>}/>
                  <Route path="*" element={<Navigate to="/" replace/>}/>
                </Routes>
              </Suspense>
            </div>
          </main>
        </div>
        <Toaster position="top-right" toastOptions={{style:{background:'rgba(13,13,24,0.95)',border:'1px solid rgba(16,185,129,0.3)',color:'#f1f5f9',backdropFilter:'blur(12px)',borderRadius:'12px',fontSize:'0.875rem'}, success:{iconTheme:{primary:'#10b981',secondary:'#f1f5f9'}}, error:{iconTheme:{primary:'#ef4444',secondary:'#f1f5f9'}}}}/>
      </Router>
    </ErrorBoundary>
  );
}
