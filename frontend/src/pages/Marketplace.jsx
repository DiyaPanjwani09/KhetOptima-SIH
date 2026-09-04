import React, { useState, useEffect } from 'react';
import { khetApi } from '../services/khetApi';

const CATEGORIES = {
  products: [
    { value: 'seeds', label: 'Seeds' },
    { value: 'fertilizers', label: 'Fertilizers & Inputs' },
  ],
  services: [
    { value: 'equipment', label: 'Farm Equipment' },
    { value: 'services', label: 'Agricultural Services' },
  ],
};

export default function Marketplace() {
  const [tab, setTab] = useState('products');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ type: 'product', category: 'seeds', name: '', description: '', price: '', unit: '', vendor: '', location: '', contact: '', availability: 'In Stock' });

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (category) params.category = category;
    const api = tab === 'products' ? khetApi.getProducts : khetApi.getServices;
    api(params)
      .then((r) => setItems(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [tab, search, category]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await khetApi.createListing({ ...form, price: Number(form.price), type: tab === 'products' ? 'product' : 'service' });
      setShowForm(false);
      setForm({ type: 'product', category: 'seeds', name: '', description: '', price: '', unit: '', vendor: '', location: '', contact: '', availability: 'In Stock' });
      setLoading(true);
      const api = tab === 'products' ? khetApi.getProducts : khetApi.getServices;
      const r = await api({});
      setItems(r.data);
    } catch (err) {
      alert('Failed to create listing');
    }
  };

  const cats = CATEGORIES[tab] || [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="page-title mb-1">Marketplace</h1>
          <p className="page-subtitle">Buy seeds, equipment, fertilizers, and farming services</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary btn-sm">
          + List Product
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        <button onClick={() => { setTab('products'); setCategory(''); }} className={`btn-sm ${tab === 'products' ? 'btn-primary' : 'btn-secondary'}`}>Products</button>
        <button onClick={() => { setTab('services'); setCategory(''); }} className={`btn-sm ${tab === 'services' ? 'btn-primary' : 'btn-secondary'}`}>Services</button>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="input-field w-48" />
        {cats.map((c) => (
          <button key={c.value} onClick={() => setCategory(category === c.value ? '' : c.value)} className={`btn-sm ${category === c.value ? 'btn-primary' : 'btn-secondary'}`}>
            {c.label}
          </button>
        ))}
      </div>

      {showForm && (
        <div className="card mb-6">
          <h3 className="section-title mb-3">List Your Product/Service</h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="form-grid">
              <div>
                <label className="label">Name *</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" required />
              </div>
              <div>
                <label className="label">Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field">
                  {cats.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Price (INR) *</label>
                <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="input-field" required min="0" />
              </div>
              <div>
                <label className="label">Unit</label>
                <input type="text" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} className="input-field" placeholder="per 50 kg, per acre, etc." />
              </div>
              <div>
                <label className="label">Vendor/Business Name *</label>
                <input type="text" value={form.vendor} onChange={(e) => setForm({ ...form, vendor: e.target.value })} className="input-field" required />
              </div>
              <div>
                <label className="label">Location</label>
                <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="input-field" placeholder="City, State" />
              </div>
              <div>
                <label className="label">Contact</label>
                <input type="text" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} className="input-field" placeholder="Phone number" />
              </div>
              <div>
                <label className="label">Availability</label>
                <select value={form.availability} onChange={(e) => setForm({ ...form, availability: e.target.value })} className="input-field">
                  <option>In Stock</option>
                  <option>Available</option>
                  <option>Limited</option>
                </select>
              </div>
            </div>
            <div>
              <label className="label">Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field" rows="2" />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="btn-primary">Submit Listing</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12"><div className="loading-spinner"></div></div>
      ) : items.length === 0 ? (
        <div className="card empty-state">No listings found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div key={item.id} className="card-hover cursor-pointer" onClick={() => setSelected(item)}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-gray-900">{item.name}</h3>
                  <div className="text-sm text-gray-500">{item.vendor}</div>
                </div>
                <span className="badge badge-green">{item.availability}</span>
              </div>
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.description}</p>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-green-700">₹{item.price?.toLocaleString()} {item.unit && `/ ${item.unit}`}</span>
                <span className="text-xs text-gray-400">{item.location}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-lg p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-semibold text-lg mb-2">{selected.name}</h3>
            <div className="text-sm text-gray-500 mb-3">{selected.vendor} &middot; {selected.location}</div>
            <p className="text-sm text-gray-600 mb-3">{selected.description}</p>
            <div className="space-y-1 text-sm mb-4">
              <div><span className="text-gray-500">Price:</span> ₹{selected.price?.toLocaleString()} {selected.unit && `/ ${selected.unit}`}</div>
              <div><span className="text-gray-500">Availability:</span> {selected.availability}</div>
              {selected.contact && <div><span className="text-gray-500">Contact:</span> {selected.contact}</div>}
            </div>
            <div className="flex gap-2">
              <a href={selected.contact ? `tel:${selected.contact}` : '#'} className="btn-primary btn-sm">Contact Vendor</a>
              <button onClick={() => setSelected(null)} className="btn-secondary btn-sm">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
