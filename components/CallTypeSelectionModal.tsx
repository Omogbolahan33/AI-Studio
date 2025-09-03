import React from 'react';
import type { User } from '../types';
import { PhoneIcon, VideoCameraIcon } from '../types';

interface CallTypeSelectionModalProps {
  userToCall: User;
  onClose: () => void;
  onStartCall: (user: User, type: 'video' | 'audio') => void;
}

export const CallTypeSelectionModal: React.FC<CallTypeSelectionModalProps> = ({ userToCall, onClose, onStartCall }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex justify-center items-center p-4">
      <div className="bg-surface dark:bg-dark-surface rounded-lg shadow-xl w-full max-w-sm">
        <div className="p-6 border-b dark:border-gray-700 text-center">
          <h2 className="text-xl font-bold text-text-primary dark:text-dark-text-primary">Start a call with {userToCall.name}</h2>
          <p className="text-sm text-text-secondary dark:text-dark-text-secondary mt-1">Choose the call type</p>
        </div>
        <div className="p-6 space-y-4">
          <button
            onClick={() => onStartCall(userToCall, 'video')}
            className="w-full flex items-center justify-center space-x-3 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-lg font-semibold"
          >
            <VideoCameraIcon className="w-6 h-6" />
            <span>Video Call</span>
          </button>
          <button
            onClick={() => onStartCall(userToCall, 'audio')}
            className="w-full flex items-center justify-center space-x-3 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-lg font-semibold"
          >
            <PhoneIcon className="w-6 h-6" />
            <span>Audio Call</span>
          </button>
        </div>
        <div className="p-4 border-t bg-gray-50 dark:bg-gray-900 flex justify-center">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-text-secondary dark:text-dark-text-secondary rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};