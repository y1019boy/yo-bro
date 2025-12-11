import React, { useEffect, useState } from 'react';

const Clock: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Format: HH:MM:SS
  const timeString = time.toLocaleTimeString('ja-JP', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  // Format: YYYY年MM月DD日(W)
  const dateString = time.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  });

  return (
    <div className="flex flex-col items-start">
      <div className="font-light tracking-tight leading-none text-white font-[Inter]" style={{ fontSize: 'clamp(6rem, 18vw, 13rem)' }}>
        {timeString}
      </div>
      <div className="text-3xl md:text-5xl font-light text-gray-200 mt-2 ml-2">
        {dateString}
      </div>
    </div>
  );
};

export default Clock;