import React from 'react';
import { ShieldExclamationIcon } from '../types';

export const MaintenanceBanner: React.FC = () => {
  return (
    <div className="bg-yellow-500 text-white text-center p-2 font-semibold flex items-center justify-center space-x-2 w-full z-20">
      <ShieldExclamationIcon className="w-5 h-5" />
      <span>Maintenance Mode is currently ACTIVE. Regular users cannot access the app.</span>
    </div>
  );
};