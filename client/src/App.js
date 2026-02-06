import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import WeatherIcon from './components/WeatherIcon';
import ProtectedRoute from './components/ProtectedRoute';
import AuthenticationButton from './components/AuthenticationButton';
import UserProfile from './components/UserProfile';
import ThemeToggle from './components/ThemeToggle';

function App() {
  const { isAuthenticated } = useAuth0();

  // Show authentication flow for non-authenticated users
  if (!isAuthenticated) {
    return <ProtectedRoute><WeatherDashboard /></ProtectedRoute>;
  }

  return <WeatherDashboard />;
}

function WeatherDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch cities data from API
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5001/api/weather');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      setCities(data.data || data || []);
    } catch (err) {
      setError(err.message || 'Failed to load weather data');
      console.error('Error fetching weather data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Helper function to get comfort label based on score
  const getComfortLabel = (score) => {
    if (score >= 85) return 'Most Comfortable';
    if (score >= 70) return 'Very Comfortable';
    if (score >= 55) return 'Comfortable';
    return 'Less Comfortable';
  };

  const getComfortColors = (score) => {
    const label = getComfortLabel(score);
    switch (label) {
      case 'Most Comfortable': return { bg: 'bg-green-100 dark:bg-green-900/40', text: 'text-green-800 dark:text-green-300', border: 'border-green-200 dark:border-green-700', label };
      case 'Very Comfortable': return { bg: 'bg-blue-100 dark:bg-blue-900/40', text: 'text-blue-800 dark:text-blue-300', border: 'border-blue-200 dark:border-blue-700', label };
      case 'Comfortable': return { bg: 'bg-yellow-100 dark:bg-yellow-900/40', text: 'text-yellow-800 dark:text-yellow-300', border: 'border-yellow-200 dark:border-yellow-700', label };
      default: return { bg: 'bg-red-100 dark:bg-red-900/40', text: 'text-red-800 dark:text-red-300', border: 'border-red-200 dark:border-red-700', label };
    }
  };

  const getRankBadgeColor = (rank) => {
    if (rank === 1) return 'bg-green-500';
    if (rank <= 3) return 'bg-blue-500';
    if (rank <= 5) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="min-h-screen transition-colors duration-200 bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white shadow-sm dark:bg-gray-800 dark:shadow-gray-700/30">
        <div className="flex items-center justify-between px-6 py-4 mx-auto max-w-7xl">
          <h1 className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
            Weather Comfort Dashboard
          </h1>
          <div className="flex items-center gap-4">
            <button 
              onClick={fetchData}
              disabled={loading}
              className="p-2 text-gray-400 transition-colors hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 disabled:opacity-50"
              title="Refresh data"
            >
              <svg className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            <ThemeToggle />
            <UserProfile />
            <AuthenticationButton />
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
        <div className="px-6 mx-auto max-w-7xl">
          <div className="flex space-x-8">
            {['Overview', 'Rankings'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.toLowerCase()
                    ? 'border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-500'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="px-6 py-8 mx-auto max-w-7xl">
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-b-2 border-blue-600 rounded-full dark:border-blue-400 animate-spin"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading weather data...</p>
          </div>
        )}

        {error && (
          <div className="px-6 py-4 text-center text-red-700 border border-red-200 rounded-lg dark:text-red-300 dark:border-red-800 bg-red-50 dark:bg-red-900/30">
            <p className="font-medium">Error loading weather data</p>
            <p className="text-sm">{error}</p>
            <button 
              onClick={fetchData}
              className="px-4 py-2 mt-3 text-sm text-white bg-red-600 rounded hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            {activeTab === 'overview' && (
              <div>
                <div className="mb-2">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">City Weather Overview</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Real-time comfort index rankings for major cities</p>
                </div>
                
                {/* Top Performers Section */}
                <div className="mt-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🏆</span>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">Top Performers</h3>
                    </div>
                    <span className="px-3 py-1 text-sm font-bold text-white bg-orange-500 rounded-full dark:bg-orange-600">
                      GLOBAL TOP 3
                    </span>
                  </div>
                  <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">Cities with the highest comfort index scores</p>
                  
                  <div className="grid grid-cols-1 gap-4 mb-12 sm:grid-cols-2 lg:grid-cols-3">
                    {cities.slice(0, 3).map((city) => {
                      const comfortStyle = getComfortColors(city.score);
                      
                      return (
                        <div key={city.name || city.id} className="relative p-6 transition-all duration-300 shadow-sm bg-gray-50 dark:bg-gray-800 rounded-2xl hover:shadow-md dark:shadow-gray-700/30">
                          <div className="absolute top-4 left-4">
                            <div className={`${getRankBadgeColor(city.rank)} text-white text-sm font-bold w-8 h-8 rounded-full flex items-center justify-center shadow-sm`}>
                              #{city.rank}
                            </div>
                          </div>

                          <div className="flex justify-center mt-6 mb-4">
                            <WeatherIcon description={city.description || city.weather || 'sunny'} className="w-16 h-16" />
                          </div>

                          <h3 className="mb-3 text-xl font-bold text-center text-gray-900 dark:text-white">{city.name}</h3>

                          <div className="mb-4 text-4xl font-light text-center text-blue-500 dark:text-blue-400">
                            {city.temp}°C
                          </div>

                          <div className="mb-3 text-center">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Comfort Index</span>
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">{city.score}</div>
                          </div>

                          <div className="flex justify-center mb-6">
                            <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border-2 ${comfortStyle.bg} ${comfortStyle.text} ${comfortStyle.border}`}>
                              {comfortStyle.label}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm text-gray-500 dark:text-gray-400">
                            <div className="text-center">
                              <span className="block mb-1">Humidity</span>
                              <span className="font-semibold text-gray-900 dark:text-white">{city.humidity}%</span>
                            </div>
                            <div className="text-center">
                              <span className="block mb-1">Wind</span>
                              <span className="font-semibold text-gray-900 dark:text-white">{Math.round((city.windSpeed || city.wind || 0) * 3.6)} km/h</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Global Rankings Section */}
                {cities.length > 3 && (
                  <div>
                    <div className="flex items-center gap-2 mb-6">
                      <span className="text-2xl">🌍</span>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">Global Rankings</h3>
                    </div>
                    <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">Comprehensive comfort index across all cities</p>
                    
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {cities.slice(3).map((city) => {
                        const comfortStyle = getComfortColors(city.score);
                        return (
                          <div key={city.name || city.id} className="relative p-6 transition-all duration-300 shadow-sm bg-gray-50 dark:bg-gray-800 rounded-2xl hover:shadow-md dark:shadow-gray-700/30">
                            <div className="absolute top-4 left-4">
                              <div className={`${getRankBadgeColor(city.rank)} text-white text-sm font-bold w-8 h-8 rounded-full flex items-center justify-center shadow-sm`}>
                                #{city.rank}
                              </div>
                            </div>

                            <div className="flex justify-center mt-6 mb-4">
                              <WeatherIcon description={city.description || city.weather || 'sunny'} className="w-14 h-14" />
                            </div>

                            <h3 className="mb-3 text-lg font-bold text-center text-gray-900 dark:text-white">{city.name}</h3>

                            <div className="mb-4 text-3xl font-light text-center text-blue-500 dark:text-blue-400">
                              {city.temp}°C
                            </div>

                            <div className="mb-3 text-center">
                              <span className="text-sm text-gray-500 dark:text-gray-400">Comfort Index</span>
                              <div className="text-xl font-bold text-gray-900 dark:text-white">{city.score}</div>
                            </div>

                            <div className="flex justify-center mb-6">
                              <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border-2 ${comfortStyle.bg} ${comfortStyle.text} ${comfortStyle.border}`}>
                                {comfortStyle.label}
                              </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm text-gray-500 dark:text-gray-400">
                              <div className="text-center">
                                <span className="block mb-1">Humidity</span>
                                <span className="font-semibold text-gray-900 dark:text-white">{city.humidity}%</span>
                              </div>
                              <div className="text-center">
                                <span className="block mb-1">Wind</span>
                                <span className="font-semibold text-gray-900 dark:text-white">{Math.round((city.windSpeed || city.wind || 0) * 3.6)} km/h</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'rankings' && (
              <div>
                <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">City Rankings</h2>
                <div className="overflow-hidden bg-white shadow-sm dark:bg-gray-800 dark:shadow-gray-700/30 rounded-xl">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">Rank</th>
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">City</th>
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">Temperature</th>
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">Comfort Score</th>
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-300">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                      {cities.map((city) => {
                        const comfortStyle = getComfortColors(city.score);
                        return (
                          <tr key={city.name || city.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className={`${getRankBadgeColor(city.rank)} text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center`}>
                                {city.rank}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="font-medium text-gray-900 dark:text-white">{city.name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900 dark:text-gray-200">{city.temp}°C</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900 dark:text-gray-200">{city.score}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${comfortStyle.bg} ${comfortStyle.text}`}>
                                {comfortStyle.label}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
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