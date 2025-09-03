import React, { useState, useEffect, useRef } from 'react';
import type { User } from '../types';
import { PhoneIcon, MicrophoneIcon, MicrophoneSlashIcon, VideoCameraIcon, VideoCameraSlashIcon, UserCircleIcon } from '../types';

interface CallModalProps {
  currentUser: User;
  otherUser: User;
  type: 'video' | 'audio';
  onEndCall: () => void;
}

export const CallModal: React.FC<CallModalProps> = ({ currentUser, otherUser, type, onEndCall }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(type === 'video');
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
        const constraints = { video: type === 'video', audio: true };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (videoRef.current && type === 'video') {
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
  }, [onEndCall, type]);
  
  const handleToggleMute = () => {
    if (streamRef.current) {
        streamRef.current.getAudioTracks().forEach(track => {
            track.enabled = !track.enabled;
        });
        setIsMuted(prev => !prev);
    }
  };
  
  const handleToggleCamera = () => {
    if (streamRef.current && type === 'video') {
        streamRef.current.getVideoTracks().forEach(track => {
            track.enabled = !track.enabled;
        });
        setIsCameraOn(prev => !prev);
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
          <p className="text-xl font-bold">{type === 'video' ? 'Video Call with' : 'Audio Call with'} {otherUser.name}</p>
          <p className="text-lg">{formatDuration(callDuration)}</p>
      </div>

      <div className="relative w-full h-full flex items-center justify-center">
        {/* Remote user's feed area */}
        <div className="w-full h-full bg-gray-900 rounded-lg flex flex-col items-center justify-center">
            {type === 'audio' ? (
                <div className="flex flex-col items-center space-y-4">
                    {otherUser.avatarUrl ? (
                         <img src={otherUser.avatarUrl} alt={otherUser.name} className="w-48 h-48 rounded-full object-cover border-4 border-gray-600" />
                    ) : (
                        <UserCircleIcon className="w-48 h-48 text-gray-700" />
                    )}
                    <p className="text-2xl font-bold">{otherUser.name}</p>
                    <p className="text-gray-400">Connecting...</p>
                </div>
            ) : (
                <p className="text-gray-400">Connecting to {otherUser.name}...</p>
            )}
        </div>

        {/* Local user's video preview (only for video calls) */}
        {type === 'video' && (
            <div className="absolute bottom-28 sm:bottom-20 right-4 w-36 h-48 sm:w-48 sm:h-64 bg-black rounded-lg overflow-hidden border-2 border-gray-600 flex items-center justify-center">
                {isCameraOn ? (
                    <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-800">
                         {currentUser.avatarUrl ? (
                            <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-20 h-20 rounded-full object-cover" />
                         ) : (
                            <UserCircleIcon className="w-20 h-20 text-gray-600" />
                         )}
                         <p className="text-sm mt-2">Camera Off</p>
                    </div>
                )}
            </div>
        )}
      </div>
      
      <div className="absolute bottom-4 flex items-center space-x-4">
        <button 
            onClick={handleToggleMute}
            className={`p-4 rounded-full transition-colors ${isMuted ? 'bg-gray-600' : 'bg-gray-800 hover:bg-gray-700'}`}
        >
            {isMuted ? <MicrophoneSlashIcon className="w-6 h-6" /> : <MicrophoneIcon className="w-6 h-6" />}
        </button>
         {type === 'video' && (
             <button 
                onClick={handleToggleCamera}
                className={`p-4 rounded-full transition-colors ${!isCameraOn ? 'bg-gray-600' : 'bg-gray-800 hover:bg-gray-700'}`}
            >
                {!isCameraOn ? <VideoCameraSlashIcon className="w-6 h-6" /> : <VideoCameraIcon className="w-6 h-6" />}
            </button>
        )}
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