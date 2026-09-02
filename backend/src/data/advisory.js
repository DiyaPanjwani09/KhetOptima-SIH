const advisoryData = [
  {
    id: '1',
    category: 'irrigation',
    title: 'Optimal Irrigation Scheduling',
    content: 'For Rabi crops like wheat and mustard, irrigate at critical growth stages: crown root initiation (20-25 DAS), tillering (40-45 DAS), flowering (60-65 DAS), and grain filling (80-85 DAS). Avoid over-watering.',
    season: 'Rabi',
  },
  {
    id: '2',
    category: 'irrigation',
    title: 'Water Conservation Techniques',
    content: 'Use drip irrigation for vegetable crops to save 40-60% water. Mulching with crop residue reduces evaporation by 25-30%. contour farming helps retain rainwater.',
    season: 'All',
  },
  {
    id: '3',
    category: 'crop_management',
    title: 'Wheat Sowing Guidelines',
    content: 'Sow wheat by mid-November for optimal yield. Use seed rate of 100-125 kg/ha. Maintain row spacing of 20-23 cm. Ensure seed depth of 5-6 cm.',
    season: 'Rabi',
  },
  {
    id: '4',
    category: 'crop_management',
    title: 'Rice Transplanting Tips',
    content: 'Transplant rice seedlings at 20-25 days after sowing. Maintain 2-3 seedlings per hill. Space rows 15-20 cm apart. Keep 2-3 cm standing water in field.',
    season: 'Kharif',
  },
  {
    id: '5',
    category: 'weather',
    title: 'Monsoon Preparedness',
    content: 'Before monsoon: clean drainage channels, prepare bunds, store seeds and fertilizers in dry place. During heavy rain: stop irrigation, ensure field drainage.',
    season: 'Kharif',
  },
  {
    id: '6',
    category: 'weather',
    title: 'Frost Protection',
    content: 'During cold waves: irrigate fields in evening to retain heat. Use straw mulch around sensitive crops. Avoid sowing in low-lying frost-prone areas.',
    season: 'Rabi',
  },
  {
    id: '7',
    category: 'soil',
    title: 'Soil Health Management',
    content: 'Test soil every 2-3 years. Maintain pH 6.0-7.5 for most crops. Add organic matter annually. Practice crop rotation to prevent nutrient depletion.',
    season: 'All',
  },
  {
    id: '8',
    category: 'soil',
    title: 'Black Cotton Soil Tips',
    content: 'Black soil is ideal for cotton, soybean, and pulses. Ensure proper drainage as it retains moisture. Add gypsum to improve structure if soil is too sticky.',
    season: 'All',
  },
  {
    id: '9',
    category: 'market',
    title: 'Market Price Trends',
    content: 'Wheat MSP for 2025-26 is Rs 2,425/quintal. Monitor mandi prices before selling. Store produce if prices are low during harvest season.',
    season: 'All',
  },
  {
    id: '10',
    category: 'market',
    title: 'Glut Risk Awareness',
    content: 'Tomato, potato, and onion often face oversupply during peak harvest. Consider staggered sowing or value addition (drying, processing) to avoid price crash.',
    season: 'All',
  },
];

function getAdvisory(category = null, season = null) {
  let result = advisoryData;
  if (category) result = result.filter((a) => a.category === category);
  if (season) result = result.filter((a) => a.season === season || a.season === 'All');
  return result;
}

module.exports = { getAdvisory };
