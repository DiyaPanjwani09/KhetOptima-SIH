const express = require('express');
const cors = require('cors');
const config = require('./config/env');

const optimizationRoutes = require('./routes/optimization.routes');
const cropRoutes = require('./routes/crop.routes');
const marketRoutes = require('./routes/market.routes');
const marketplaceRoutes = require('./routes/marketplace.routes');
const weatherRoutes = require('./routes/weather.routes');
const simulationRoutes = require('./routes/simulation.routes');
const advisoryRoutes = require('./routes/advisory.routes');

const { errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(cors({ origin: config.corsOrigin, credentials: true }));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', version: '2.0.0', service: 'khetoptima-backend' });
});

app.use('/api/crops', cropRoutes);
app.use('/api/optimization', optimizationRoutes);
app.use('/api/simulation', simulationRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/advisory', advisoryRoutes);

app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`KhetOptima backend running on port ${config.port}`);
  console.log(`ML Service URL: ${config.mlServiceUrl}`);
});
