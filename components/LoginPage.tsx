
import React, { useState, useEffect } from 'react';
import { EyeIcon, EyeSlashIcon, LockClosedIcon, AtSymbolIcon, CommunityIcon, GoogleIcon, FacebookIcon } from '../types';

interface LoginPageProps {
    onLogin: (identifier: string, password: string) => void;
    error: string;
    onSwitchMode: (mode: 'signup' | 'forgotPassword') => void;
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

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, error, onSwitchMode, onSsoLogin }) => {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    useEffect(() => {
        const savedIdentifier = localStorage.getItem('rememberedIdentifier');
        if (savedIdentifier) {
            setIdentifier(savedIdentifier);
            setRememberMe(true);
        }
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (rememberMe) {
            localStorage.setItem('rememberedIdentifier', identifier);
        } else {
            localStorage.removeItem('rememberedIdentifier');
        }
        onLogin(identifier, password);
    };

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
            {/* Left Branding Panel */}
            <div className="hidden lg:flex flex-col justify-center items-center bg-gradient-to-br from-primary to-indigo-600 text-white p-12 text-center">
                 <CommunityIcon className="w-24 h-24 mb-6 animate-float" />
                <h1 className="text-4xl font-bold">Welcome Back to Socials</h1>
                <p className="mt-4 text-lg text-indigo-200">Your community marketplace. Connect, trade, and thrive.</p>
            </div>

            {/* Right Form Panel */}
            <div className="flex flex-col justify-center items-center p-6 sm:p-8 bg-background dark:bg-dark-background">
                <div className="w-full max-w-sm">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-dark-text-primary">
                            Sign In
                        </h2>
                        <p className="mt-2 text-sm text-gray-600 dark:text-dark-text-secondary">
                            Access your account
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
                                htmlFor="identifier"
                                className="block text-sm font-medium text-gray-700 dark:text-dark-text-secondary sr-only"
                            >
                                Username or Email
                            </label>
                             <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <AtSymbolIcon className="w-5 h-5 text-gray-400" />
                                </div>
                                <input
                                    id="identifier"
                                    name="identifier"
                                    type="text"
                                    required
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                    className="w-full pl-10 pr-3 py-2.5 text-gray-900 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    placeholder="Username or Email"
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
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary dark:bg-gray-700 dark:border-gray-600"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-dark-text-secondary">
                                    Remember me
                                </label>
                            </div>
                            <div className="text-sm">
                                <button type="button" onClick={() => onSwitchMode('forgotPassword')} className="font-medium text-primary hover:underline">
                                    Forgot password?
                                </button>
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
                                Sign In
                            </button>
                        </div>
                    </form>
                    <div className="mt-6 text-sm text-center text-gray-600 dark:text-dark-text-secondary">
                        <p>Don't have an account?{' '}
                            <button onClick={() => onSwitchMode('signup')} className="font-medium text-primary hover:underline">
                                Create one
                            </button>
                        </p>
                    </div>
                     <div className="text-xs text-center text-gray-500 dark:text-dark-text-secondary mt-8 pt-4 border-t dark:border-gray-700">
                        <p className="font-bold mb-1">Test Accounts (password: "password")</p>
                        <p><span className="font-semibold">Super Admin:</span> superadmin</p>
                        <p><span className="font-semibold">Admin:</span> admin2</p>
                        <p><span className="font-semibold">Members:</span> alice, bob, charlie, etc.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
