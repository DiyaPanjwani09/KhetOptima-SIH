import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaSeedling, FaBars, FaTimes } from 'react-icons/fa';

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/planner', label: 'Farm Planner' },
  { path: '/simulator', label: 'Simulator' },
  { path: '/crops', label: 'Crops' },
  { path: '/market', label: 'Market' },
  { path: '/marketplace', label: 'Marketplace' },
  { path: '/weather', label: 'Weather' },
  { path: '/advisory', label: 'Advisory' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <Link to="/" className="flex items-center gap-2 text-green-700 font-bold text-lg">
            <FaSeedling className="text-green-600" />
            KhetOptima
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                  location.pathname === item.path
                    ? 'bg-green-50 text-green-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link to="/planner" className="btn-primary btn-sm ml-2">
              Plan My Farm
            </Link>
          </div>

          <button
            className="md:hidden p-2 text-gray-600"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden pb-3 border-t border-gray-100">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`block px-3 py-2 text-sm rounded-md ${
                  location.pathname === item.path
                    ? 'bg-green-50 text-green-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link to="/planner" onClick={() => setMobileOpen(false)} className="block mx-3 mt-2 btn-primary text-center text-sm">
              Plan My Farm
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
