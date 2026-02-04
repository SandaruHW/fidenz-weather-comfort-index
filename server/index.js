require('dotenv').config();
const express = require('express');
const axios = require('axios');
const NodeCache = require('node-cache');
const cors = require('cors');

const { calculateComfortScore } = require('./services/comfortScore');
const cities = require('./data/cities.json');
const app = express();
// Cache with 5-minute TTL for weather data
const cache = new NodeCache({ stdTTL: 300 }); 
app.use(cors());
app.use(express.json());

const API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

app.get('/api/weather', async (req, res) => {
  // Check for cached processed results first (fastest response)
  const cacheKey = 'processed_weather_all'; 
  const cachedProcessed = cache.get(cacheKey);

  if (cachedProcessed) {
    return res.json({
      data: cachedProcessed,
      source: 'cache',
      cacheHit: true,
      timestamp: new Date().toISOString()
    });
  }

  try {
    const results = [];

    for (const city of cities) {
      // Check individual city cache to avoid unnecessary API calls
      const rawCacheKey = `raw_weather_${city.id}`;
      let cityWeather = cache.get(rawCacheKey);

      if (!cityWeather) {
        const url = `${BASE_URL}?id=${city.id}&appid=${API_KEY}&units=metric`;
        try {
          const response = await axios.get(url);
          cityWeather = response.data;
          cache.set(rawCacheKey, cityWeather); // cache raw API response per city
        } catch (fetchErr) {
          console.error(`Failed to fetch weather for ${city.name} (id ${city.id}):`, fetchErr.message);
          continue; // Skip failed cities to prevent total request failure
        }
      }

      // Calculate weather comfort score based on temp, humidity, wind, cloudiness
      const score = calculateComfortScore(cityWeather);

      results.push({
        name: cityWeather.name || city.name,
        country: city.country,                
        countryCode: city.countryCode,
        description: cityWeather.weather?.[0]?.description || 'unknown',
        temp: Math.round(cityWeather.main?.temp || 0),
        score,
        humidity: cityWeather.main?.humidity,
        windSpeed: cityWeather.wind?.speed,
        cloudiness: cityWeather.clouds?.all
      });
    }

    // Sort by comfort score: highest (most comfortable) first
    results.sort((a, b) => b.score - a.score);

    // Assign ranks: 1 = most comfortable city
    results.forEach((item, index) => {
      item.rank = index + 1;
    });

    // Cache the complete processed and ranked results
    cache.set(cacheKey, results);

    res.json({
      data: results,
      source: 'api',
      cacheHit: false,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('Error in /api/weather:', err.message);
    res.status(500).json({ error: 'Failed to process weather data' });
  }
});

// Debug endpoint to monitor cache performance and status
app.get('/api/cache-status', (req, res) => {
  const keys = cache.keys();
  const rawKeys = keys.filter(k => k.startsWith('raw_weather_'));
  const processedExists = cache.has('processed_weather_all');

  res.json({
    totalCachedItems: keys.length,
    rawCityCachesCount: rawKeys.length,
    processedCacheExists: processedExists,
    stats: cache.getStats(),
    ttlSeconds: 300,
    exampleKeys: keys.slice(0, 5) // first 5 keys for debug
  });
});

app.get('/', (req, res) => {
  res.json({
    message: 'Weather API is running',
    citiesLoaded: cities.length,
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Loaded ${cities.length} cities from data/cities.json`);
});