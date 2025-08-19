
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, MapPin, Wind, Eye, Droplets, Thermometer, Sun, Moon, 
  Cloud, CloudRain, Star, Clock, Sunrise, Sunset, Navigation,
  TrendingUp, TrendingDown, Zap, Snowflake, AlertTriangle,
  RefreshCw, Heart, Trash2, Settings
} from 'lucide-react';

// Weather API Service with multiple endpoints
const WeatherService = {
  API_KEY: import.meta.env.VITE_OPENWEATHER_API_KEY,
  BASE_URL: 'https://api.openweathermap.org/data/2.5',
  GEO_URL: 'https://api.openweathermap.org/geo/1.0',

  // Current weather by city
  async getCurrentWeather(query) {
    const response = await fetch(
      `${this.BASE_URL}/weather?q=${query}&appid=${this.API_KEY}&units=metric`
    );
    if (!response.ok) throw new Error('Location not found');
    return response.json();
  },

  // Current weather by coordinates
  async getCurrentWeatherByCoords(lat, lon) {
    const response = await fetch(
      `${this.BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${this.API_KEY}&units=metric`
    );
    if (!response.ok) throw new Error('Weather data unavailable');
    return response.json();
  },

  // 5-day forecast
  async getForecast(lat, lon) {
    const response = await fetch(
      `${this.BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${this.API_KEY}&units=metric`
    );
    if (!response.ok) throw new Error('Forecast data unavailable');
    return response.json();
  },

  // Air pollution data
  async getAirPollution(lat, lon) {
    const response = await fetch(
      `${this.BASE_URL}/air_pollution?lat=${lat}&lon=${lon}&appid=${this.API_KEY}`
    );
    if (!response.ok) throw new Error('Air quality data unavailable');
    return response.json();
  },

  // Geocoding for flexible search
  async geocodeLocation(query) {
    const response = await fetch(
      `${this.GEO_URL}/direct?q=${query}&limit=1&appid=${this.API_KEY}`
    );
    if (!response.ok) throw new Error('Geocoding failed');
    const data = await response.json();
    if (!data.length) throw new Error('Location not found');
    return data[0];
  }
};

// Weather theme configuration
const getWeatherTheme = (weatherMain, isDay = true) => {
  const themes = {
    Clear: {
      primary: isDay ? 'from-yellow-400 to-orange-500' : 'from-indigo-900 to-purple-900',
      accent: isDay ? 'text-yellow-600' : 'text-purple-300',
      bg: isDay ? 'bg-yellow-50' : 'bg-indigo-950',
      icon: isDay ? Sun : Moon
    },
    Clouds: {
      primary: 'from-gray-400 to-gray-600',
      accent: 'text-gray-600',
      bg: 'bg-gray-50',
      icon: Cloud
    },
    Rain: {
      primary: 'from-blue-500 to-blue-700',
      accent: 'text-blue-600',
      bg: 'bg-blue-50',
      icon: CloudRain
    },
    Drizzle: {
      primary: 'from-blue-400 to-cyan-500',
      accent: 'text-blue-500',
      bg: 'bg-blue-50',
      icon: CloudRain
    },
    Thunderstorm: {
      primary: 'from-purple-600 to-gray-800',
      accent: 'text-purple-600',
      bg: 'bg-purple-50',
      icon: Zap
    },
    Snow: {
      primary: 'from-blue-100 to-blue-300',
      accent: 'text-blue-400',
      bg: 'bg-blue-50',
      icon: Snowflake
    }
  };
  return themes[weatherMain] || themes.Clear;
};

// Utility functions
const formatTime = (timestamp, timezone) => {
  const date = new Date((timestamp + timezone) * 1000);
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    timeZone: 'UTC'
  });
};

const getAQILevel = (aqi) => {
  const levels = ['Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'];
  const colors = ['text-green-600', 'text-yellow-600', 'text-orange-600', 'text-red-600', 'text-purple-600'];
  return { level: levels[aqi - 1] || 'Unknown', color: colors[aqi - 1] || 'text-gray-600' };
};

