import React, { useState, useEffect } from 'react';
import { X, ExternalLink, RefreshCw } from 'lucide-react';
import { NewsItem } from '../types';
import { fetchNews } from '../services/newsService';
import { NEWS_CATEGORIES } from '../constants';

interface NewsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewsModal: React.FC<NewsModalProps> = ({ isOpen, onClose }) => {
  const [activeCategory, setActiveCategory] = useState(NEWS_CATEGORIES[0]);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [shouldRender, setShouldRender] = useState(isOpen);

  // Animation logic: Render immediately on open, delay unmount on close
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      loadNews(activeCategory.url);
    }
  }, [isOpen]);

  const onAnimationEnd = () => {
    if (!isOpen) {
      setShouldRender(false);
    }
  };

  const loadNews = async (url: string) => {
    setLoading(true);
    const items = await fetchNews(url);
    setNewsItems(items);
    setLoading(false);
  };

  if (!shouldRender) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 bg-[#05050A] text-white flex flex-col ${isOpen ? 'modal-enter' : 'modal-exit'}`}
      onAnimationEnd={onAnimationEnd}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/10 bg-[#0f1115]">
        <h2 className="text-2xl font-bold">NHK ニュース</h2>
        <button 
          onClick={onClose}
          className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      {/* Categories Tabs */}
      <div className="flex overflow-x-auto p-4 gap-3 bg-[#0f1115] no-scrollbar shadow-md">
        {NEWS_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat)}
            className={`px-6 py-3 rounded-full whitespace-nowrap text-lg font-medium transition-colors ${
              activeCategory.id === cat.id 
                ? 'bg-blue-600 text-white' 
                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* News List */}
      <div className="flex-1 overflow-y-auto p-6 bg-[#05050A]">
        {loading ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            <RefreshCw className="animate-spin mr-2" /> 読み込み中...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {newsItems.map((item, idx) => {
                const date = new Date(item.pubDate);
                const dateStr = date.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' });
                const timeStr = date.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
                
                return (
                  <a 
                    key={idx} 
                    href={item.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-[#1A1D24] p-6 rounded-2xl hover:bg-[#252932] transition-colors flex flex-col justify-between group h-full"
                  >
                    <div>
                      <div className="flex items-center gap-2 text-sm text-blue-400 mb-2">
                        <span>{dateStr}</span>
                        <span>{timeStr}</span>
                      </div>
                      <h3 className="text-xl font-bold leading-relaxed group-hover:text-blue-200 transition-colors mb-4">
                        {item.title}
                      </h3>
                    </div>
                    <div className="flex items-center justify-end text-gray-500 text-sm group-hover:text-white transition-colors">
                      記事を読む <ExternalLink size={16} className="ml-1" />
                    </div>
                  </a>
                );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsModal;