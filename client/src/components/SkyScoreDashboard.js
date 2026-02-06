import { useState } from 'react';
import CityCard from './CityCard';

export default function SkyScoreDashboard({ cities = [], loading = false, onRefresh }) {
  const [tab, setTab] = useState('overview');

  return (
    <div className="px-4 py-8 mx-auto max-w-7xl">
      {/* Tabs */}
      <div className="flex mb-8 border-b dark:border-gray-700">
        <button
          onClick={() => setTab('overview')}
          className={`pb-4 px-6 font-medium ${
            tab === 'overview' ? 'border-b-2 border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setTab('rankings')}
          className={`pb-4 px-6 font-medium ${
            tab === 'rankings' ? 'border-b-2 border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          Rankings
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="w-12 h-12 mx-auto border-b-2 border-indigo-600 dark:border-indigo-400 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading real-time comfort data...</p>
        </div>
      ) : (
        <>
          {tab === 'overview' && (
            <div>
              <h2 className="mb-6 text-2xl font-bold dark:text-white">City Weather Overview</h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {cities.map(city => (
                  <CityCard key={city.name} city={city} />
                ))}
              </div>
            </div>
          )}

          {tab === 'rankings' && (
            <div>
              <h2 className="mb-6 text-2xl font-bold dark:text-white">City Rankings</h2>
              <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-gray-700/30">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 dark:text-gray-300 uppercase">Rank</th>
                      <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 dark:text-gray-300 uppercase">City</th>
                      <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 dark:text-gray-300 uppercase">Temp (°C)</th>
                      <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 dark:text-gray-300 uppercase">Humidity (%)</th>
                      <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 dark:text-gray-300 uppercase">Wind (km/h)</th>
                      <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 dark:text-gray-300 uppercase">Comfort Index</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {cities.map(city => (
                      <tr key={city.name} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                            city.rank === 1 ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300' :
                            city.rank <= 3 ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300' :
                            'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                          }`}>
                            {city.rank}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-medium whitespace-nowrap dark:text-white">{city.name}, {city.country}</td>
                        <td className="px-6 py-4 whitespace-nowrap dark:text-gray-200">{city.temp}</td>
                        <td className="px-6 py-4 whitespace-nowrap dark:text-gray-200">{city.humidity}</td>
                        <td className="px-6 py-4 whitespace-nowrap dark:text-gray-200">{Math.round(city.windSpeed * 3.6)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            city.score >= 80 ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300' :
                            city.score >= 70 ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300' :
                            city.score >= 55 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300' :
                            'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300'
                          }`}>
                            {city.score}
                          </span>
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
    </div>
  );
}