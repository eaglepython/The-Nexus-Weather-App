import React, { useState, useEffect } from 'react';
import {
  Cloud, Sun, CloudRain, CloudSnow, CloudDrizzle, MapPin,
  Thermometer, Droplets, Wind, Eye, Gauge, Sunrise
} from 'lucide-react';

// ====== Config & Styles ======
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || '99e20b6c30de1c18dbf98b6dbe983e5e';

const glassStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
};

// ====== Utility Components ======
const WeatherIcon = ({ condition, size = 24 }) => {
  const iconMap = {
    'clear sky': Sun,
    'few clouds': Cloud,
    'scattered clouds': Cloud,
    'broken clouds': Cloud,
    'overcast clouds': Cloud,
    'shower rain': CloudDrizzle,
    'rain': CloudRain,
    'thunderstorm': CloudRain,
    'snow': CloudSnow,
    'mist': Cloud,
    'haze': Cloud,
    'fog': Cloud
  };
  const IconComponent = iconMap[condition?.toLowerCase()] || Cloud;
  return <IconComponent size={size} style={{ color: '#3b82f6' }} />;
};

function Clock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  return (
    <div style={{
      color: '#3b82f6',
      fontWeight: 'bold',
      fontSize: 20,
      marginBottom: 16
    }}>
      {time.toLocaleTimeString()}
    </div>
  );
}

