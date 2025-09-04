
import React, { useState, useRef, useEffect } from 'react';
import type { Message } from '../types';
import { PaperAirplaneIcon, MicrophoneIcon, FaceSmileIcon, XMarkIcon, StopIcon } from '../types';
import { StickerPanel } from './StickerPanel';

interface ChatInputProps {
  onSubmit: (message: Omit<Message, 'id' | 'sender' | 'timestamp' | 'replyTo'>) => void;
  replyingTo: Message | null;
  onClearReply: () => void;
  allStickers: string[];
  savedStickers: string[];
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSubmit, replyingTo, onClearReply, allStickers, savedStickers }) => {
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isStickerPanelOpen, setIsStickerPanelOpen] = useState(false);
  const recordingTimerRef = useRef<number | null>(null);

  const startRecording = () => {
    setIsRecording(true);
    recordingTimerRef.current = window.setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
    }
    if (recordingTime > 0) {
      onSubmit({ voiceNote: { audioUrl: '', duration: recordingTime }});
    }
    setRecordingTime(0);
  };
  
  const handleMicrophoneClick = () => {
      if(isRecording) {
          stopRecording();
      } else {
          startRecording();
      }
  };

  const handleSendText = () => {
    if (text.trim()) {
      onSubmit({ text: text.trim() });
      setText('');
    }
  };
  
  const handleSendSticker = (stickerUrl: string) => {
    onSubmit({ stickerUrl });
    setIsStickerPanelOpen(false);
  };

  useEffect(() => {
    return () => { // Cleanup on unmount
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
      }
    };
  }, []);

  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const getMessagePreview = (message: Message): string => {
    if (message.text) return message.text;
    if (message.stickerUrl) return 'Sticker';
    if (message.voiceNote) return 'Voice Note';
    if (message.attachment) return `Attachment: ${message.attachment.name}`;
    return '...';
  }

  return (
    <div className="p-2 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-surface flex-shrink-0">
      {replyingTo && (
        <div className="px-3 py-2 text-sm bg-gray-100 dark:bg-gray-600 rounded-t-lg flex justify-between items-center">
          <div>
            <p className="font-semibold text-text-secondary dark:text-dark-text-secondary">Replying to {replyingTo.sender}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{getMessagePreview(replyingTo)}</p>
          </div>
          <button onClick={onClearReply} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-500">
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
      )}
      <div className="flex items-end space-x-2">
        <div className="relative">
          <button onClick={() => setIsStickerPanelOpen(p => !p)} className="p-2 text-gray-500 hover:text-primary transition-colors">
            <FaceSmileIcon className="w-6 h-6" />
          </button>
          {isStickerPanelOpen && (
            <StickerPanel 
                allStickers={allStickers}
                savedStickers={savedStickers}
                onSelectSticker={handleSendSticker}
                onClose={() => setIsStickerPanelOpen(false)}
            />
          )}
        </div>
        
        <div className="flex-1">
          {isRecording ? (
            <div className="w-full flex items-center justify-center p-2 bg-gray-100 dark:bg-gray-700 rounded-full">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-2"></div>
              <span className="font-mono text-sm text-red-500">{formatRecordingTime(recordingTime)}</span>
            </div>
          ) : (
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendText();
                }
              }}
              placeholder="Type a message..."
              className="w-full p-2 border-none bg-gray-100 dark:bg-gray-700 rounded-xl resize-none focus:ring-0 text-sm max-h-24"
              rows={1}
            />
          )}
        </div>

        {text.trim() ? (
          <button onClick={handleSendText} className="p-2 text-white bg-primary rounded-full hover:bg-primary-hover transition-colors">
            <PaperAirplaneIcon className="w-6 h-6" />
          </button>
        ) : (
          <button onMouseDown={startRecording} onMouseUp={stopRecording} onTouchStart={startRecording} onTouchEnd={stopRecording} className={`p-2 rounded-full transition-colors ${isRecording ? 'bg-red-500 text-white' : 'text-gray-500 hover:text-primary'}`}>
            {isRecording ? <StopIcon className="w-6 h-6" /> : <MicrophoneIcon className="w-6 h-6" />}
          </button>
        )}
      </div>
    </div>
  );
};
