import WeatherIcon from './WeatherIcon';
import Badge from './Badge';

export default function CityCard({ city }) {
  const rankColor = 
    city.rank === 1 ? 'bg-green-600' :
    city.rank <= 3 ? 'bg-blue-600' :
    city.rank <= 5 ? 'bg-yellow-600' : 'bg-gray-600';

  const comfortVariant = 
    city.score >= 80 ? 'success' :
    city.score >= 70 ? 'info' :
    city.score >= 55 ? 'warning' : 'danger';

  return (
    <div className="overflow-hidden transition bg-white dark:bg-gray-800 shadow-md dark:shadow-gray-700/30 rounded-xl hover:shadow-lg">
      <div className={`px-4 py-2 text-center font-bold text-white text-sm ${rankColor}`}>
        #{city.rank}
      </div>
      <div className="p-6 text-center">
        <WeatherIcon description={city.description} />
        <h3 className="mt-3 text-lg font-semibold dark:text-white">{city.name}, {city.country}</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 capitalize">{city.description}</p>
        
        <div className="my-3 text-4xl font-bold dark:text-white">{city.temp}°C</div>
        
        <Badge variant={comfortVariant} className="mb-4">
          Comfort Score {city.score}
        </Badge>

        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div>Humidity: {city.humidity}%</div>
          <div>Wind: {Math.round(city.windSpeed * 3.6)} km/h</div>
        </div>
      </div>
    </div>
  );
}