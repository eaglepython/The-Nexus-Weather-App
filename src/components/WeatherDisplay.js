import React from 'react';
import WeatherIcon from './WeatherIcon';
import WeatherDetails from './WeatherDetails';

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
      <div className="mb-6">
        <WeatherIcon weatherMain={currentWeather.main} size={80} />
        <div className="mt-4">
          <div className="text-4xl font-bold">{Math.round(main.temp)}°F</div>
          <div className="text-gray-600 capitalize">{currentWeather.description}</div>
        </div>
      </div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">{name}, {sys.country}</h2>
      </div>
      <WeatherDetails weather={weather} />
    </div>
  );
};

export default WeatherDisplay;
