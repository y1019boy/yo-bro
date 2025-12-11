import { WeatherData } from '../types';

export const fetchWeather = async (lat: number, lon: number): Promise<WeatherData> => {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch weather');
    }

    const data = await response.json();

    return {
      current: {
        temp: data.current.temperature_2m,
        code: data.current.weather_code,
        humidity: data.current.relative_humidity_2m,
        windSpeed: data.current.wind_speed_10m,
        windDirection: data.current.wind_direction_10m,
      },
      daily: {
        max: data.daily.temperature_2m_max,
        min: data.daily.temperature_2m_min,
        codes: data.daily.weather_code,
        dates: data.daily.time,
      },
      hourly: {
        times: data.hourly.time,
        temps: data.hourly.temperature_2m,
        codes: data.hourly.weather_code,
      }
    };
  } catch (error) {
    console.error('Weather API Error:', error);
    // Return empty fallback structure
    return {
      current: { temp: 0, code: 0, humidity: 0, windSpeed: 0, windDirection: 0 },
      daily: { max: [], min: [], codes: [], dates: [] },
      hourly: { times: [], temps: [], codes: [] },
    };
  }
};