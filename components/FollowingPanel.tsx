import React from 'react';
import type { User } from '../types';
import { UserCircleIcon, ChatBubbleOvalLeftEllipsisIcon } from '../types';

interface FollowingPanelProps {
  currentUser: User;
  users: User[];
  onStartChat: (user: User) => void;
  onClose: () => void;
  onViewProfile: (user: User) => void;
}

export const FollowingPanel: React.FC<FollowingPanelProps> = ({ currentUser, users, onStartChat, onClose, onViewProfile }) => {
  const followedUsers = users.filter(user => currentUser.followingIds.includes(user.id));

  const handleStartChat = (user: User) => {
    onStartChat(user);
    onClose();
  };

  const handleViewProfile = (user: User) => {
    onViewProfile(user);
    onClose();
  };

  return (
    <div className="absolute top-full right-4 md:right-0 mt-2 w-[calc(100vw-2rem)] max-w-xs bg-white dark:bg-gray-800 rounded-md shadow-lg z-20 ring-1 ring-black ring-opacity-5">
      <div className="p-4 border-b dark:border-gray-700">
        <h3 className="text-lg font-semibold text-text-primary dark:text-dark-text-primary">Following</h3>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {followedUsers.length === 0 ? (
          <p className="text-sm text-center text-text-secondary dark:text-dark-text-secondary py-8">You aren't following anyone yet.</p>
        ) : (
          <ul className="divide-y dark:divide-gray-700">
            {followedUsers.map(user => (
              <li key={user.id} className="p-3 flex items-center justify-between group">
                <button onClick={() => handleViewProfile(user)} className="flex items-center space-x-3 text-left">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full" />
                  ) : (
                    <UserCircleIcon className="w-10 h-10 text-gray-400" />
                  )}
                  <div>
                    <p className="font-semibold text-sm text-text-primary dark:text-dark-text-primary group-hover:underline">{user.name}</p>
                    <p className="text-xs text-text-secondary dark:text-dark-text-secondary">@{user.username}</p>
                  </div>
                </button>
                <button
                  onClick={() => handleStartChat(user)}
                  title={`Message ${user.name}`}
                  className="p-2 rounded-full text-gray-400 dark:text-gray-300 hover:bg-primary-light dark:hover:bg-gray-700 hover:text-primary transition-colors opacity-0 group-hover:opacity-100"
                >
                  <ChatBubbleOvalLeftEllipsisIcon className="w-5 h-5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};