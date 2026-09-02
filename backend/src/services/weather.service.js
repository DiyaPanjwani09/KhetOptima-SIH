const config = require('../config/env');

const MOCK_WEATHER = {
  temperature: 28,
  humidity: 68,
  rainfall: 12,
  windSpeed: 14,
  condition: 'Partly Cloudy',
  icon: 'cloud-sun',
  forecast: [
    { day: 'Today', temp: 28, condition: 'Partly Cloudy', rainfall: 12 },
    { day: 'Tomorrow', temp: 30, condition: 'Sunny', rainfall: 0 },
    { day: 'Day 3', temp: 26, condition: 'Light Rain', rainfall: 25 },
    { day: 'Day 4', temp: 25, condition: 'Rainy', rainfall: 40 },
    { day: 'Day 5', temp: 27, condition: 'Cloudy', rainfall: 15 },
  ],
};

function getAdvisory(weather) {
  const advisories = [];
  if (weather.rainfall > 20) {
    advisories.push('Heavy rainfall expected. Delay irrigation and avoid spraying pesticides.');
  } else if (weather.rainfall > 5) {
    advisories.push('Moderate rainfall expected. Reduce irrigation for the next 2 days.');
  } else {
    advisories.push('Good conditions for irrigation. Ensure adequate water supply.');
  }

  if (weather.temperature > 35) {
    advisories.push('High temperature alert. Water crops in early morning or evening.');
  } else if (weather.temperature < 10) {
    advisories.push('Cold weather alert. Protect sensitive crops from frost damage.');
  } else {
    advisories.push('Favorable temperature for crop growth.');
  }

  if (weather.humidity > 80) {
    advisories.push('High humidity. Watch for fungal diseases. Ensure good air circulation.');
  } else if (weather.humidity < 30) {
    advisories.push('Low humidity. Increase irrigation frequency.');
  }

  if (weather.windSpeed > 25) {
    advisories.push('Strong winds expected. Secure tall crops and avoid spraying.');
  }

  return advisories;
}

async function getWeather(state) {
  if (config.weatherApiKey) {
    try {
      const fetch = (await import('node-fetch')).default;
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${state},IN&appid=${config.weatherApiKey}&units=metric`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        return {
          temperature: Math.round(data.main.temp),
          humidity: data.main.humidity,
          rainfall: data.rain ? data.rain['1h'] || 0 : 0,
          windSpeed: Math.round(data.wind.speed * 3.6),
          condition: data.weather[0].main,
          icon: data.weather[0].icon,
          forecast: MOCK_WEATHER.forecast,
          advisory: getAdvisory({
            temperature: Math.round(data.main.temp),
            humidity: data.main.humidity,
            rainfall: data.rain ? data.rain['1h'] || 0 : 0,
            windSpeed: Math.round(data.wind.speed * 3.6),
          }),
        };
      }
    } catch (e) {
      console.warn('Weather API failed, using mock data:', e.message);
    }
  }

  return {
    ...MOCK_WEATHER,
    advisory: getAdvisory(MOCK_WEATHER),
  };
}

module.exports = { getWeather };
