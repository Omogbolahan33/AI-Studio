import React from 'react';
import type { User } from '../types';
import { UsersPage } from './UsersPage';

interface SettingsPageProps {
  users: User[];
  onViewProfile: (user: User) => void;
  isMaintenanceMode: boolean;
  onToggleMaintenanceMode: () => void;
  currentUser: User;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  users,
  onViewProfile,
  isMaintenanceMode,
  onToggleMaintenanceMode,
  currentUser,
}) => {
  const isAdminOrSuperAdmin = currentUser.role === 'Admin' || currentUser.role === 'Super Admin';
  
  return (
    <div className="p-4 sm:p-6 space-y-6">
      {isAdminOrSuperAdmin && (
        <div className="bg-surface dark:bg-dark-surface rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-text-primary dark:text-dark-text-primary mb-4">Platform Settings</h2>
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <p className="font-semibold text-text-primary dark:text-dark-text-primary">Maintenance Mode</p>
              <p className="text-sm text-text-secondary dark:text-dark-text-secondary">
                {isMaintenanceMode 
                  ? "Prevents non-admin users from accessing the app." 
                  : "Allow all users to access the app."}
              </p>
            </div>
            <label htmlFor="maintenance-toggle" className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                id="maintenance-toggle" 
                className="sr-only peer"
                checked={isMaintenanceMode}
                onChange={onToggleMaintenanceMode}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-500 peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>
      )}
      <div className="bg-surface dark:bg-dark-surface rounded-lg shadow">
        <UsersPage users={users} onViewProfile={onViewProfile} />
      </div>
    </div>
  );
};