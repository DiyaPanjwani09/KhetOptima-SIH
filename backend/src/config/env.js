require('dotenv').config();

module.exports = {
  port: parseInt(process.env.PORT, 10) || 3001,
  mlServiceUrl: process.env.ML_SERVICE_URL || 'http://localhost:8000',
  weatherApiKey: process.env.WEATHER_API_KEY || '',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  nodeEnv: process.env.NODE_ENV || 'development',
};
