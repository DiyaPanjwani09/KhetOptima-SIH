import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSeedling, FaChartLine, FaCloudSun, FaStore } from 'react-icons/fa';
import { khetApi } from '../services/khetApi';

export default function KhetHome() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    khetApi.stats().then((r) => setStats(r.data)).catch(() => {});
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <section className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          AI-Powered Farm Decision Platform
        </h1>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto mb-6">
          Optimize your crop portfolio, simulate scenarios, and make informed farming decisions.
        </p>
        <div className="flex justify-center gap-3">
          <Link to="/planner" className="btn-primary">
            Plan My Farm
          </Link>
          <Link to="/crops" className="btn-secondary">
            Explore Crops
          </Link>
        </div>
      </section>

      {stats && (
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="card text-center">
            <div className="stat-value">{stats.totalCrops}</div>
            <div className="stat-label">Crops in Database</div>
          </div>
          <div className="card text-center">
            <div className="stat-value">4</div>
            <div className="stat-label">Seasons Covered</div>
          </div>
          <div className="card text-center">
            <div className="stat-value">15</div>
            <div className="stat-label">States Mapped</div>
          </div>
          <div className="card text-center">
            <div className="stat-value">6</div>
            <div className="stat-label">Soil Types</div>
          </div>
        </section>
      )}

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Link to="/planner" className="card-hover">
          <FaSeedling className="text-green-600 text-2xl mb-3" />
          <h3 className="font-semibold text-gray-900 mb-1">Crop Portfolio Optimizer</h3>
          <p className="text-sm text-gray-500">
            Get AI-recommended crop allocation based on your land, budget, and risk preference.
          </p>
        </Link>
        <Link to="/simulator" className="card-hover">
          <FaChartLine className="text-green-600 text-2xl mb-3" />
          <h3 className="font-semibold text-gray-900 mb-1">What-If Simulator</h3>
          <p className="text-sm text-gray-500">
            Test how drought, price changes, or budget cuts affect your farm profitability.
          </p>
        </Link>
        <Link to="/weather" className="card-hover">
          <FaCloudSun className="text-green-600 text-2xl mb-3" />
          <h3 className="font-semibold text-gray-900 mb-1">Weather & Advisory</h3>
          <p className="text-sm text-gray-500">
            Get weather forecasts and farming advice for your region.
          </p>
        </Link>
      </section>

      <section className="card bg-green-50 border-green-200">
        <h3 className="section-title mb-2">About KhetOptima</h3>
        <p className="text-sm text-gray-600 mb-3">
          KhetOptima helps Indian farmers make data-driven decisions about crop selection, land allocation,
          and resource management. Our optimization engine considers soil type, water availability, budget
          constraints, market prices, and risk tolerance to recommend the most profitable crop portfolio.
        </p>
        <p className="text-xs text-gray-400">
          Decision-support tool only. Estimates are based on models and available data, not guaranteed outcomes.
        </p>
      </section>
    </div>
  );
}
