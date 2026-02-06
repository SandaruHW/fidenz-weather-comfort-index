# Weather Comfort Index Application

A secure weather analytics application that provides a custom Comfort Index score (0-100) for major cities worldwide. The app fetches real-time data from OpenWeatherMap, implements intelligent server-side caching, features a responsive React UI, and includes Auth0 authentication with MFA support.


## Features

- **Custom Comfort Index**: Proprietary algorithm that calculates weather comfort scores based on temperature, humidity, wind speed, and cloudiness
- **Real-time Data**: Live weather data from OpenWeatherMap API
- **Smart Caching**: Multi-tier caching strategy for optimal performance
- **Authentication**: Secure Auth0 integration with Multi-Factor Authentication
- **Responsive Design**: Modern React UI built with Tailwind CSS
- **City Rankings**: Displays cities ranked by comfort score with detailed metrics

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- OpenWeatherMap API key ([Get one here](https://openweathermap.org/api))
- Auth0 account ([Get started here](https://auth0.com/))

### Backend Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env  # or create .env manually
   ```

   **Note for Evaluators:** The `.env.example` files contain working API keys and credentials for immediate evaluation. Simply running `cp .env.example .env` will set up the application without any additional configuration required. These files and their API keys are included in this repository for assignment evaluation purposes only. In production environments, API keys should NEVER be committed to version control.

4. Configure environment variables in `.env`:
   ```env
   OPENWEATHER_API_KEY=your_api_key_here
   AUTH0_DOMAIN=your-domain.auth0.com
   AUTH0_AUDIENCE=your-api-audience
   PORT=5001
   ```

5. Start the server:
   ```bash
   npm start
   # or for development with auto-restart:
   npm run dev
   ```

### Frontend Setup

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   ```

### Accessing the Application

- Frontend: `http://localhost:5173` (Vite default)
- Backend API: `http://localhost:5001`
- API Health Check: `http://localhost:5001/`
- Cache Status: `http://localhost:5001/api/cache-status`

## Comfort Index Formula

The Comfort Index is calculated using a weighted scoring system that evaluates four key weather parameters:

### Formula Components

1. **Temperature Score** (Weight: 40%)
   ```
   Score = max(0, 100 - |temp - 23|^1.8 × 3.5)
   ```
   - Optimal range: 20-25°C (ideal: 23°C)
   - Uses quadratic penalty function for temperatures outside ideal range

2. **Humidity Score** (Weight: 25%)
   ```
   Score = max(0, 100 - max(0, |humidity - 50| × 2 - 20))
   ```
   - Optimal range: 40-60% (ideal: 50%)
   - Stronger penalties for extreme humidity levels

3. **Wind Speed Score** (Weight: 20%)
   ```
   Score = max(0, 100 - |windSpeed - 3.5| × 12)
   ```
   - Optimal range: 2-5 m/s (ideal: 3.5 m/s)
   - Too calm or too windy reduces comfort

4. **Cloudiness Score** (Weight: 15%)
   ```
   Score = max(0, 100 - |cloudiness - 45| × 1.2)
   ```
   - Optimal range: 30-60% (ideal: 45%)
   - Partial clouds preferred over full sun or complete overcast

### Final Score Calculation
```
Comfort Index = (TempScore × 0.4) + (HumidityScore × 0.25) + (WindScore × 0.2) + (CloudScore × 0.15)
```

The final score is clamped between 0-100 and rounded to the nearest integer.

## Variable Weight Reasoning

### Temperature (40% - Highest Weight)
- **Rationale**: Temperature is the most immediately perceived weather factor affecting human comfort
- **Impact**: Extreme temperatures (too hot/cold) make outdoor activities uncomfortable regardless of other conditions
- **Scientific Basis**: Human thermoregulation is most sensitive to ambient temperature

### Humidity (25% - Second Priority)
- **Rationale**: High humidity makes heat feel more oppressive; low humidity can cause discomfort
- **Impact**: Affects perceived temperature and breathing comfort
- **Balance**: Moderate weight since it's often correlated with temperature

### Wind Speed (20% - Moderate Impact)
- **Rationale**: Wind affects temperature perception and can provide cooling or become uncomfortable
- **Impact**: Gentle breeze is pleasant; still air or strong winds are less comfortable
- **Consideration**: Varies by season and personal preference

### Cloudiness (15% - Lowest Weight)
- **Rationale**: While affecting comfort, cloudiness has less direct physiological impact
- **Impact**: Influences UV exposure and mood but doesn't immediately affect physical comfort
- **Subjectivity**: Preference for sun vs. shade varies significantly between individuals

## Trade-offs Considered

### Formula Design Trade-offs

1. **Simplicity vs. Accuracy**
   - **Chosen**: Simplified model with four key parameters
   - **Alternative**: Complex model including air pressure, UV index, precipitation
   - **Reasoning**: Balance between meaningful results and computational efficiency

2. **Universal vs. Regional Preferences**
   - **Chosen**: Universal comfort ranges based on general human physiology
   - **Alternative**: Region-specific comfort ranges
   - **Reasoning**: Provides consistent global comparison; could be enhanced with user preferences

3. **Linear vs. Non-linear Penalties**
   - **Chosen**: Non-linear penalties for temperature, linear for others
   - **Reasoning**: Temperature discomfort increases exponentially; other factors more linear

### Technical Trade-offs

1. **Real-time vs. Cached Data**
   - **Chosen**: 5-minute cache TTL
   - **Alternative**: Real-time API calls or longer caching
   - **Reasoning**: Balances data freshness with API rate limits and performance

2. **Client vs. Server-side Calculations**
   - **Chosen**: Server-side comfort score calculation
   - **Alternative**: Client-side calculation
   - **Reasoning**: Consistent calculations, reduced client processing, easier to update algorithm

3. **Authentication Strategy**
   - **Chosen**: Auth0 with optional API protection
   - **Alternative**: Custom JWT implementation or no authentication
   - **Reasoning**: Robust security with minimal implementation effort

## Cache Design Explanation

The application implements a sophisticated multi-tier caching strategy using NodeCache:

### Cache Layers

1. **Processed Results Cache** (`processed_weather_all`)
   - **Duration**: 5 minutes (300 seconds)
   - **Content**: Complete ranked city data with comfort scores
   - **Purpose**: Fastest response for the most common request

2. **Individual City Cache** (`raw_weather_{cityId}`)
   - **Duration**: 5 minutes (300 seconds)
   - **Content**: Raw OpenWeatherMap API responses per city
   - **Purpose**: Avoid redundant API calls when rebuilding processed cache

### Cache Strategy Benefits

- **Performance**: Reduces response time from ~2s to ~50ms for cached requests
- **API Efficiency**: Minimizes OpenWeatherMap API calls, staying within rate limits
- **Reliability**: Graceful degradation if some cities fail to fetch
- **Cost Optimization**: Reduces API usage costs

### Cache Invalidation

- **Time-based**: Automatic expiration after 5 minutes
- **Graceful Handling**: Stale data served while fetching fresh data in background
- **Debug Support**: Cache status endpoint for monitoring

### Cache Monitoring

Access `/api/cache-status` for:
- Number of cached items
- Cache hit statistics
- TTL information
- Active cache keys

## Known Limitations

### Current Limitations

1. **Fixed City List**
   - Only 15 predefined cities are supported
   - No dynamic city addition by users
   - **Mitigation**: Cities chosen to represent diverse global climates

2. **Simplified Weather Model**
   - Doesn't account for precipitation, air quality, or seasonal variations
   - UV index and air pressure not considered
   - **Mitigation**: Future versions could include additional parameters

3. **Universal Comfort Standards**
   - No personalization based on user preferences or location
   - Same comfort ranges applied globally
   - **Mitigation**: Could implement user preference profiles

4. **API Dependencies**
   - Relies on OpenWeatherMap API availability
   - No offline functionality
   - **Mitigation**: Error handling and fallback mechanisms in place

### Technical Debt

1. **Environment Configuration**
   - Manual environment variable setup required
   - No configuration validation
   - **Solution**: Implement config validation and better setup scripts

2. **Error Handling**
   - Limited error recovery for API failures
   - No retry mechanisms for failed requests
   - **Solution**: Implement exponential backoff and retry logic

3. **Testing Coverage**
   - No automated tests currently implemented
   - **Solution**: Add unit tests for comfort score calculation and integration tests

4. **Scalability Concerns**
   - In-memory caching doesn't scale across instances
   - **Solution**: Redis or similar distributed cache for production

### Future Enhancements

- User preference customization for comfort parameters
- Additional weather parameters (air quality, precipitation probability)
- Historical data analysis and trends
- Push notifications for comfort score changes
- Mobile application
- Real-time weather alerts
