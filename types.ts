export interface WeatherData {
  current: {
    temp: number;
    code: number;
    humidity: number;
    windSpeed: number;
    windDirection: number;
  };
  daily: {
    max: number[];
    min: number[];
    codes: number[];
    dates: string[];
  };
  hourly: {
    times: string[];
    temps: number[];
    codes: number[];
  };
}

export interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  image?: string;
}

export interface Alarm {
  id: string;
  time: string; // HH:mm format
  enabled: boolean;
  label: string;
}

export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  ALARMS = 'ALARMS',
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}