import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';

const KhetHome = lazy(() => import('./pages/KhetHome'));
const Planner = lazy(() => import('./pages/Planner'));
const Simulator = lazy(() => import('./pages/Simulator'));
const Crops = lazy(() => import('./pages/Crops'));
const Market = lazy(() => import('./pages/Market'));
const Marketplace = lazy(() => import('./pages/Marketplace'));
const Weather = lazy(() => import('./pages/Weather'));
const Advisory = lazy(() => import('./pages/Advisory'));

function Loading() {
  return (
    <div className="flex justify-center items-center py-24">
      <div className="loading-spinner"></div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main>
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path="/" element={<KhetHome />} />
              <Route path="/planner" element={<Planner />} />
              <Route path="/simulator" element={<Simulator />} />
              <Route path="/crops" element={<Crops />} />
              <Route path="/market" element={<Market />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/weather" element={<Weather />} />
              <Route path="/advisory" element={<Advisory />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </BrowserRouter>
  );
}
