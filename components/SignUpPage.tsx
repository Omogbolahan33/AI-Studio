import React, { useState } from 'react';
import { EyeIcon, EyeSlashIcon, UserCircleIcon, LockClosedIcon, AtSymbolIcon, CommunityIcon, GoogleIcon, FacebookIcon } from '../types';

interface SignUpPageProps {
    onSignUp: (username: string, password: string) => { success: boolean, message: string };
    onSwitchMode: (mode: 'login') => void;
    onSsoLogin: (provider: 'google' | 'facebook') => void;
}

const SocialButton: React.FC<{ icon: React.ReactNode, label: string, onClick?: () => void }> = ({ icon, label, onClick }) => (
    <button
        type="button"
        onClick={onClick}
        className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
    >
        {icon}
        <span className="text-sm font-medium text-gray-700 dark:text-dark-text-secondary">{label}</span>
    </button>
);

export const SignUpPage: React.FC<SignUpPageProps> = ({ onSignUp, onSwitchMode, onSsoLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
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
        const result = onSignUp(username, password);
        if (!result.success) {
            setError(result.message);
        }
    };

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
            {/* Left Branding Panel */}
             <div className="hidden lg:flex flex-col justify-center items-center bg-gradient-to-br from-primary to-indigo-600 text-white p-12 text-center">
                 <CommunityIcon className="w-24 h-24 mb-6 animate-float" />
                <h1 className="text-4xl font-bold">Join the Socials Community</h1>
                <p className="mt-4 text-lg text-indigo-200">Your community marketplace. Connect, trade, and thrive.</p>
            </div>
            
            {/* Right Form Panel */}
             <div className="flex flex-col justify-center items-center p-6 sm:p-8 bg-background dark:bg-dark-background">
                <div className="w-full max-w-sm">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-dark-text-primary">
                            Create an Account
                        </h2>
                        <p className="mt-2 text-sm text-gray-600 dark:text-dark-text-secondary">
                            Start your journey with us today!
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <SocialButton icon={<GoogleIcon className="w-5 h-5" />} label="Google" onClick={() => onSsoLogin('google')} />
                        <SocialButton icon={<FacebookIcon className="w-5 h-5" />} label="Facebook" onClick={() => onSsoLogin('facebook')} />
                    </div>

                     <div className="my-6 flex items-center">
                        <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
                        <span className="flex-shrink mx-4 text-xs font-medium text-gray-500">OR</span>
                        <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
                    </div>

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div>
                             <label
                                htmlFor="username"
                                className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary sr-only"
                            >
                                Username
                            </label>
                             <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <AtSymbolIcon className="w-5 h-5 text-gray-400" />
                                </div>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full pl-10 pr-3 py-2.5 text-gray-900 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    placeholder="Username"
                                />
                             </div>
                        </div>
                        <div>
                             <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary sr-only"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <LockClosedIcon className="w-5 h-5 text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-10 py-2.5 text-gray-900 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    placeholder="Password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 dark:text-gray-400"
                                >
                                    {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label
                                htmlFor="confirm-password"
                                className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary sr-only"
                            >
                                Confirm Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <LockClosedIcon className="w-5 h-5 text-gray-400" />
                                </div>
                                 <input
                                    id="confirm-password"
                                    name="confirm-password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full pl-10 pr-3 py-2.5 text-gray-900 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    placeholder="Confirm Password"
                                />
                            </div>
                        </div>

                        {error && (
                            <p className="text-sm text-red-600 text-center">{error}</p>
                        )}

                        <div>
                            <button
                                type="submit"
                                className="w-full px-4 py-3 font-semibold text-white bg-primary rounded-md shadow-sm hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-transform transform hover:scale-105"
                            >
                                Create Account
                            </button>
                        </div>
                    </form>
                    <div className="mt-6 text-sm text-center text-gray-600 dark:text-dark-text-secondary">
                        <p>Already have an account?{' '}
                            <button onClick={() => onSwitchMode('login')} className="font-medium text-primary hover:underline">
                                Sign In
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};