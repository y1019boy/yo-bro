import React, { useState, useEffect } from 'react';
import { Alarm } from '../types';
import { Plus, Trash2, ArrowRight } from 'lucide-react';

interface AlarmScreenProps {
  alarms: Alarm[];
  setAlarms: (alarms: Alarm[]) => void;
  onClose: () => void;
}

const AlarmScreen: React.FC<AlarmScreenProps> = ({ alarms, setAlarms, onClose }) => {
  const [newTime, setNewTime] = useState('07:00');

  const addAlarm = () => {
    const newAlarm: Alarm = {
      id: Date.now().toString(),
      time: newTime,
      enabled: true,
      label: 'アラーム'
    };
    setAlarms([...alarms, newAlarm]);
  };

  const toggleAlarm = (id: string) => {
    setAlarms(alarms.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a));
  };

  const deleteAlarm = (id: string) => {
    setAlarms(alarms.filter(a => a.id !== id));
  };

  return (
    <div className="h-full w-full flex flex-col bg-slate-900 p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">アラーム設定</h2>
        <button 
          onClick={onClose}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          ホームへ戻る <ArrowRight size={20} />
        </button>
      </div>

      <div className="flex-1 flex gap-8">
        {/* Left: Alarm List */}
        <div className="flex-1 bg-white/5 rounded-3xl p-6 overflow-y-auto no-scrollbar">
          <h3 className="text-xl font-semibold mb-4 text-gray-300">保存されたアラーム</h3>
          <div className="space-y-4">
            {alarms.length === 0 && <p className="text-gray-500">アラームはありません</p>}
            {alarms.map(alarm => (
              <div key={alarm.id} className="bg-white/10 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <div className="text-4xl font-light">{alarm.time}</div>
                  <div className="text-xs text-gray-400">{alarm.label}</div>
                </div>
                <div className="flex items-center gap-4">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={alarm.enabled}
                      onChange={() => toggleAlarm(alarm.id)}
                    />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                  <button onClick={() => deleteAlarm(alarm.id)} className="text-red-400 hover:text-red-300">
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Add Alarm */}
        <div className="w-1/3 bg-blue-900/20 border border-blue-500/30 rounded-3xl p-6 flex flex-col justify-center items-center">
          <h3 className="text-xl font-semibold mb-6">新規追加</h3>
          <input 
            type="time" 
            value={newTime}
            onChange={(e) => setNewTime(e.target.value)}
            className="text-5xl bg-transparent border-b-2 border-white/20 text-center focus:outline-none focus:border-blue-500 mb-8 p-2"
          />
          <button 
            onClick={addAlarm}
            className="bg-blue-600 hover:bg-blue-500 text-white rounded-full p-4 shadow-lg transition-transform active:scale-95"
          >
            <Plus size={32} />
          </button>
        </div>
      </div>
      <div className="mt-4 text-center text-gray-500 text-sm">
        ヒント: ホーム画面で左にスワイプするとこの画面に戻ります
      </div>
    </div>
  );
};

export default AlarmScreen;