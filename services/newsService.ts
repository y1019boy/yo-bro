
import { NHK_RSS_URL } from '../constants';
import { NewsItem } from '../types';

export const fetchNews = async (url: string = NHK_RSS_URL): Promise<NewsItem[]> => {
  try {
    // Use rss2json service to convert RSS to JSON and handle CORS limitations reliably
    const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch news');
    }

    const data = await response.json();
    
    if (data.status !== 'ok') {
      throw new Error('RSS API returned error status');
    }

    // api.rss2json.com returns items in a specific format
    // Return more items (up to 20) for the modal view
    const items = data.items.slice(0, 20);

    return items.map((item: any) => ({
      title: item.title || 'No Title',
      link: item.link || '#',
      pubDate: item.pubDate || new Date().toISOString(), // rss2json returns YYYY-MM-DD HH:mm:ss
      image: item.thumbnail || undefined,
    }));
  } catch (error) {
    console.error('News Fetch Error:', error);
    return [
      {
        title: 'ニュースの読み込みに失敗しました',
        link: '#',
        pubDate: new Date().toISOString(),
      }
    ];
  }
};