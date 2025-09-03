import React, { useState, useEffect, useRef } from 'react';
import type { User } from '../types';
import { PhoneIcon, MicrophoneIcon, MicrophoneSlashIcon } from '../types';

interface CallModalProps {
  currentUser: User;
  otherUser: User;
  onEndCall: () => void;
}

export const CallModal: React.FC<CallModalProps> = ({ currentUser, otherUser, onEndCall }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    // Start timer
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    // Get camera/mic access
    const startStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        streamRef.current = stream;
      } catch (err) {
        console.error("Error accessing media devices.", err);
        alert("Could not access camera and microphone. Please check permissions.");
        onEndCall();
      }
    };

    startStream();

    // Cleanup
    return () => {
      clearInterval(timer);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [onEndCall]);
  
  const handleToggleMute = () => {
    if (streamRef.current) {
        streamRef.current.getAudioTracks().forEach(track => {
            track.enabled = !track.enabled;
        });
        setIsMuted(prev => !prev);
    }
  };
  
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-[100] flex flex-col items-center justify-center text-white p-4">
      <div className="absolute top-4 left-4 text-left">
          <p className="text-xl font-bold">Calling {otherUser.name}</p>
          <p className="text-lg">{formatDuration(callDuration)}</p>
      </div>

      <div className="relative w-full h-full flex items-center justify-center">
        {/* Placeholder for other user's video */}
        <div className="w-full h-full bg-gray-900 rounded-lg flex items-center justify-center">
            <p className="text-gray-400">Connecting...</p>
        </div>

        {/* Local user's video */}
        <div className="absolute bottom-20 right-4 w-48 h-64 bg-black rounded-lg overflow-hidden border-2 border-gray-600">
             <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
        </div>
      </div>
      
      <div className="absolute bottom-4 flex items-center space-x-4">
        <button 
            onClick={handleToggleMute}
            className={`p-4 rounded-full transition-colors ${isMuted ? 'bg-gray-600' : 'bg-gray-800 hover:bg-gray-700'}`}
        >
            {isMuted ? <MicrophoneSlashIcon className="w-6 h-6" /> : <MicrophoneIcon className="w-6 h-6" />}
        </button>
        <button 
            onClick={onEndCall}
            className="p-4 bg-red-600 rounded-full hover:bg-red-700 transition-colors transform rotate-135"
        >
            <PhoneIcon className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
