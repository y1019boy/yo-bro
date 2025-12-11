

// Default location (Tokyo) if geolocation fails
export const DEFAULT_LAT = 35.6895;
export const DEFAULT_LON = 139.6917;

// NHK News RSS Feed (Default)
export const NHK_RSS_URL = 'https://www.nhk.or.jp/rss/news/cat0.xml';

export const NEWS_CATEGORIES = [
  { id: 'cat0', name: '主要', url: 'https://www.nhk.or.jp/rss/news/cat0.xml' },
  { id: 'cat1', name: '社会', url: 'https://www.nhk.or.jp/rss/news/cat1.xml' },
  { id: 'cat2', name: '文化・エンタメ', url: 'https://www.nhk.or.jp/rss/news/cat2.xml' },
  { id: 'cat3', name: '科学・医療', url: 'https://www.nhk.or.jp/rss/news/cat3.xml' },
  { id: 'cat4', name: '政治', url: 'https://www.nhk.or.jp/rss/news/cat4.xml' },
  { id: 'cat5', name: '経済', url: 'https://www.nhk.or.jp/rss/news/cat5.xml' },
  { id: 'cat6', name: '国際', url: 'https://www.nhk.or.jp/rss/news/cat6.xml' },
  { id: 'cat7', name: 'スポーツ', url: 'https://www.nhk.or.jp/rss/news/cat7.xml' },
];

// Open Meteo WMO Weather Codes mapping to simple descriptions/icons
export const WEATHER_CODES: Record<number, string> = {
  0: '快晴',
  1: '晴れ',
  2: '一部曇り',
  3: '曇り',
  45: '霧',
  48: '霧氷',
  51: '霧雨',
  53: '霧雨',
  55: '霧雨',
  61: '小雨',
  63: '雨',
  65: '大雨',
  71: '小雪',
  73: '雪',
  75: '大雪',
  80: 'にわか雨',
  81: 'にわか雨',
  82: '激しい雨',
  95: '雷雨',
  96: '雷雨',
  99: '激しい雷雨',
};

// Map codes to generic icon names
export const WEATHER_ICON_MAP: Record<number, 'sun' | 'cloud' | 'rain' | 'snow' | 'storm'> = {
  0: 'sun', 1: 'sun', 2: 'cloud', 3: 'cloud', 45: 'cloud', 48: 'cloud',
  51: 'rain', 53: 'rain', 55: 'rain', 61: 'rain', 63: 'rain', 65: 'rain',
  71: 'snow', 73: 'snow', 75: 'snow', 80: 'rain', 81: 'rain', 82: 'rain',
  95: 'storm', 96: 'storm', 99: 'storm'
};

export const QUOTES = [
  "今日できることは、明日にも延ばさないでください。",
  "千里の道も一歩から。",
  "継続は力なり。",
  "失敗は成功のもと。",
  "笑う門には福来る。",
  "一期一会。",
];