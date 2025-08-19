import React, { useState, useEffect } from 'react';
import { Sun, Cloud, CloudRain } from 'lucide-react';
import SearchBar from './SearchBar';
import WeatherDisplay from './WeatherDisplay';
import weatherService from '../services/weatherService';

const WeatherApp = () => {
  const [weather, setWeather] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">Pablotech Weather App</h1>
            <div className="flex justify-center items-center gap-2 mb-4">
              <Sun size={24} className="text-yellow-500" />
              <Cloud size={20} className="text-gray-500" />
              <CloudRain size={22} className="text-blue-500" />
            </div>
            <p className="text-gray-600">Find Weather of a City</p>
          </div>
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
          <div className="text-center mb-6">
            <button
              onClick={handleLocationDetection}
              disabled={isLoading}
              className="text-blue-600 hover:text-blue-800 text-sm underline disabled:text-gray-400"
            >
              📍 Use My Current Location
            </button>
          </div>
          <WeatherDisplay weather={weather} isLoading={isLoading} error={error} />
        </div>
        <div className="text-center mt-6 text-gray-600 text-sm">
          <p>Powered by OpenWeatherMap API</p>
        </div>
      </div>
    </div>
  );
};

export default WeatherApp;
