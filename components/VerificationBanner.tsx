
import React from 'react';
import { ShieldExclamationIcon } from '../types';

interface VerificationBannerProps {
  onStartVerification: () => void;
}

export const VerificationBanner: React.FC<VerificationBannerProps> = ({ onStartVerification }) => {
  return (
    <div className="bg-yellow-100 dark:bg-yellow-900/50 border-l-4 border-yellow-500 text-yellow-800 dark:text-yellow-200 p-4 w-full mb-6" role="alert">
      <div className="flex">
        <div className="py-1">
          <ShieldExclamationIcon className="w-6 h-6 mr-4" />
        </div>
        <div>
          <p className="font-bold">Please verify your email address.</p>
          <p className="text-sm">
            Check your inbox for a verification code, or{' '}
            <button onClick={onStartVerification} className="font-semibold underline hover:text-yellow-900 dark:hover:text-yellow-100">
              click here to resend the code
            </button>
            .
          </p>
        </div>
      </div>
    </div>
  );
};
