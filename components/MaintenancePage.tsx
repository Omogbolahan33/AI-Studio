import React from 'react';
import type { User } from '../types';
import { CogIcon } from '../types';

interface MaintenancePageProps {
  user: User;
  onSignOut: () => void;
}

export const MaintenancePage: React.FC<MaintenancePageProps> = ({ user, onSignOut }) => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-background dark:bg-dark-background text-center p-4">
      <CogIcon className="w-24 h-24 text-primary animate-spin mb-6" style={{ animationDuration: '5s' }} />
      <h1 className="text-4xl font-bold text-text-primary dark:text-dark-text-primary">Under Maintenance</h1>
      <p className="mt-4 text-lg text-text-secondary dark:text-dark-text-secondary">
        Hi {user.name}, the application is currently down for scheduled maintenance. We'll be back online shortly.
      </p>
      <button
        onClick={onSignOut}
        className="mt-8 px-6 py-3 font-semibold text-white bg-primary rounded-md shadow-sm hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
      >
        Sign Out
      </button>
    </div>
  );
};