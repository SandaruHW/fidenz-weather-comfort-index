const BASE_URL = 'http://localhost:5001';

export const fetchWeather = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/weather`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('API fetch error:', error);
    throw error;
  }
};