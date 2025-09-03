import React, { useEffect } from 'react';
import { CheckCircleIcon, ShieldExclamationIcon } from '../types';

interface ToastNotificationProps {
  message: string;
  onClose: () => void;
  type?: 'success' | 'error';
}

export const ToastNotification: React.FC<ToastNotificationProps> = ({ message, onClose, type = 'success' }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // Auto-close after 5 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  const config = {
      success: {
          icon: <CheckCircleIcon className="w-6 h-6" />,
          classes: "bg-green-100 border border-green-400 text-green-700 dark:bg-green-900 dark:border-green-700 dark:text-green-200",
      },
      error: {
          icon: <ShieldExclamationIcon className="w-6 h-6" />,
          classes: "bg-red-100 border border-red-400 text-red-700 dark:bg-red-900 dark:border-red-700 dark:text-red-200",
      }
  };

  return (
    <div className={`fixed top-5 right-5 max-w-sm p-4 rounded-lg shadow-lg z-[100] flex items-center space-x-3 animate-fade-in-right ${config[type].classes}`} role="alert">
        <div className="flex-shrink-0">{config[type].icon}</div>
        <div className="flex-1 text-sm font-medium">{message}</div>
        <button onClick={onClose} className="p-1 rounded-full hover:bg-black hover:bg-opacity-10 dark:hover:bg-white dark:hover:bg-opacity-10">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
        <style>{`
            @keyframes fade-in-right {
                from {
                    opacity: 0;
                    transform: translateX(100%);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            .animate-fade-in-right {
                animation: fade-in-right 0.5s ease-out forwards;
            }
        `}</style>
    </div>
  );
};