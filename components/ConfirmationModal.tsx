import React from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'primary';
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel', variant = 'primary' }) => {
  if (!isOpen) return null;

  const confirmButtonClasses = variant === 'danger'
    ? 'bg-red-600 hover:bg-red-700 text-white'
    : 'bg-primary hover:bg-primary-hover text-white';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-surface dark:bg-dark-surface rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <h3 className="text-lg font-bold text-text-primary dark:text-dark-text-primary">{title}</h3>
          <p className="mt-2 text-sm text-text-secondary dark:text-dark-text-secondary whitespace-pre-wrap">{message}</p>
        </div>
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-text-secondary dark:text-dark-text-secondary rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
            {cancelText}
          </button>
          <button onClick={onConfirm} className={`px-4 py-2 font-semibold rounded-lg transition-colors ${confirmButtonClasses}`}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};