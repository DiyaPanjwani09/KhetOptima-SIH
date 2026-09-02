const listings = [
  {
    id: '1',
    type: 'product',
    category: 'seeds',
    name: 'HD-3226 Wheat Seeds',
    description: 'High-yielding wheat variety, suitable for Rabi season. Disease resistant and drought tolerant.',
    price: 2400,
    unit: 'per 50 kg',
    vendor: 'ABC Agri Supplies',
    location: 'Gwalior, MP',
    contact: '+91 98765 43210',
    availability: 'In Stock',
    image: null,
    createdAt: '2025-01-15',
  },
  {
    id: '2',
    type: 'product',
    category: 'seeds',
    name: 'Pusa Basmati Rice Seeds',
    description: 'Premium basmati rice seeds. Long grain, aromatic. Best for Kharif season.',
    price: 3200,
    unit: 'per 50 kg',
    vendor: 'Punjab Seeds Co.',
    location: 'Ludhiana, Punjab',
    contact: '+91 98123 45678',
    availability: 'In Stock',
    image: null,
    createdAt: '2025-01-20',
  },
  {
    id: '3',
    type: 'product',
    category: 'seeds',
    name: 'Mustard Seeds (RLC-3)',
    description: 'High oil content mustard seeds. Ideal for Rabi season in northern India.',
    price: 1800,
    unit: 'per 10 kg',
    vendor: 'Bihar Agro Center',
    location: 'Patna, Bihar',
    contact: '+91 99345 67890',
    availability: 'In Stock',
    image: null,
    createdAt: '2025-02-01',
  },
  {
    id: '4',
    type: 'product',
    category: 'fertilizers',
    name: 'NPK 20:20:0:13 Fertilizer',
    description: 'Balanced NPK fertilizer for general crop nutrition. Suitable for most crops.',
    price: 850,
    unit: 'per 50 kg',
    vendor: 'Krishna Fertilizers',
    location: 'Indore, MP',
    contact: '+91 98234 56789',
    availability: 'In Stock',
    image: null,
    createdAt: '2025-01-25',
  },
  {
    id: '5',
    type: 'product',
    category: 'fertilizers',
    name: 'Organic Vermicompost',
    description: 'Premium organic vermicompost. Improves soil health and water retention.',
    price: 400,
    unit: 'per 50 kg',
    vendor: 'Green Earth Farms',
    location: 'Nashik, Maharashtra',
    contact: '+91 97654 32109',
    availability: 'In Stock',
    image: null,
    createdAt: '2025-02-05',
  },
  {
    id: '6',
    type: 'service',
    category: 'equipment',
    name: 'Tractor on Rent',
    description: 'Mahindra Arjun 555 tractor available for ploughing, sowing and harvesting.',
    price: 1200,
    unit: 'per hour',
    vendor: 'Singh Farm Services',
    location: 'Kanpur, UP',
    contact: '+91 98712 34567',
    availability: 'Available',
    image: null,
    createdAt: '2025-01-10',
  },
  {
    id: '7',
    type: 'service',
    category: 'services',
    name: 'Soil Testing Service',
    description: 'Complete soil testing with NPK, pH, micronutrients and fertilizer recommendation.',
    price: 500,
    unit: 'per sample',
    vendor: 'AgriLab Solutions',
    location: 'Jaipur, Rajasthan',
    contact: '+91 98987 65432',
    availability: 'Available',
    image: null,
    createdAt: '2025-02-10',
  },
  {
    id: '8',
    type: 'service',
    category: 'services',
    name: 'Crop Spraying Service',
    description: 'Drone-based crop spraying service. Covers 10 acres per hour. Pesticides included.',
    price: 300,
    unit: 'per acre',
    vendor: 'AgroDrone Tech',
    location: 'Hyderabad, Telangana',
    contact: '+91 96543 21098',
    availability: 'Available',
    image: null,
    createdAt: '2025-02-15',
  },
  {
    id: '9',
    type: 'product',
    category: 'seeds',
    name: 'Hybrid Maize Seeds',
    description: 'High-yielding hybrid maize. Suitable for Kharif season. 60-65 days duration.',
    price: 1600,
    unit: 'per 5 kg',
    vendor: 'Deccan Seeds',
    location: 'Pune, Maharashtra',
    contact: '+91 95432 10987',
    availability: 'In Stock',
    image: null,
    createdAt: '2025-02-20',
  },
  {
    id: '10',
    type: 'service',
    category: 'equipment',
    name: 'Seed Drill Rental',
    description: 'Precision seed drill for wheat, rice, soybean. Efficient seed placement.',
    price: 800,
    unit: 'per acre',
    vendor: 'Modern Agri Equipment',
    location: 'Bhopal, MP',
    contact: '+91 94321 09876',
    availability: 'Available',
    image: null,
    createdAt: '2025-02-25',
  },
];

function getProducts(filters = {}) {
  let result = listings.filter((l) => l.type === 'product');
  if (filters.category) result = result.filter((l) => l.category === filters.category);
  if (filters.location) result = result.filter((l) => l.location.toLowerCase().includes(filters.location.toLowerCase()));
  if (filters.search) {
    const s = filters.search.toLowerCase();
    result = result.filter((l) => l.name.toLowerCase().includes(s) || l.description.toLowerCase().includes(s));
  }
  return result;
}

function getServices(filters = {}) {
  let result = listings.filter((l) => l.type === 'service');
  if (filters.category) result = result.filter((l) => l.category === filters.category);
  if (filters.location) result = result.filter((l) => l.location.toLowerCase().includes(filters.location.toLowerCase()));
  if (filters.search) {
    const s = filters.search.toLowerCase();
    result = result.filter((l) => l.name.toLowerCase().includes(s) || l.description.toLowerCase().includes(s));
  }
  return result;
}

function getListing(id) {
  return listings.find((l) => l.id === id) || null;
}

function addListing(data) {
  const listing = {
    id: String(listings.length + 1),
    ...data,
    createdAt: new Date().toISOString().split('T')[0],
  };
  listings.push(listing);
  return listing;
}

module.exports = { getProducts, getServices, getListing, addListing };
