import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ViewState, Alarm, Coordinates, NewsItem, WeatherData } from './types';
import { DEFAULT_LAT, DEFAULT_LON } from './constants';
import { fetchWeather } from './services/weatherService';
import { fetchNews } from './services/newsService';
import { generateGeminiResponse } from './services/geminiService';

import Clock from './components/Clock';
import WeatherWidget from './components/WeatherWidget';
import NewsWidget from './components/NewsWidget';
import AlarmScreen from './components/AlarmScreen';
import NewsModal from './components/NewsModal';
import WeatherModal from './components/WeatherModal';
import { Mic, Bell, LayoutGrid, Sparkles, Maximize2, ArrowRight, Loader2, XCircle } from 'lucide-react';

const App: React.FC = () => {
  // --- State ---
  const [view, setView] = useState<ViewState>(ViewState.DASHBOARD);
  
  // Data
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [coordinates, setCoordinates] = useState<Coordinates>({ latitude: DEFAULT_LAT, longitude: DEFAULT_LON });
  
  // UI Theme
  const [bgGradient, setBgGradient] = useState('bg-[#05050A]');

  // Modals
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);
  const [isWeatherModalOpen, setIsWeatherModalOpen] = useState(false);
  
  // Alarms
  const [alarms, setAlarms] = useState<Alarm[]>(() => {
    const saved = localStorage.getItem('alarms');
    return saved ? JSON.parse(saved) : [];
  });
  const [ringingAlarm, setRingingAlarm] = useState<Alarm | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Assistant State
  // Status: 'IDLE' | 'LISTENING' | 'PROCESSING' | 'DISPLAYING'
  const [assistantStatus, setAssistantStatus] = useState<'IDLE' | 'LISTENING' | 'PROCESSING' | 'DISPLAYING'>('IDLE');
  const [transcript, setTranscript] = useState('');
  const [assistantResponse, setAssistantResponse] = useState('');
  const [inputText, setInputText] = useState('');

  // --- Initialization & Data Fetching ---
  
  // 1. Geolocation & Initial Load
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoordinates({ latitude, longitude });
        loadData(latitude, longitude);
      },
      (err) => {
        console.warn("Geolocation failed, using default", err);
        loadData(DEFAULT_LAT, DEFAULT_LON);
      }
    );

    // Initial load of news
    fetchNews().then(setNews);
  }, []);

  // 2. Data Refresh Intervals (30 minutes)
  useEffect(() => {
    const REFRESH_INTERVAL = 30 * 60 * 1000; // 30 mins

    const timer = setInterval(() => {
      // Refresh Weather
      loadData(coordinates.latitude, coordinates.longitude);
      // Refresh News
      fetchNews().then(setNews);
    }, REFRESH_INTERVAL);

    return () => clearInterval(timer);
  }, [coordinates]);

  // 3. Dynamic Background based on time of day
  useEffect(() => {
    const updateBackground = () => {
      const hour = new Date().getHours();
      
      if (hour >= 5 && hour < 11) {
        // Morning: Deep Blue / Dawn
        setBgGradient('bg-gradient-to-br from-[#0f172a] to-[#1e293b]');
      } else if (hour >= 11 && hour < 17) {
        // Day: Neutral / Dark Gray
        setBgGradient('bg-gradient-to-br from-[#1c1c24] to-[#2d2d35]');
      } else {
        // Night: Deep Black / Midnight (Original)
        setBgGradient('bg-[#05050A]');
      }
    };

    updateBackground();
    // Check every minute just in case
    const interval = setInterval(updateBackground, 60000); 
    return () => clearInterval(interval);
  }, []);


  const loadData = async (lat: number, lon: number) => {
    // Only show loading state on first load if we don't have data
    if (!weather) setLoadingWeather(true);
    const wData = await fetchWeather(lat, lon);
    setWeather(wData);
    setLoadingWeather(false);
  };

  // Save alarms
  useEffect(() => {
    localStorage.setItem('alarms', JSON.stringify(alarms));
  }, [alarms]);

  // Alarm Check Logic
  useEffect(() => {
    const checkAlarms = () => {
      const now = new Date();
      const currentHm = now.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', hour12: false });
      
      if (now.getSeconds() === 0) {
        const match = alarms.find(a => a.time === currentHm && a.enabled);
        if (match) {
          triggerAlarm(match);
        }
      }
    };
    const timer = setInterval(checkAlarms, 1000);
    return () => clearInterval(timer);
  }, [alarms]);

  const triggerAlarm = (alarm: Alarm) => {
    setRingingAlarm(alarm);
    if (!audioRef.current) {
      audioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
      audioRef.current.loop = true;
    }
    audioRef.current.play().catch(e => console.error("Audio play failed", e));
  };

  const stopAlarm = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setRingingAlarm(null);
  };

  // --- Gestures & Navigation ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') setView(ViewState.ALARMS);
      if (e.key === 'ArrowRight') setView(ViewState.DASHBOARD);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const touchStart = useRef<number | null>(null);
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const touchEnd = e.changedTouches[0].clientX;
    const distance = touchStart.current - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) setView(ViewState.ALARMS);
    if (isRightSwipe) setView(ViewState.DASHBOARD);
    
    touchStart.current = null;
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  // --- Assistant Logic ---
  const handleAssistantSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;

    const text = inputText;
    setInputText('');
    setTranscript(text);
    
    setAssistantStatus('PROCESSING');
    
    const reply = await generateGeminiResponse(text);
    setAssistantResponse(reply);
    setAssistantStatus('DISPLAYING');
    
    // Speak reply
    const utterance = new SpeechSynthesisUtterance(reply);
    utterance.lang = 'ja-JP';
    window.speechSynthesis.speak(utterance);
  };

  const startListening = () => {
    setAssistantStatus('LISTENING');
    setTranscript('');
    setAssistantResponse('');

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setAssistantResponse("お使いのブラウザは音声認識をサポートしていません。");
      setAssistantStatus('DISPLAYING');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'ja-JP';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = async (event: any) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      setAssistantStatus('PROCESSING');
      
      const reply = await generateGeminiResponse(text);
      setAssistantResponse(reply);
      setAssistantStatus('DISPLAYING');
      
      const utterance = new SpeechSynthesisUtterance(reply);
      utterance.lang = 'ja-JP';
      window.speechSynthesis.speak(utterance);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech error", event.error);
      setAssistantStatus('IDLE');
    };

    recognition.start();
  };

  const closeAssistant = () => {
    setAssistantStatus('IDLE');
    setAssistantResponse('');
    setTranscript('');
    window.speechSynthesis.cancel();
  };

  // --- Render ---
  return (
    <div 
      className={`relative w-screen h-screen overflow-hidden text-white font-['Noto_Sans_JP'] transition-colors duration-1000 ease-in-out ${bgGradient}`}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Background Layer (handled by wrapper class) */}
      
      {/* Main Content Slider */}
      <div className="w-full h-full flex transition-transform duration-500 ease-out"
           style={{ transform: `translateX(${view === ViewState.DASHBOARD ? '0' : '-100%'})` }}>
        
        {/* Screen 1: Dashboard */}
        <div className="min-w-full h-full p-8 md:p-12 flex relative box-border">
          
          {/* Left Column (Clock & Input) - 65% width */}
          <div className="flex-1 flex flex-col justify-between pr-12 pb-4">
             {/* Top: Clock */}
             <div className="mt-8">
               <Clock />
             </div>

             {/* Bottom: Input / Assistant Response */}
             <div className="w-full max-w-3xl flex flex-col justify-end min-h-[300px]">
                
                {/* Assistant Interaction Area */}
                <div className="min-h-[100px] mb-6 flex flex-col justify-end">
                  {assistantStatus !== 'IDLE' ? (
                     <div className="animate-in slide-in-from-bottom-4 fade-in duration-300">
                        
                        {assistantStatus === 'PROCESSING' ? (
                          /* PROCESSING STATE */
                          <div className="flex items-center gap-4 py-8">
                             <Loader2 className="animate-spin text-blue-500" size={48} />
                             <span className="text-3xl md:text-4xl font-bold text-white animate-pulse">
                               AIが考え中...
                             </span>
                          </div>
                        ) : (
                          /* OTHER STATES */
                          <>
                            {/* Header */}
                            <div className="flex items-center gap-3 mb-4 text-gray-400">
                               {assistantStatus === 'LISTENING' && <><Mic className="animate-pulse text-red-400" /> 聞き取り中...</>}
                               {assistantStatus === 'DISPLAYING' && <><Sparkles className="text-yellow-400" /> アシスタント</>}
                            </div>

                            {/* Transcript */}
                            {transcript && (
                              <div className="mb-4 text-lg text-gray-400 italic">
                                "{transcript}"
                              </div>
                            )}

                            {/* Response */}
                            {assistantResponse && (
                              <div className="bg-[#1A1D24] border border-white/10 rounded-2xl p-6 shadow-xl relative">
                                 <button 
                                   onClick={closeAssistant}
                                   className="absolute top-2 right-2 p-2 text-gray-500 hover:text-white"
                                 >
                                   <XCircle size={20} />
                                 </button>
                                 <p className="text-xl md:text-2xl font-thin leading-relaxed text-white font-['Noto_Sans_JP']">
                                   {assistantResponse}
                                 </p>
                              </div>
                            )}
                          </>
                        )}
                     </div>
                  ) : (
                    /* IDLE STATE: Empty spacer */
                    <div className="h-4"></div>
                  )}
                </div>
                
                <form onSubmit={handleAssistantSubmit} className="relative w-full">
                  <input 
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="AIアシスタントに話しかける..."
                    className="w-full bg-[#1A1D24] text-gray-200 text-lg rounded-2xl py-4 px-6 pr-14 border border-white/10 focus:outline-none focus:border-white/30 transition-colors placeholder-gray-500"
                  />
                  <div className="absolute right-2 top-2 bottom-2 flex gap-2">
                    <button 
                      type="button"
                      onClick={startListening}
                      className="bg-transparent hover:bg-white/10 text-gray-400 hover:text-white p-3 rounded-xl transition-colors"
                    >
                      <Mic size={20} />
                    </button>
                    <button 
                      type="submit"
                      className="bg-[#2C3038] hover:bg-[#3A404A] text-white p-3 rounded-xl transition-colors"
                    >
                      <ArrowRight size={20} />
                    </button>
                  </div>
                </form>
             </div>
          </div>

          {/* Right Column (Widgets) - 35% width */}
          <div className="w-[400px] flex flex-col gap-6">
            <div className="h-[280px]">
              <WeatherWidget 
                data={weather} 
                loading={loadingWeather} 
                onClick={() => setIsWeatherModalOpen(true)}
              />
            </div>
            <div className="flex-1">
              <NewsWidget news={news} onClick={() => setIsNewsModalOpen(true)} />
            </div>
          </div>

          {/* Floating Action Menu (Bottom Right) */}
          <div className="absolute bottom-8 right-8 flex flex-col gap-4 bg-[#1A1D24] p-2 rounded-full border border-white/5">
             <button onClick={() => setView(ViewState.ALARMS)} className="p-3 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors">
               <LayoutGrid size={24} />
             </button>
             <button onClick={toggleFullscreen} className="p-3 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors">
               <Maximize2 size={24} />
             </button>
          </div>
          
        </div>

        {/* Screen 2: Alarms */}
        <div className="min-w-full h-full">
          <AlarmScreen 
            alarms={alarms} 
            setAlarms={setAlarms} 
            onClose={() => setView(ViewState.DASHBOARD)} 
          />
        </div>
      </div>

      {/* Full Screen News Modal */}
      <NewsModal 
        isOpen={isNewsModalOpen} 
        onClose={() => setIsNewsModalOpen(false)} 
      />

      {/* Full Screen Weather Modal */}
      <WeatherModal 
        isOpen={isWeatherModalOpen} 
        onClose={() => setIsWeatherModalOpen(false)} 
        data={weather}
      />

      {/* Ringing Alarm Overlay */}
      {ringingAlarm && (
        <div className="absolute inset-0 z-[60] bg-black/90 flex flex-col items-center justify-center animate-pulse">
          <Bell size={100} className="text-red-500 mb-8 animate-bounce" />
          <h1 className="text-[10rem] font-bold leading-none mb-4">{ringingAlarm.time}</h1>
          <p className="text-4xl text-gray-300 mb-16">{ringingAlarm.label}</p>
          <button 
            onClick={stopAlarm}
            className="bg-white text-black px-16 py-8 rounded-full text-4xl font-bold shadow-2xl hover:scale-105 transition-transform"
          >
            停止
          </button>
        </div>
      )}

    </div>
  );
};

export default App;