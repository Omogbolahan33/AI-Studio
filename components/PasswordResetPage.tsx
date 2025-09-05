
import React, { useState } from 'react';
import { EyeIcon, EyeSlashIcon, LockClosedIcon, EnvelopeIcon, CommunityIcon } from '../types';
import type { User } from '../types';

interface PasswordResetPageProps {
  onFindUserByEmail: (email: string) => User | undefined;
  onUpdatePassword: (email: string, newPassword: string) => void;
  onBackToLogin: () => void;
}

type ResetStep = 'email' | 'otp' | 'newPassword';

export const PasswordResetPage: React.FC<PasswordResetPageProps> = ({ onFindUserByEmail, onUpdatePassword, onBackToLogin }) => {
  const [step, setStep] = useState<ResetStep>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const user = onFindUserByEmail(email);
    if (user) {
      setStep('otp');
    } else {
      setError('No account found with that email address.');
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    // For demo, any 6-digit code is valid. A real app would validate.
    if (otp === '123456') {
      setStep('newPassword');
    } else {
      setError('Invalid verification code.');
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
    }
    onUpdatePassword(email, password);
  };
  
  const renderStep = () => {
    switch(step) {
      case 'email':
        return (
          <form className="space-y-5" onSubmit={handleEmailSubmit}>
            <p className="text-sm text-center text-gray-600 dark:text-dark-text-secondary">
                Enter your account's email address and we will send you a password reset code.
            </p>
            <div>
                 <label htmlFor="email" className="sr-only">Email</label>
                 <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <EnvelopeIcon className="w-5 h-5 text-gray-400" />
                    </div>
                    <input type="email" id="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder="Email Address"
                    />
                 </div>
            </div>
            {error && <p className="text-sm text-red-600 text-center">{error}</p>}
             <div>
                <button type="submit" className="w-full px-4 py-3 font-semibold text-white bg-primary rounded-md hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2">
                    Send Reset Code
                </button>
            </div>
          </form>
        );
      case 'otp':
        return (
          <form className="space-y-5" onSubmit={handleOtpSubmit}>
             <p className="text-sm text-center text-gray-600 dark:text-dark-text-secondary">
                We've sent a 6-digit code to <strong>{email}</strong>. The code expires shortly, so please enter it soon.
            </p>
             <div>
                 <label htmlFor="otp" className="sr-only">Verification Code</label>
                <input type="text" id="otp" required value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={6}
                    className="w-full text-center tracking-[1em] text-2xl font-semibold py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-primary dark:bg-gray-700"
                    placeholder="------"
                />
            </div>
            {error && <p className="text-sm text-red-600 text-center">{error}</p>}
            <p className="text-xs text-center text-gray-500 dark:text-gray-400">For this demo, the code is <strong>123456</strong>.</p>
            <div>
                <button type="submit" className="w-full px-4 py-3 font-semibold text-white bg-primary rounded-md hover:bg-primary-hover">
                    Verify Code
                </button>
            </div>
          </form>
        );
      case 'newPassword':
        return (
          <form className="space-y-5" onSubmit={handlePasswordSubmit}>
             <p className="text-sm text-center text-gray-600 dark:text-dark-text-secondary">
                Please enter your new password.
            </p>
            <div>
                <label htmlFor="password" className="sr-only">New Password</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <LockClosedIcon className="w-5 h-5 text-gray-400" />
                    </div>
                    <input type={showPassword ? 'text' : 'password'} id="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700"
                        placeholder="New Password"
                    />
                     <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                        {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                    </button>
                </div>
            </div>
            <div>
                <label htmlFor="confirmPassword" className="sr-only">Confirm New Password</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <LockClosedIcon className="w-5 h-5 text-gray-400" />
                    </div>
                    <input type={showPassword ? 'text' : 'password'} id="confirmPassword" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700"
                        placeholder="Confirm New Password"
                    />
                </div>
            </div>
             {error && <p className="text-sm text-red-600 text-center">{error}</p>}
            <div>
                <button type="submit" className="w-full px-4 py-3 font-semibold text-white bg-primary rounded-md hover:bg-primary-hover">
                    Reset Password
                </button>
            </div>
          </form>
        );
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-background dark:bg-dark-background p-6">
        <div className="w-full max-w-sm">
             <div className="text-center mb-8">
                <CommunityIcon className="w-16 h-16 text-primary mx-auto mb-4"/>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-dark-text-primary">
                    Forgot Password
                </h2>
            </div>
            {renderStep()}
             <div className="mt-6 text-sm text-center text-gray-600 dark:text-dark-text-secondary">
                <button onClick={onBackToLogin} className="font-medium text-primary hover:underline">
                    &larr; Back to Sign In
                </button>
            </div>
        </div>
    </div>
  );
};
