import React from 'react';
import type { User } from '../types';
import { UsersPage } from './UsersPage';

interface SettingsPageProps {
  users: User[];
  onViewProfile: (user: User) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  users,
  onViewProfile,
}) => {
  return (
    <div className="p-4 sm:p-6">
      <div className="bg-surface dark:bg-dark-surface rounded-lg shadow">
        <UsersPage users={users} onViewProfile={onViewProfile} />
      </div>
    </div>
  );
};