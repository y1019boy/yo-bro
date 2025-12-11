
import React from 'react';
import { NewsItem } from '../types';

interface NewsWidgetProps {
  news: NewsItem[];
  onClick: () => void;
}

const NewsWidget: React.FC<NewsWidgetProps> = ({ news, onClick }) => {
  if (news.length === 0) {
    return <div className="bg-[#111318] rounded-[2rem] h-full w-full animate-pulse"></div>;
  }

  // Take first 3-4 items for the widget list
  const displayNews = news.slice(0, 3);

  return (
    <div 
      onClick={onClick}
      className="bg-[#0f1115] rounded-[2rem] p-8 h-full flex flex-col shadow-lg overflow-hidden cursor-pointer hover:bg-[#15181e] transition-colors active:scale-[0.98] transition-transform"
    >
      <h3 className="text-xl font-bold text-white mb-6 flex justify-between items-center">
        <span>NHK ニュース (主要)</span>
        <span className="text-xs font-normal text-gray-400 bg-white/10 px-2 py-1 rounded-md">タップで詳細</span>
      </h3>
      
      <div className="flex flex-col gap-6">
        {displayNews.map((item, idx) => {
          const timeStr = new Date(item.pubDate).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
          return (
            <div key={idx} className="flex flex-col border-b border-gray-800 last:border-0 pb-4 last:pb-0">
              <span className="text-gray-400 text-sm mb-1">{timeStr}</span>
              <span className="text-lg text-gray-100 font-medium leading-snug line-clamp-2">
                {item.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NewsWidget;