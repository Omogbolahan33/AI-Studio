import React, { useState, useRef, useEffect } from 'react';
import { PlayCircleIcon, PauseCircleIcon } from '../types';

interface VoiceNotePlayerProps {
  audioUrl: string; // In a real app, this would be a URL
  duration: number; // in seconds
}

export const VoiceNotePlayer: React.FC<VoiceNotePlayerProps> = ({ audioUrl, duration }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<number | null>(null);

  const togglePlay = () => {
    setIsPlaying(prev => !prev);
  };

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = window.setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 0;
          }
          return prev + (100 / duration);
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, duration]);
  
  useEffect(() => {
    if (!isPlaying) {
        setProgress(0);
    }
  }, [isPlaying]);

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center space-x-2 w-48">
      <button onClick={togglePlay}>
        {isPlaying ? <PauseCircleIcon className="w-8 h-8 opacity-90" /> : <PlayCircleIcon className="w-8 h-8 opacity-90" />}
      </button>
      <div className="flex-1 h-1.5 bg-white/30 rounded-full">
        <div 
            className="h-1.5 bg-white rounded-full"
            style={{ width: `${progress}%`, transition: isPlaying ? 'width 1s linear' : 'none' }}
        ></div>
      </div>
      <span className="text-xs font-mono">{formatTime(duration)}</span>
    </div>
  );
};
