import React, { useState, useEffect } from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'primary';
  validationText?: string;
  validationPrompt?: string;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title, 
    message, 
    confirmText = 'Confirm', 
    cancelText = 'Cancel', 
    variant = 'primary',
    validationText,
    validationPrompt
}) => {
  if (!isOpen) return null;

  const [inputVal, setInputVal] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(!validationText); // Confirmed by default if no validation text

  useEffect(() => {
    if (validationText) {
      setIsConfirmed(inputVal === validationText);
    }
  }, [inputVal, validationText]);
  
  // Reset input when modal opens for a new confirmation
  useEffect(() => {
    if (isOpen) {
        setInputVal('');
        setIsConfirmed(!validationText);
    }
  }, [isOpen, validationText]);

  const confirmButtonClasses = variant === 'danger'
    ? 'bg-red-600 hover:bg-red-700 text-white'
    : 'bg-primary hover:bg-primary-hover text-white';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-surface dark:bg-dark-surface rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <h3 className="text-lg font-bold text-text-primary dark:text-dark-text-primary">{title}</h3>
          <p className="mt-2 text-sm text-text-secondary dark:text-dark-text-secondary whitespace-pre-wrap">{message}</p>
          
          {validationText && (
            <div className="mt-4">
              <label htmlFor="validation-input" className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary">
                {validationPrompt || `To confirm, please type "${validationText}"`}
              </label>
              <input
                id="validation-input"
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-surface dark:bg-dark-surface dark:text-dark-text-primary"
                autoComplete="off"
              />
            </div>
          )}

        </div>
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-text-secondary dark:text-dark-text-secondary rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
            {cancelText}
          </button>
          <button 
            onClick={onConfirm} 
            disabled={!isConfirmed}
            className={`px-4 py-2 font-semibold rounded-lg transition-colors ${confirmButtonClasses} disabled:bg-gray-400 disabled:cursor-not-allowed`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
