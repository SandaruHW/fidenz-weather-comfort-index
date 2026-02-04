import { useState, useEffect } from 'react';
import WeatherIcon from './components/WeatherIcon';

function App() {
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
          <div className="flex items-center gap-3">
            <button 
              onClick={fetchData}
              disabled={loading}
              className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
            >
              <svg className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            <div className="flex items-center justify-center w-8 h-8 text-sm font-medium text-white bg-blue-500 rounded-full">
              JD
            </div>
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
                
                <div className="grid grid-cols-1 gap-4 mt-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                  {cities.map((city) => {
                    const comfortStyle = getComfortColors(city.score);
                    const isTopThree = city.rank <= 3;
                    return (
                      <div 
                        key={city.name || city.id} 
                        className={`relative p-6 bg-white shadow-sm rounded-xl transition-all duration-300 hover:shadow-lg ${
                          isTopThree ? 'ring-2 ring-blue-500 ring-opacity-50 shadow-xl scale-105 bg-gradient-to-br from-white to-blue-50' : ''
                        } ${city.rank === 1 ? 'ring-yellow-400 bg-gradient-to-br from-yellow-50 to-white' : ''}`}
                      >
                        {/* Rank Badge with enhanced styling for top 3 */}
                        <div className="absolute top-3 left-3">
                          <div className={`${getRankBadgeColor(city.rank)} text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                            isTopThree ? 'w-8 h-8 text-sm shadow-lg animate-pulse' : ''
                          } ${city.rank === 1 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 shadow-yellow-400/50' : ''}`}>
                            #{city.rank}
                          </div>
                          {/* Crown for #1 */}
                          {city.rank === 1 && (
                            <div className="absolute -top-1 -right-1">
                              <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732L14.146 12.8l-1.179 4.456a1 1 0 01-1.934 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732L9.854 7.2l1.179-4.456A1 1 0 0112 2z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </div>

                        {/* Weather Icon with enhanced size for top 3 */}
                        <div className="flex justify-center mt-4 mb-4">
                          <WeatherIcon 
                            description={city.description || city.weather || 'sunny'} 
                            className={`${isTopThree ? 'w-16 h-16' : 'w-12 h-12'}`} 
                          />
                        </div>

                        {/* City Name with enhanced styling for top 3 */}
                        <h3 className={`mb-1 text-center text-gray-900 ${
                          isTopThree ? 'text-xl font-bold' : 'text-lg font-semibold'
                        }`}>
                          {city.name}
                          {city.rank === 1 && <span className="ml-1 text-yellow-500">🏆</span>}
                          {city.rank === 2 && <span className="ml-1 text-gray-400">🥈</span>}
                          {city.rank === 3 && <span className="ml-1 text-yellow-600">🥉</span>}
                        </h3>

                        {/* Temperature with enhanced styling for top 3 */}
                        <div className={`mb-3 text-center font-light ${
                          isTopThree ? 'text-4xl text-blue-600 font-bold' : 'text-3xl text-blue-500'
                        }`}>
                          {city.temp}°C
                        </div>

                        {/* Comfort Index with enhanced styling for top 3 */}
                        <div className="mb-2 text-center">
                          <span className={`text-gray-500 ${isTopThree ? 'text-sm font-medium' : 'text-xs'}`}>
                            Comfort Index
                          </span>
                          <div className={`text-gray-900 ${
                            isTopThree ? 'text-2xl font-bold text-blue-700' : 'text-lg font-semibold'
                          }`}>
                            {city.score}
                          </div>
                        </div>

                        {/* Comfort Label with enhanced styling for top 3 */}
                        <div className="flex justify-center mb-4">
                          <span className={`inline-flex items-center rounded-full text-xs font-medium border ${
                            isTopThree ? 'px-3 py-1 text-sm font-bold' : 'px-2.5 py-0.5'
                          } ${comfortStyle.bg} ${comfortStyle.text} ${comfortStyle.border}`}>
                            {comfortStyle.label}
                          </span>
                        </div>

                        {/* Weather Details */}
                        <div className={`grid grid-cols-2 gap-4 text-gray-500 ${
                          isTopThree ? 'text-sm' : 'text-xs'
                        }`}>
                          <div>
                            <span className="block">Humidity</span>
                            <span className={`text-gray-900 ${isTopThree ? 'font-semibold' : 'font-medium'}`}>
                              {city.humidity}%
                            </span>
                          </div>
                          <div>
                            <span className="block">Wind</span>
                            <span className={`text-gray-900 ${isTopThree ? 'font-semibold' : 'font-medium'}`}>
                              {Math.round((city.windSpeed || city.wind || 0) * 3.6)} km/h
                            </span>
                          </div>
                        </div>

                        {/* Special effects for top 3 */}
                        {isTopThree && (
                          <div className="absolute inset-0 transition-opacity duration-300 opacity-0 rounded-xl bg-gradient-to-r from-transparent via-white to-transparent hover:opacity-20"></div>
                        )}
                      </div>
                    );
                  })}
                </div>
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