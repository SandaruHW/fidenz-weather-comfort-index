import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import WeatherIcon from './components/WeatherIcon';
import ProtectedRoute from './components/ProtectedRoute';
import AuthenticationButton from './components/AuthenticationButton';
import UserProfile from './components/UserProfile';

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
      case 'Most Comfortable': return { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200', label };
      case 'Very Comfortable': return { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200', label };
      case 'Comfortable': return { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200', label };
      default: return { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200', label };
    }
  };

  const getRankBadgeColor = (rank) => {
    if (rank === 1) return 'bg-green-500';
    if (rank <= 3) return 'bg-blue-500';
    if (rank <= 5) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 mx-auto max-w-7xl">
          <h1 className="text-2xl font-semibold text-blue-600">
            Weather Comfort Dashboard
          </h1>
          <div className="flex items-center gap-4">
            <button 
              onClick={fetchData}
              disabled={loading}
              className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 transition-colors"
              title="Refresh data"
            >
              <svg className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            <UserProfile />
            <AuthenticationButton />
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b">
        <div className="px-6 mx-auto max-w-7xl">
          <div className="flex space-x-8">
            {['Overview', 'Rankings'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.toLowerCase()
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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
            <div className="w-12 h-12 border-b-2 border-blue-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading weather data...</p>
          </div>
        )}

        {error && (
          <div className="px-6 py-4 text-center text-red-700 border border-red-200 rounded-lg bg-red-50">
            <p className="font-medium">Error loading weather data</p>
            <p className="text-sm">{error}</p>
            <button 
              onClick={fetchData}
              className="px-4 py-2 mt-3 text-sm text-white bg-red-600 rounded hover:bg-red-700"
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
                  <h2 className="text-xl font-semibold text-gray-900">City Weather Overview</h2>
                  <p className="text-sm text-gray-600">Real-time comfort index rankings for major cities</p>
                </div>
                
                {/* Top Performers Section */}
                <div className="mt-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🏆</span>
                      <h3 className="text-xl font-bold text-gray-900">Top Performers</h3>
                    </div>
                    <span className="px-3 py-1 text-sm font-bold text-white bg-orange-500 rounded-full">
                      GLOBAL TOP 3
                    </span>
                  </div>
                  <p className="mb-6 text-sm text-gray-600">Cities with the highest comfort index scores</p>
                  
                  <div className="grid grid-cols-1 gap-4 mb-12 sm:grid-cols-2 lg:grid-cols-3">
                    {cities.slice(0, 3).map((city) => {
                      const comfortStyle = getComfortColors(city.score);
                      
                      return (
                        <div key={city.name || city.id} className="relative p-6 bg-gray-50 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
                          <div className="absolute top-4 left-4">
                            <div className={`${getRankBadgeColor(city.rank)} text-white text-sm font-bold w-8 h-8 rounded-full flex items-center justify-center shadow-sm`}>
                              #{city.rank}
                            </div>
                          </div>

                          <div className="flex justify-center mt-6 mb-4">
                            <WeatherIcon description={city.description || city.weather || 'sunny'} className="w-16 h-16" />
                          </div>

                          <h3 className="mb-3 text-xl font-bold text-center text-gray-900">{city.name}</h3>

                          <div className="mb-4 text-4xl font-light text-center text-blue-500">
                            {city.temp}°C
                          </div>

                          <div className="mb-3 text-center">
                            <span className="text-sm text-gray-500">Comfort Index</span>
                            <div className="text-2xl font-bold text-gray-900">{city.score}</div>
                          </div>

                          <div className="flex justify-center mb-6">
                            <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border-2 ${comfortStyle.bg} ${comfortStyle.text} ${comfortStyle.border}`}>
                              {comfortStyle.label}
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                            <div className="text-center">
                              <span className="block mb-1">Humidity</span>
                              <span className="font-semibold text-gray-900">{city.humidity}%</span>
                            </div>
                            <div className="text-center">
                              <span className="block mb-1">Wind</span>
                              <span className="font-semibold text-gray-900">{Math.round((city.windSpeed || city.wind || 0) * 3.6)} km/h</span>
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
                      <h3 className="text-xl font-bold text-gray-900">Global Rankings</h3>
                    </div>
                    <p className="mb-6 text-sm text-gray-600">Comprehensive comfort index across all cities</p>
                    
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {cities.slice(3).map((city) => {
                        const comfortStyle = getComfortColors(city.score);
                        return (
                          <div key={city.name || city.id} className="relative p-6 bg-gray-50 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
                            <div className="absolute top-4 left-4">
                              <div className={`${getRankBadgeColor(city.rank)} text-white text-sm font-bold w-8 h-8 rounded-full flex items-center justify-center shadow-sm`}>
                                #{city.rank}
                              </div>
                            </div>

                            <div className="flex justify-center mt-6 mb-4">
                              <WeatherIcon description={city.description || city.weather || 'sunny'} className="w-14 h-14" />
                            </div>

                            <h3 className="mb-3 text-lg font-bold text-center text-gray-900">{city.name}</h3>

                            <div className="mb-4 text-3xl font-light text-center text-blue-500">
                              {city.temp}°C
                            </div>

                            <div className="mb-3 text-center">
                              <span className="text-sm text-gray-500">Comfort Index</span>
                              <div className="text-xl font-bold text-gray-900">{city.score}</div>
                            </div>

                            <div className="flex justify-center mb-6">
                              <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border-2 ${comfortStyle.bg} ${comfortStyle.text} ${comfortStyle.border}`}>
                                {comfortStyle.label}
                              </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                              <div className="text-center">
                                <span className="block mb-1">Humidity</span>
                                <span className="font-semibold text-gray-900">{city.humidity}%</span>
                              </div>
                              <div className="text-center">
                                <span className="block mb-1">Wind</span>
                                <span className="font-semibold text-gray-900">{Math.round((city.windSpeed || city.wind || 0) * 3.6)} km/h</span>
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
                <h2 className="mb-6 text-xl font-semibold text-gray-900">City Rankings</h2>
                <div className="overflow-hidden bg-white shadow-sm rounded-xl">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Rank</th>
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">City</th>
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Temperature</th>
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Comfort Score</th>
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
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
                              <div className="font-medium text-gray-900">{city.name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{city.temp}°C</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{city.score}</div>
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