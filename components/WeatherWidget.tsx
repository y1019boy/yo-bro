import React from 'react';
import { Cloud, CloudRain, CloudSnow, Sun, CloudLightning, MoreHorizontal } from 'lucide-react';
import { WeatherData } from '../types';
import { WEATHER_ICON_MAP, WEATHER_CODES } from '../constants';

interface WeatherWidgetProps {
  data: WeatherData | null;
  loading: boolean;
  onClick?: () => void;
}

const WeatherWidget: React.FC<WeatherWidgetProps> = ({ data, loading, onClick }) => {
  if (loading || !data) {
    return <div className="animate-pulse bg-[#111318] rounded-3xl h-64 w-full"></div>;
  }

  const getIcon = (code: number, size = 64) => {
    const type = WEATHER_ICON_MAP[code] || 'sun';
    const props = { size, className: "font-light" };
    switch (type) {
      case 'sun': return <Sun {...props} className="text-white" />;
      case 'rain': return <CloudRain {...props} className="text-blue-300" />;
      case 'snow': return <CloudSnow {...props} className="text-white" />;
      case 'storm': return <CloudLightning {...props} className="text-yellow-200" />;
      default: return <Cloud {...props} className="text-gray-300" />;
    }
  };

  const weatherText = WEATHER_CODES[data.current.code] || '不明';
  const minTemp = Math.round(data.daily.min[0]);
  const maxTemp = Math.round(data.daily.max[0]);
  const lastUpdated = new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });

  return (
    <div 
      onClick={onClick}
      className="bg-[#0f1115] rounded-[2rem] p-8 flex flex-col justify-between h-full shadow-lg cursor-pointer hover:bg-[#15181e] transition-colors active:scale-[0.98] transition-transform group"
    >
      <div className="flex justify-between items-start">
        <div className="flex flex-col">
          <span className="text-xl font-bold text-white mb-1">現在地</span>
        </div>
        <MoreHorizontal className="text-gray-400 group-hover:text-white transition-colors" />
      </div>

      <div className="flex items-center gap-6 mt-4">
        <span className="text-8xl font-thin text-white tracking-tighter">
          {Math.round(data.current.temp)}<span className="text-6xl">°</span><span className="text-6xl text-gray-400">C</span>
        </span>
        <div className="flex flex-col justify-center">
            <span className="text-3xl font-light text-white whitespace-nowrap">{weatherText}</span>
        </div>
      </div>

      <div className="mt-auto pt-4">
        <div className="text-gray-400 text-lg group-hover:text-gray-200 transition-colors">
            最低 {minTemp}°C / 最高 {maxTemp}°C
        </div>
        <div className="text-gray-500 text-sm mt-1">
            最終更新: {lastUpdated}
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;