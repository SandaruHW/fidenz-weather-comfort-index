import { useState, useEffect } from 'react';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import WeatherIcon from './components/WeatherIcon';
import Badge from './components/Badge';

function App() {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:5001/api/weather');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setCities(json.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Comfort badge styling
  const getComfortStyle = (score) => {
    if (score >= 80) return { bg: 'bg-green-100', text: 'text-green-800', label: 'Most Comfortable' };
    if (score >= 70) return { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Very Comfortable' };
    if (score >= 55) return { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Comfortable' };
    return { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Less Comfortable' };
  };

  return (
    <div className="min-h-screen text-gray-900 bg-gray-50 dark:bg-gray-900 dark:text-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm dark:bg-gray-800">
        <div className="flex items-center justify-between px-4 py-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-indigo-600 md:text-3xl dark:text-indigo-400">
            Weather Comfort Dashboard
          </h1>
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 text-white transition bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            <ArrowPathIcon className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </header>

      {/* Tabs */}
      <nav className="bg-white border-b dark:bg-gray-800">
        <div className="px-4 mx-auto max-w-7xl">
          <div className="flex py-4 space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-2 px-1 font-medium ${
                activeTab === 'overview'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('rankings')}
              className={`pb-2 px-1 font-medium ${
                activeTab === 'rankings'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Rankings
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-b-2 border-indigo-600 rounded-full animate-spin"></div>
          </div>
        )}

        {error && (
          <div className="px-6 py-4 text-center text-red-700 border border-red-200 rounded-lg bg-red-50 dark:bg-red-900/30 dark:border-red-800 dark:text-red-300">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            {activeTab === 'overview' && (
              <div>
                <h2 className="mb-6 text-2xl font-bold">City Weather Overview</h2>
                <p className="mb-8 text-gray-600 dark:text-gray-400">
                  Real-time comfort index rankings for major cities
                </p>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {cities.map((city) => {
                    const style = getComfortStyle(city.score);
                    return (
                      <div
                        key={city.name}
                        className="overflow-hidden transition bg-white shadow-md dark:bg-gray-800 rounded-xl hover:shadow-lg"
                      >
                        <div className={`px-4 py-2 text-center font-bold text-white text-sm ${
                          city.rank === 1 ? 'bg-green-600' : city.rank <= 3 ? 'bg-blue-600' : 'bg-gray-600'
                        }`}>
                          #{city.rank}
                        </div>
                        <div className="p-6 text-center">
                          <WeatherIcon description={city.description} className="w-16 h-16 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold">{city.name}, {city.country}</h3>
                          <p className="mb-3 text-sm text-gray-500 capitalize dark:text-gray-400">{city.description}</p>
                          <div className="mb-2 text-4xl font-bold">{city.temp}°C</div>
                          <Badge className="mb-4">
                            Comfort Index {city.score}
                          </Badge>
                          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
                            <div>Humidity: {city.humidity}%</div>
                            <div>Wind: {Math.round(city.windSpeed * 3.6)} km/h</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'rankings' && (
              <div>
                <h2 className="mb-6 text-2xl font-bold">City Rankings & Analytics</h2>
                <div className="overflow-x-auto bg-white shadow dark:bg-gray-800 rounded-xl">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                      <tr>
                        <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">Rank</th>
                        <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">City</th>
                        <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">Temp (°C)</th>
                        <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">Humidity (%)</th>
                        <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">Wind (km/h)</th>
                        <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase dark:text-gray-400">Comfort Index</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {cities.map((city) => (
                        <tr key={city.name} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                              city.rank === 1 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                              city.rank <= 3 ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                              'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                            }`}>
                              {city.rank}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-medium whitespace-nowrap">{city.name}, {city.country}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{city.temp}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{city.humidity}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{Math.round(city.windSpeed * 3.6)}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge>{city.score}</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;