// Search Bar Component with Advanced Features
const SearchBar = ({ onSearch, isLoading, recentSearches, onClearRecent }) => {
  const [query, setQuery] = useState('');
  const [showRecent, setShowRecent] = useState(false);

  const handleSubmit = () => {
    if (query.trim()) {
      onSearch(query.trim());
      setQuery('');
      setShowRecent(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSubmit();
  };

  const handleRecentClick = (location) => {
    onSearch(location);
    setShowRecent(false);
  };

  return (
    <div className="relative mb-6">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            onFocus={() => setShowRecent(true)}
            placeholder="Search city, zip code, coordinates..."
            className="w-full px-4 py-3 pl-12 pr-4 bg-white/90 backdrop-blur-sm border border-blue-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent shadow-lg"
            disabled={isLoading}
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-400" size={20} />
        </div>
        <button
          onClick={handleSubmit}
          disabled={!query.trim() || isLoading}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
        >
          {isLoading ? <RefreshCw className="animate-spin" size={20} /> : 'Search'}
        </button>
      </div>

      {/* Recent Searches Dropdown */}
      {showRecent && recentSearches.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-sm border border-blue-200 rounded-2xl shadow-xl z-10">
          <div className="flex justify-between items-center p-3 border-b border-blue-100">
            <span className="text-sm font-medium text-blue-600">Recent Searches</span>
            <button onClick={onClearRecent} className="text-blue-400 hover:text-blue-600">
              <Trash2 size={16} />
            </button>
          </div>
          {recentSearches.slice(0, 5).map((location, index) => (
            <button
              key={index}
              onClick={() => handleRecentClick(location)}
              className="w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-blue-400" />
                <span className="text-sm">{location}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Current Weather Display with Dynamic Theming
const CurrentWeatherCard = ({ weather, theme, units, onToggleUnits }) => {
  if (!weather) return null;

  const { main, weather: weatherArray, name, sys, wind, visibility, dt, timezone } = weather;
  const currentWeather = weatherArray[0];
  const isDay = dt > sys.sunrise && dt < sys.sunset;
  const temp = units === 'metric' ? main.temp : (main.temp * 9/5) + 32;
  const feelsLike = units === 'metric' ? main.feels_like : (main.feels_like * 9/5) + 32;

  return (
    <div className={`bg-gradient-to-br ${theme.primary} rounded-3xl p-8 text-white shadow-2xl mb-6 relative overflow-hidden`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 right-10">
          <theme.icon size={120} />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Location and Time */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <MapPin size={20} />
            <h1 className="text-2xl font-bold">{name}, {sys.country}</h1>
          </div>
          <p className="text-white/80">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        {/* Temperature and Description */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <theme.icon size={80} />
            <div>
              <div className="text-6xl font-bold">{Math.round(temp)}°</div>
              <button
                onClick={onToggleUnits}
                className="text-sm bg-white/20 px-3 py-1 rounded-full hover:bg-white/30 transition-colors"
              >
                {units === 'metric' ? '°C' : '°F'}
              </button>
            </div>
          </div>
          <p className="text-xl capitalize mb-2">{currentWeather.description}</p>
          <p className="text-white/80">Feels like {Math.round(feelsLike)}°{units === 'metric' ? 'C' : 'F'}</p>
        </div>

        {/* Weather Details Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <WeatherDetailCard
            icon={<Wind size={24} />}
            label="Wind"
            value={`${wind.speed} m/s`}
            subValue={`${wind.deg}°`}
          />
          <WeatherDetailCard
            icon={<Droplets size={24} />}
            label="Humidity"
            value={`${main.humidity}%`}
          />
          <WeatherDetailCard
            icon={<Eye size={24} />}
            label="Visibility"
            value={`${Math.round(visibility / 1000)} km`}
          />
          <WeatherDetailCard
            icon={<Thermometer size={24} />}
            label="Pressure"
            value={`${main.pressure} hPa`}
          />
        </div>

        {/* Sun Times */}
        <div className="mt-6 flex justify-between items-center bg-white/10 rounded-2xl p-4">
          <div className="flex items-center gap-2">
            <Sunrise size={20} />
            <div>
              <div className="text-sm opacity-80">Sunrise</div>
              <div className="font-medium">{formatTime(sys.sunrise, timezone)}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Sunset size={20} />
            <div>
              <div className="text-sm opacity-80">Sunset</div>
              <div className="font-medium">{formatTime(sys.sunset, timezone)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Weather Detail Card Component
const WeatherDetailCard = ({ icon, label, value, subValue }) => (
  <div className="bg-white/10 rounded-2xl p-4 text-center backdrop-blur-sm">
    <div className="text-white/80 mb-2 flex justify-center">{icon}</div>
    <div className="text-white/70 text-sm mb-1">{label}</div>
    <div className="text-white font-semibold">{value}</div>
    {subValue && <div className="text-white/60 text-xs">{subValue}</div>}
  </div>
);

// 5-Day Forecast Component
const ForecastCard = ({ forecast, theme, units }) => {
  if (!forecast) return null;

  const dailyData = forecast.list.filter((_, index) => index % 8 === 0).slice(0, 5);

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <TrendingUp className={theme.accent} size={24} />
        5-Day Forecast
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {dailyData.map((day, index) => {
          const date = new Date(day.dt * 1000);
          const temp = units === 'metric' ? day.main.temp : (day.main.temp * 9/5) + 32;
          const tempMin = units === 'metric' ? day.main.temp_min : (day.main.temp_min * 9/5) + 32;
          
          return (
            <div key={index} className="text-center p-4 rounded-2xl bg-blue-50 hover:bg-blue-100 transition-colors">
              <div className="text-sm font-medium text-gray-600 mb-2">
                {index === 0 ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' })}
              </div>
              <div className="mb-2 flex justify-center">
                {getWeatherIcon(day.weather[0].main, 32)}
              </div>
              <div className="font-bold text-gray-800">{Math.round(temp)}°</div>
              <div className="text-sm text-gray-500">{Math.round(tempMin)}°</div>
              <div className="text-xs text-gray-500 mt-1 capitalize">
                {day.weather[0].description}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Air Quality Component
const AirQualityCard = ({ airQuality, theme }) => {
  if (!airQuality) return null;

  const aqi = airQuality.list[0].main.aqi;
  const aqiInfo = getAQILevel(aqi);
  const components = airQuality.list[0].components;

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Wind className={theme.accent} size={24} />
        Air Quality
      </h2>
      <div className="mb-4">
        <div className="flex items-center gap-3 mb-2">
          <div className={`text-2xl font-bold ${aqiInfo.color}`}>{aqi}</div>
          <div>
            <div className={`font-medium ${aqiInfo.color}`}>{aqiInfo.level}</div>
            <div className="text-sm text-gray-500">Air Quality Index</div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AirQualityDetail label="PM2.5" value={components.pm2_5?.toFixed(1)} unit="μg/m³" />
        <AirQualityDetail label="PM10" value={components.pm10?.toFixed(1)} unit="μg/m³" />
        <AirQualityDetail label="O₃" value={components.o3?.toFixed(1)} unit="μg/m³" />
        <AirQualityDetail label="NO₂" value={components.no2?.toFixed(1)} unit="μg/m³" />
      </div>
    </div>
  );
};

// Air Quality Detail Component
const AirQualityDetail = ({ label, value, unit }) => (
  <div className="text-center p-3 bg-gray-50 rounded-xl">
    <div className="text-sm text-gray-600 mb-1">{label}</div>
    <div className="font-bold text-gray-800">{value}</div>
    <div className="text-xs text-gray-500">{unit}</div>
  </div>
);

// Weather Icon Component
const getWeatherIcon = (weatherMain, size = 24) => {
  const iconProps = { size, className: "text-blue-500" };
  
  switch (weatherMain.toLowerCase()) {
    case 'clear': return <Sun {...iconProps} className="text-yellow-500" />;
    case 'clouds': return <Cloud {...iconProps} className="text-gray-500" />;
    case 'rain': return <CloudRain {...iconProps} className="text-blue-500" />;
    case 'drizzle': return <CloudRain {...iconProps} className="text-blue-400" />;
    case 'thunderstorm': return <Zap {...iconProps} className="text-purple-500" />;
    case 'snow': return <Snowflake {...iconProps} className="text-blue-200" />;
    default: return <Sun {...iconProps} />;
  }
};

// Loading Component
const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center py-12">
    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mb-4"></div>
    <p className="text-blue-600 text-lg font-medium">Loading weather data...</p>
    <p className="text-blue-400 text-sm">Please wait while we fetch the latest information</p>
  </div>
);

// Error Component
const ErrorMessage = ({ message, onRetry }) => (
  <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
    <AlertTriangle className="text-red-500 mx-auto mb-4" size={48} />
    <h3 className="text-lg font-semibold text-red-800 mb-2">Oops! Something went wrong</h3>
    <p className="text-red-600 mb-4">{message}</p>
    <button
      onClick={onRetry}
      className="px-6 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
    >
      Try Again
    </button>
  </div>
);

// Location Button Component
const LocationButton = ({ onLocationRequest, isLoading }) => (
  <button
    onClick={onLocationRequest}
    disabled={isLoading}
    className="flex items-center gap-2 px-6 py-3 bg-white/90 backdrop-blur-sm border border-blue-200 rounded-2xl hover:bg-white hover:border-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
  >
    <Navigation size={20} className="text-blue-500" />
    <span className="text-blue-600 font-medium">Use Current Location</span>
  </button>
);

// Main Nexus Weather App
const NexusWeatherApp = () => {
  // State Management
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [airQuality, setAirQuality] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [units, setUnits] = useState('metric');
  const [recentSearches, setRecentSearches] = useState([]);
  const [favorites, setFavorites] = useState([]);

  // Get weather theme
  const theme = currentWeather 
    ? getWeatherTheme(currentWeather.weather[0].main, 
        currentWeather.dt > currentWeather.sys.sunrise && currentWeather.dt < currentWeather.sys.sunset)
    : { primary: 'from-blue-400 to-blue-600', accent: 'text-blue-500', bg: 'bg-blue-50' };

  // Fetch all weather data
  const fetchAllWeatherData = useCallback(async (lat, lon, cityName) => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch all data concurrently
      const [currentData, forecastData, airQualityData] = await Promise.all([
        WeatherService.getCurrentWeatherByCoords(lat, lon),
        WeatherService.getForecast(lat, lon),
        WeatherService.getAirPollution(lat, lon).catch(() => null) // Air quality might not be available
      ]);

      setCurrentWeather(currentData);
      setForecast(forecastData);
      setAirQuality(airQualityData);

      // Add to recent searches
      if (cityName && !recentSearches.includes(cityName)) {
        setRecentSearches(prev => [cityName, ...prev.slice(0, 4)]);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch weather data');
    } finally {
      setIsLoading(false);
    }
  }, [recentSearches]);

  // Search handler with geocoding
  const handleSearch = async (query) => {
    setIsLoading(true);
    setError(null);

    try {
      // Try direct weather search first
      let weatherData;
      try {
        weatherData = await WeatherService.getCurrentWeather(query);
      } catch {
        // If direct search fails, try geocoding
        const geoData = await WeatherService.geocodeLocation(query);
        weatherData = await WeatherService.getCurrentWeatherByCoords(geoData.lat, geoData.lon);
      }

      // Fetch additional data
      await fetchAllWeatherData(weatherData.coord.lat, weatherData.coord.lon, weatherData.name);
    } catch (err) {
      setError(err.message || 'Location not found');
      setIsLoading(false);
    }
  };

  // Get user's current location
  const handleLocationRequest = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        await fetchAllWeatherData(latitude, longitude, 'Current Location');
      },
      (err) => {
        setError('Unable to access your location. Please enable location services.');
        setIsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 600000 }
    );
  };

  // Load default weather on mount
  useEffect(() => {
    handleSearch('New York');
  }, []);

  // Toggle temperature units
  const handleToggleUnits = () => {
    setUnits(prev => prev === 'metric' ? 'imperial' : 'metric');
  };

  // Clear recent searches
  const handleClearRecent = () => {
    setRecentSearches([]);
  };

  // Retry function
  const handleRetry = () => {
    if (currentWeather) {
      fetchAllWeatherData(currentWeather.coord.lat, currentWeather.coord.lon, currentWeather.name);
    } else {
      handleSearch('New York');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-cyan-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
            Nexus Weather
          </h1>
          <p className="text-blue-600 text-lg">Advanced Weather Intelligence Platform</p>
        </div>

        {/* Search and Location */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-center mb-8">
          <div className="flex-1 max-w-lg">
            <SearchBar
              onSearch={handleSearch}
              isLoading={isLoading}
              recentSearches={recentSearches}
              onClearRecent={handleClearRecent}
            />
          </div>
          <LocationButton onLocationRequest={handleLocationRequest} isLoading={isLoading} />
        </div>

        {/* Main Content */}
        {isLoading && <LoadingSpinner />}
        
        {error && <ErrorMessage message={error} onRetry={handleRetry} />}
        
        {!isLoading && !error && currentWeather && (
          <div className="space-y-6">
            {/* Current Weather */}
            <CurrentWeatherCard
              weather={currentWeather}
              theme={theme}
              units={units}
              onToggleUnits={handleToggleUnits}
            />

            {/* Forecast and Air Quality */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <ForecastCard forecast={forecast} theme={theme} units={units} />
              </div>
              <div>
                {airQuality && <AirQualityCard airQuality={airQuality} theme={theme} />}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="text-center mt-12 py-6 text-blue-500">
          <p className="mb-2">Powered by OpenWeatherMap API</p>
          <p className="text-sm text-blue-400">
            Nexus Weather - Where meteorology meets technology
          </p>
        </footer>
      </div>
    </div>
  );
};

export default NexusWeatherApp;