// ====== Main App Component ======
function App() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [city, setCity] = useState('Dallas, Texas');

  // --- Fetch Weather Data ---
  const fetchWeather = async (cityName) => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      if (!response.ok) throw new Error('City not found');
      const data = await response.json();
      setWeather(data);

      // Fetch 5-day forecast
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      if (forecastResponse.ok) {
        const forecastData = await forecastResponse.json();
        setForecast(forecastData);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchWeather(city); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (city.trim()) fetchWeather(city.trim());
  };

  // --- Loading State ---
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #e0f2fe, #b3e5fc)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #e5e7eb',
            borderTop: '4px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <p style={{ color: '#6b7280' }}>Loading weather data...</p>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  // --- Error State ---
  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #e0f2fe, #b3e5fc)'
      }}>
        <div style={{
          textAlign: 'center',
          maxWidth: '400px',
          padding: '32px',
          ...glassStyle,
          borderRadius: '16px'
        }}>
          <Cloud size={48} style={{ color: '#ef4444', margin: '0 auto 16px' }} />
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc2626', marginBottom: '8px' }}>Weather Unavailable</h2>
          <p style={{ color: '#6b7280', marginBottom: '24px' }}>{error}</p>
          <button
            onClick={() => fetchWeather(city)}
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              border: 'none',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // --- Prepare Forecast Data ---
  const dailyForecast = forecast?.list?.filter((_, index) => index % 8 === 0).slice(0, 5) || [];

  // --- Main Render ---
  return (
    <div style={{
      minHeight: '100vh',
      padding: '16px',
      background: 'linear-gradient(135deg, #e0f2fe, #b3e5fc)'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <header style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{
            fontSize: '48px',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '8px'
          }}>
            Nexus Weather
          </h1>
          <p style={{ color: '#6b7280', fontSize: '18px' }}>Advanced Weather Intelligence Platform</p>
          <Clock />
        </header>

        {/* Search */}
        <div style={{ maxWidth: '600px', margin: '0 auto 32px' }}>
          <form onSubmit={handleSearch}>
            <div style={{ position: 'relative' }}>
              <MapPin size={20} style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#6b7280'
              }} />
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city name..."
                style={{
                  width: '100%',
                  padding: '16px 16px 16px 48px',
                  fontSize: '16px',
                  border: 'none',
                  borderRadius: '16px',
                  ...glassStyle,
                  outline: 'none'
                }}
              />
              <button
                type="submit"
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Search
              </button>
            </div>
          </form>
        </div>

        {/* Weather Display */}
        {weather && (
          <>
            {/* Current Weather */}
            <div style={{
              ...glassStyle,
              borderRadius: '24px',
              padding: '32px',
              marginBottom: '24px'
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '32px',
                alignItems: 'center'
              }}>
                {/* Location & Main Weather */}
                <div style={{ textAlign: 'center' }}>
                  <h2 style={{
                    fontSize: '32px',
                    fontWeight: 'bold',
                    color: '#1e293b',
                    marginBottom: '8px'
                  }}>
                    {weather.name}, {weather.sys.country}
                  </h2>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '16px',
                    marginBottom: '16px'
                  }}>
                    <WeatherIcon condition={weather.weather[0].description} size={64} />
                    <div>
                      <div style={{
                        fontSize: '56px',
                        fontWeight: 'bold',
                        color: '#1e293b'
                      }}>
                        {Math.round(weather.main.temp)}°C
                      </div>
                      <div style={{
                        fontSize: '18px',
                        color: '#6b7280',
                        textTransform: 'capitalize'
                      }}>
                        {weather.weather[0].description}
                      </div>
                    </div>
                  </div>
                  <div style={{ color: '#6b7280' }}>
                    Feels like {Math.round(weather.main.feels_like)}°C
                  </div>
                </div>

                {/* Weather Details Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                  gap: '16px'
                }}>
                  <div style={{
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    padding: '16px',
                    borderRadius: '12px',
                    textAlign: 'center'
                  }}>
                    <Thermometer size={24} style={{ color: '#3b82f6', margin: '0 auto 8px' }} />
                    <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>High/Low</div>
                    <div style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b' }}>
                      {Math.round(weather.main.temp_max)}° / {Math.round(weather.main.temp_min)}°
                    </div>
                  </div>
                  <div style={{
                    backgroundColor: 'rgba(6, 182, 212, 0.1)',
                    padding: '16px',
                    borderRadius: '12px',
                    textAlign: 'center'
                  }}>
                    <Droplets size={24} style={{ color: '#06b6d4', margin: '0 auto 8px' }} />
                    <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Humidity</div>
                    <div style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b' }}>
                      {weather.main.humidity}%
                    </div>
                  </div>
                  <div style={{
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    padding: '16px',
                    borderRadius: '12px',
                    textAlign: 'center'
                  }}>
                    <Wind size={24} style={{ color: '#10b981', margin: '0 auto 8px' }} />
                    <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Wind</div>
                    <div style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b' }}>
                      {Math.round(weather.wind?.speed || 0)} m/s
                    </div>
                  </div>
                  <div style={{
                    backgroundColor: 'rgba(168, 85, 247, 0.1)',
                    padding: '16px',
                    borderRadius: '12px',
                    textAlign: 'center'
                  }}>
                    <Gauge size={24} style={{ color: '#a855f7', margin: '0 auto 8px' }} />
                    <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Pressure</div>
                    <div style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b' }}>
                      {weather.main.pressure} hPa
                    </div>
                  </div>
                  {weather.visibility && (
                    <div style={{
                      backgroundColor: 'rgba(245, 158, 11, 0.1)',
                      padding: '16px',
                      borderRadius: '12px',
                      textAlign: 'center'
                    }}>
                      <Eye size={24} style={{ color: '#f59e0b', margin: '0 auto 8px' }} />
                      <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Visibility</div>
                      <div style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b' }}>
                        {Math.round(weather.visibility / 1000)} km
                      </div>
                    </div>
                  )}
                  <div style={{
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    padding: '16px',
                    borderRadius: '12px',
                    textAlign: 'center'
                  }}>
                    <Sunrise size={24} style={{ color: '#ef4444', margin: '0 auto 8px' }} />
                    <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '4px' }}>Sunrise</div>
                    <div style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b' }}>
                      {new Date(weather.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 5-Day Forecast */}
            {dailyForecast.length > 0 && (
              <div style={{
                ...glassStyle,
                borderRadius: '24px',
                padding: '32px'
              }}>
                <h3 style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#1e293b',
                  marginBottom: '24px',
                  textAlign: 'center'
                }}>
                  5-Day Forecast
                </h3>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '16px'
                }}>
                  {dailyForecast.map((day, index) => (
                    <div
                      key={index}
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.6)',
                        borderRadius: '16px',
                        padding: '20px',
                        textAlign: 'center',
                        border: '1px solid rgba(255, 255, 255, 0.4)',
                        transition: 'transform 0.2s'
                      }}
                    >
                      <div style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: '#374151',
                        marginBottom: '8px'
                      }}>
                        {new Date(day.dt * 1000).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
                      </div>
                      <WeatherIcon condition={day.weather[0].description} size={32} />
                      <div style={{
                        fontSize: '20px',
                        fontWeight: 'bold',
                        color: '#1e293b',
                        margin: '8px 0'
                      }}>
                        {Math.round(day.main.temp)}°C
                      </div>
                      <div style={{
                        fontSize: '14px',
                        color: '#6b7280',
                        textTransform: 'capitalize'
                      }}>
                        {day.weather[0].description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Footer */}
        <footer style={{ textAlign: 'center', marginTop: '32px', color: '#6b7280' }}>
          <p>Powered by OpenWeatherMap API</p>
          <p style={{ fontSize: '14px', marginTop: '8px' }}>
            Nexus Weather - Your gateway to accurate weather insights
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
