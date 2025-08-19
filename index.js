import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Wind, Eye, Droplets, Thermometer } from 'lucide-react';

// Weather API service
const weatherService = {
  // Replace 'YOUR_API_KEY' with your actual OpenWeatherMap API key
  // Get your free API key at: https://openweathermap.org/api
  API_KEY: 'YOUR_API_KEY',
  
  async getWeatherByLocation(query) {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${this.API_KEY}&units=imperial`
      );
      
      if (!response.ok) {
        throw new Error('Weather data not found');
      }
      
      return await response.json();
    } catch (error) {
      throw new Error(`Failed to fetch weather data: ${error.message}`);
    }
  },

  async getWeatherByCoordinates(lat, lon) {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${this.API_KEY}&units=imperial`
      );
      
      if (!response.ok) {
        throw new Error('Weather data not found');
      }
      
      return await response.json();
    } catch (error) {
      throw new Error(`Failed to fetch weather data: ${error.message}`);
    }
  }
};

// Weather Icon Component
const WeatherIcon = ({ weatherMain, size = 64 }) => {
  const getIcon = () => {
    switch (weatherMain?.toLowerCase()) {
      case 'clear':
        return <Sun size={size} className="text-yellow-500" />;
      case 'clouds':
        return <Cloud size={size} className="text-gray-500" />;
      case 'rain':
      case 'drizzle':
        return <CloudRain size={size} className="text-blue-500" />;
      default:
        return <Sun size={size} className="text-yellow-500" />;
    }
  };

  return <div className="flex justify-center">{getIcon()}</div>;
};

// Search Component
const SearchBar = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = () => {
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="mb-8">
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Enter city, zip code, or address..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isLoading}
        />
        <button
          onClick={handleSubmit}
          disabled={!query.trim() || isLoading}
          className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Loading...' : 'Search'}
        </button>
      </div>
    </div>
  );
};

// Weather Details Component
const WeatherDetails = ({ weather }) => {
  const { main, wind, visibility, name, sys } = weather;

  const details = [
    {
      icon: <Thermometer size={20} />,
      label: 'Feels Like',
      value: `${Math.round(main.feels_like)}°F`
    },
    {
      icon: <Wind size={20} />,
      label: 'Wind Speed',
      value: `${Math.round(wind.speed)} mph`
    },
    {
      icon: <Droplets size={20} />,
      label: 'Humidity',
      value: `${main.humidity}%`
    },
    {
      icon: <Eye size={20} />,
      label: 'Visibility',
      value: `${Math.round((visibility || 10000) / 1609)} mi`
    }
  ];

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-4">Weather Details</h3>
      <div className="grid grid-cols-2 gap-4">
        {details.map(({ icon, label, value }, index) => (
          <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="text-gray-600">{icon}</div>
            <div>
              <div className="text-sm text-gray-600">{label}</div>
              <div className="font-semibold">{value}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main Weather Display Component
const WeatherDisplay = ({ weather, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading weather data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 mb-2">⚠️</div>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="text-center py-8">
        <WeatherIcon weatherMain="clear" size={80} />
        <p className="mt-4 text-gray-600">Search for a location to see weather data</p>
      </div>
    );
  }

  const { main, weather: weatherArray, name, sys } = weather;
  const currentWeather = weatherArray[0];

  return (
    <div className="text-center">
      {/* Temperature and Icon */}
      <div className="mb-6">
        <WeatherIcon weatherMain={currentWeather.main} size={80} />
        <div className="mt-4">
          <div className="text-4xl font-bold">{Math.round(main.temp)}°F</div>
          <div className="text-gray-600 capitalize">{currentWeather.description}</div>
        </div>
      </div>

      {/* Location */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold">{name}, {sys.country}</h2>
      </div>

      {/* Weather Details */}
      <WeatherDetails weather={weather} />
    </div>
  );
};

// Main App Component
const WeatherApp = () => {
  const [weather, setWeather] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load default weather on initial render
  useEffect(() => {
    handleSearch('New York'); // Default location
  }, []);

  const handleSearch = async (query) => {
    setIsLoading(true);
    setError(null);

    try {
      const weatherData = await weatherService.getWeatherByLocation(query);
      setWeather(weatherData);
    } catch (err) {
      setError(err.message);
      setWeather(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-detect user location (bonus feature)
  const handleLocationDetection = () => {
    if ('geolocation' in navigator) {
      setIsLoading(true);
      setError(null);

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const weatherData = await weatherService.getWeatherByCoordinates(latitude, longitude);
            setWeather(weatherData);
          } catch (err) {
            setError(err.message);
          } finally {
            setIsLoading(false);
          }
        },
        (err) => {
          setError('Unable to get your location. Please search manually.');
          setIsLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 py-8 px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">Pablotech Weather App</h1>
            <div className="flex justify-center items-center gap-2 mb-4">
              <Sun size={24} className="text-yellow-500" />
              <Cloud size={20} className="text-gray-500" />
              <CloudRain size={22} className="text-blue-500" />
            </div>
            <p className="text-gray-600">Find Weather of a City</p>
          </div>

          {/* Search Bar */}
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />

          {/* Location Detection Button */}
          <div className="text-center mb-6">
            <button
              onClick={handleLocationDetection}
              disabled={isLoading}
              className="text-blue-600 hover:text-blue-800 text-sm underline disabled:text-gray-400"
            >
              📍 Use My Current Location
            </button>
          </div>

          {/* Weather Display */}
          <WeatherDisplay weather={weather} isLoading={isLoading} error={error} />
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-gray-600 text-sm">
          <p>Powered by OpenWeatherMap API</p>
        </div>
      </div>
    </div>
  );
};

export default WeatherApp;