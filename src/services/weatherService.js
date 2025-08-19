// Weather API service
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

const weatherService = {
  async getWeatherByLocation(query) {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${API_KEY}&units=imperial`
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
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=imperial`
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

export default weatherService;
