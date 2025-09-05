
import React, { useState } from 'react';

interface EmailVerificationModalProps {
  email: string;
  onClose: () => void;
  onVerify: (otp: string) => { success: boolean; message: string };
  onSkip: () => void;
}

export const EmailVerificationModal: React.FC<EmailVerificationModalProps> = ({ email, onClose, onVerify, onSkip }) => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const result = onVerify(otp);
    if (!result.success) {
      setError(result.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex justify-center items-center p-4">
      <div className="bg-surface dark:bg-dark-surface rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6 border-b text-center">
          <h2 className="text-xl font-bold text-text-primary dark:text-dark-text-primary">Verify Your Email</h2>
          <p className="text-sm text-text-secondary dark:text-dark-text-secondary mt-1">We've sent a 6-digit code to <strong>{email}</strong>. Please enter it below.</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-text-secondary sr-only">Verification Code</label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                className="w-full text-center tracking-[1em] text-2xl font-semibold py-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-surface dark:bg-dark-surface dark:text-dark-text-primary"
                placeholder="------"
                required
              />
            </div>
            {error && <p className="text-sm text-red-500 text-center">{error}</p>}
             <p className="text-xs text-center text-gray-500 dark:text-gray-400">For this demo, the code is <strong>123456</strong>.</p>
          </div>
          <div className="p-6 border-t bg-gray-50 dark:bg-gray-900 flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
            <button type="button" onClick={onSkip} className="text-sm font-semibold text-text-secondary hover:underline">
              Skip for Now
            </button>
            <div className="flex space-x-3">
                 <button type="button" onClick={() => alert("A new code has been sent (simulated).")} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-text-secondary rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">Resend Code</button>
                <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors">Verify Account</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
