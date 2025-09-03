import React from 'react';
import type { User } from '../types';
import { UserCircleIcon, ChatBubbleOvalLeftEllipsisIcon, UserPlusIcon } from '../types';
import { VerificationBadge } from './VerificationBadge';

interface UserListProps {
  users: User[];
  currentUser: User;
  onViewProfile: (user: User) => void;
  onStartChat: (user: User) => void;
  onUnfollow: (userId: string) => void;
  emptyStateMessage: string;
}

export const UserList: React.FC<UserListProps> = ({ users, currentUser, onViewProfile, onStartChat, onUnfollow, emptyStateMessage }) => {
    if (users.length === 0) {
        return <p className="text-center text-text-secondary dark:text-dark-text-secondary py-8">{emptyStateMessage}</p>;
    }

  return (
    <div className="space-y-3">
      {users.map(user => {
        const isFollowing = currentUser.followingIds.includes(user.id);
        const isCurrentUser = user.id === currentUser.id;

        return (
          <div key={user.id} className="bg-surface dark:bg-dark-surface p-3 rounded-lg shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center space-x-4">
              <button onClick={() => onViewProfile(user)}>
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="w-12 h-12 rounded-full object-cover" />
                ) : (
                  <UserCircleIcon className="w-12 h-12 text-gray-400" />
                )}
              </button>
              <div>
                <button onClick={() => onViewProfile(user)} className="flex items-center gap-1.5 font-bold text-text-primary dark:text-dark-text-primary hover:underline">
                    {user.name}
                    {user.isVerified && <VerificationBadge />}
                </button>
                <p className="text-sm text-text-secondary dark:text-dark-text-secondary">@{user.username}</p>
              </div>
            </div>
            {!isCurrentUser && (
                <div className="flex items-center space-x-2">
                    <button 
                        onClick={() => onStartChat(user)}
                        className="flex items-center justify-center space-x-2 px-3 py-1.5 bg-primary text-white text-sm rounded-lg hover:bg-primary-hover transition-colors"
                        title={`Message ${user.name}`}
                    >
                        <ChatBubbleOvalLeftEllipsisIcon className="w-4 h-4" />
                        <span>Message</span>
                    </button>
                     <button 
                        onClick={() => onUnfollow(user.id)}
                        className="flex items-center justify-center space-x-2 px-3 py-1.5 text-sm rounded-lg transition-colors bg-gray-200 text-text-primary hover:bg-gray-300"
                        title={`Unfollow ${user.name}`}
                    >
                        <span>Following</span>
                    </button>
                </div>
            )}
          </div>
        )
    })}
    </div>
  );
};