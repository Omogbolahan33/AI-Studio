import React from 'react';
import type { User } from '../types';
import { UserCircleIcon } from '../types';

interface FollowRequestPanelProps {
  requests: User[];
  onAccept: (requesterId: string) => void;
  onDecline: (requesterId: string) => void;
  onClose: () => void;
}

export const FollowRequestPanel: React.FC<FollowRequestPanelProps> = ({ requests, onAccept, onDecline, onClose }) => {
  return (
    <div className="absolute top-full right-4 md:right-0 mt-2 w-[calc(100vw-2rem)] max-w-sm bg-white dark:bg-gray-800 rounded-md shadow-lg z-20 ring-1 ring-black ring-opacity-5">
      <div className="p-4 border-b dark:border-gray-700">
        <h3 className="text-lg font-semibold text-text-primary dark:text-dark-text-primary">Follow Requests</h3>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {requests.length === 0 ? (
          <p className="text-sm text-center text-text-secondary dark:text-dark-text-secondary py-8">No new follow requests.</p>
        ) : (
          <ul className="divide-y dark:divide-gray-700">
            {requests.map(user => (
              <li key={user.id} className="p-3">
                <div className="flex items-center space-x-3 text-left">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <UserCircleIcon className="w-10 h-10 text-gray-400" />
                  )}
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-text-primary dark:text-dark-text-primary">{user.name}</p>
                    <p className="text-xs text-text-secondary dark:text-dark-text-secondary">@{user.username}</p>
                  </div>
                </div>
                <div className="mt-2 flex justify-end space-x-2">
                  <button onClick={() => onDecline(user.id)} className="px-3 py-1 text-xs font-semibold bg-gray-200 dark:bg-gray-600 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500">Decline</button>
                  <button onClick={() => onAccept(user.id)} className="px-3 py-1 text-xs font-semibold bg-primary text-white rounded-md hover:bg-primary-hover">Accept</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};