import React from 'react';
import { Wind, Eye, Droplets, Thermometer } from 'lucide-react';

const WeatherDetails = ({ weather }) => {
  const { main, wind, visibility } = weather;
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

export default WeatherDetails;
