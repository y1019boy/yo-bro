import React, { useEffect, useRef, useState } from 'react';
import { Mic, X, Loader2, Volume2 } from 'lucide-react';

interface AssistantOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  isListening: boolean;
  isProcessing: boolean;
  transcript: string;
  response: string;
}

const AssistantOverlay: React.FC<AssistantOverlayProps> = ({ 
  isOpen, onClose, isListening, isProcessing, transcript, response 
}) => {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-xl flex flex-col items-center justify-center p-8 transition-opacity duration-300">
      
      {/* Close Button */}
      <button onClick={onClose} className="absolute top-8 right-8 text-white/50 hover:text-white">
        <X size={32} />
      </button>

      {/* Visualizer / Status Icon */}
      <div className="mb-8 relative">
        <div className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500
          ${isListening ? 'bg-red-500 animate-pulse shadow-[0_0_50px_rgba(239,68,68,0.5)]' : 
            isProcessing ? 'bg-blue-500 animate-spin' : 'bg-gradient-to-tr from-blue-500 to-purple-500'}
        `}>
          {isProcessing ? (
             <Loader2 size={40} className="text-white" />
          ) : (
             <Mic size={40} className="text-white" />
          )}
        </div>
      </div>

      {/* Transcript / User Input */}
      <div className="text-2xl font-light text-gray-400 text-center mb-8 h-8">
        {transcript || (isListening ? "お話しください..." : "")}
      </div>

      {/* AI Response */}
      {response && (
        <div className="text-3xl md:text-4xl font-bold text-white text-center max-w-4xl leading-relaxed animate-in fade-in slide-in-from-bottom-4">
          "{response}"
        </div>
      )}
      
      {!isListening && !isProcessing && !response && (
         <p className="text-gray-500 mt-4">マイクボタンを押して話しかけてください</p>
      )}

    </div>
  );
};

export default AssistantOverlay;