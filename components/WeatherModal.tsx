import React, { useState, useEffect } from 'react';
import { X, Wind, Droplets, Navigation, Calendar } from 'lucide-react';
import { WeatherData } from '../types';
import { WEATHER_ICON_MAP, WEATHER_CODES } from '../constants';
import { Cloud, CloudRain, CloudSnow, Sun, CloudLightning } from 'lucide-react';

interface WeatherModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: WeatherData | null;
}

const WeatherModal: React.FC<WeatherModalProps> = ({ isOpen, onClose, data }) => {
  const [shouldRender, setShouldRender] = useState(isOpen);

  useEffect(() => {
    if (isOpen) setShouldRender(true);
  }, [isOpen]);

  const onAnimationEnd = () => {
    if (!isOpen) setShouldRender(false);
  };

  if (!shouldRender || !data) return null;

  const currentIcon = getIconComponent(data.current.code, 48);

  // Format Hourly Data (take next 24 hours)
  const currentHour = new Date().getHours();
  const hourlyData = data.hourly.times
    .map((t, i) => ({
      time: new Date(t),
      temp: data.hourly.temps[i],
      code: data.hourly.codes[i],
    }))
    .filter(h => h.time.getHours() >= currentHour || h.time.getDate() > new Date().getDate())
    .slice(0, 24);

  // Format Daily Data
  const dailyData = data.daily.dates.map((d, i) => ({
    date: new Date(d),
    max: data.daily.max[i],
    min: data.daily.min[i],
    code: data.daily.codes[i],
  }));

  return (
    <div 
      className={`fixed inset-0 z-50 bg-[#05050A] text-white flex flex-col ${isOpen ? 'modal-enter' : 'modal-exit'}`}
      onAnimationEnd={onAnimationEnd}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/10 bg-[#0f1115]">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          詳細天気予報
        </h2>
        <button 
          onClick={onClose}
          className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 md:p-10">
        <div className="max-w-6xl mx-auto space-y-10">
          
          {/* Current Conditions Large */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-gradient-to-br from-blue-900/30 to-slate-900/50 p-8 rounded-3xl border border-white/5">
            <div className="flex items-center gap-8">
              <div className="scale-150 transform">
                {getIconComponent(data.current.code, 100)}
              </div>
              <div>
                <div className="text-8xl font-thin tracking-tighter">
                  {Math.round(data.current.temp)}°
                </div>
                <div className="text-2xl text-gray-300">
                  {WEATHER_CODES[data.current.code]}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-12 gap-y-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/10 rounded-full">
                   <Droplets size={24} className="text-blue-300" />
                </div>
                <div>
                  <div className="text-sm text-gray-400">湿度</div>
                  <div className="text-xl font-semibold">{data.current.humidity}%</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/10 rounded-full">
                   <Wind size={24} className="text-green-300" />
                </div>
                <div>
                  <div className="text-sm text-gray-400">風速</div>
                  <div className="text-xl font-semibold">{data.current.windSpeed} km/h</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/10 rounded-full">
                   <Navigation size={24} className="text-orange-300" style={{ transform: `rotate(${data.current.windDirection}deg)` }} />
                </div>
                <div>
                  <div className="text-sm text-gray-400">風向</div>
                  <div className="text-xl font-semibold">{getWindDirection(data.current.windDirection)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Hourly Forecast */}
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-300">
              <div className="w-1 h-6 bg-blue-500 rounded-full"></div> 1時間ごとの天気
            </h3>
            <div className="flex overflow-x-auto pb-4 gap-4 no-scrollbar">
              {hourlyData.map((hour, idx) => (
                <div key={idx} className="min-w-[80px] flex flex-col items-center bg-[#1A1D24] p-4 rounded-2xl border border-white/5">
                  <span className="text-gray-400 text-sm mb-2">
                    {hour.time.getHours()}:00
                  </span>
                  <div className="my-2">
                    {getIconComponent(hour.code, 32)}
                  </div>
                  <span className="text-xl font-semibold">
                    {Math.round(hour.temp)}°
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Forecast */}
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-300">
               <div className="w-1 h-6 bg-purple-500 rounded-full"></div> 週間天気予報
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {dailyData.map((day, idx) => {
                const isToday = idx === 0;
                const dateStr = day.date.toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric', weekday: 'short' });
                return (
                  <div key={idx} className={`flex items-center justify-between p-4 rounded-2xl border ${isToday ? 'bg-white/10 border-white/20' : 'bg-[#1A1D24] border-white/5'}`}>
                    <div className="flex items-center gap-4">
                      {getIconComponent(day.code, 32)}
                      <span className={`text-lg ${isToday ? 'font-bold' : 'font-medium'}`}>{dateStr}</span>
                    </div>
                    <div className="flex gap-3">
                      <span className="text-blue-300 font-semibold">{Math.round(day.min)}°</span>
                      <span className="text-gray-500">/</span>
                      <span className="text-white font-semibold">{Math.round(day.max)}°</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

// Helper for Icons
const getIconComponent = (code: number, size: number) => {
  const type = WEATHER_ICON_MAP[code] || 'sun';
  const props = { size, className: "font-light" };
  switch (type) {
    case 'sun': return <Sun {...props} className="text-yellow-400" />;
    case 'rain': return <CloudRain {...props} className="text-blue-400" />;
    case 'snow': return <CloudSnow {...props} className="text-white" />;
    case 'storm': return <CloudLightning {...props} className="text-yellow-200" />;
    default: return <Cloud {...props} className="text-gray-400" />;
  }
};

const getWindDirection = (deg: number) => {
  const directions = ['北', '北東', '東', '南東', '南', '南西', '西', '北西'];
  const index = Math.round(((deg %= 360) < 0 ? deg + 360 : deg) / 45) % 8;
  return directions[index];
};

export default WeatherModal;