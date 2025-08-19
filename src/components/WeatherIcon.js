import React from 'react';
import { Cloud, Sun, CloudRain } from 'lucide-react';

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

export default WeatherIcon;
