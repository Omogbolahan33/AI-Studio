
import React, { useState } from 'react';
import type { User } from '../types';

interface UserSettingsFormProps {
  currentUser: User;
  onUpdateSettings: (userId: string, settingsData: Partial<User>) => void;
}

const FormSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="py-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">{title}</h3>
        <div className="space-y-4">{children}</div>
    </div>
);

const FormRow: React.FC<{ label: string; id: string; children: React.ReactNode }> = ({ label, id, children }) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-center">
        <label htmlFor={id} className="text-sm font-medium text-text-secondary">{label}</label>
        <div className="md:col-span-2">
            {children}
        </div>
    </div>
);

export const UserSettingsForm: React.FC<UserSettingsFormProps> = ({ currentUser, onUpdateSettings }) => {
    const [formData, setFormData] = useState({
        username: currentUser.username || '',
        email: currentUser.email || '',
        address: currentUser.address || '',
        city: currentUser.city || '',
        zipCode: currentUser.zipCode || '',
    });
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        let settingsData: Partial<User> = { ...formData };

        if (password) {
            if (password !== confirmPassword) {
                alert('Passwords do not match.');
                return;
            }
             if (password.length < 6) {
                alert('Password must be at least 6 characters long.');
                return;
            }
            settingsData.password = password;
        }

        onUpdateSettings(currentUser.id, settingsData);
    };

    return (
        <div className="bg-surface rounded-lg shadow p-4 sm:p-8 max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="divide-y divide-gray-200">
                <FormSection title="Account Information">
                    <FormRow label="Username" id="username">
                         <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
                    </FormRow>
                    <FormRow label="Email Address" id="email">
                         <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
                    </FormRow>
                </FormSection>
                
                <FormSection title="Change Password">
                    <FormRow label="New Password" id="password">
                         <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Leave blank to keep current" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
                    </FormRow>
                    <FormRow label="Confirm New Password" id="confirmPassword">
                         <input type="password" id="confirmPassword" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Leave blank to keep current" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
                    </FormRow>
                </FormSection>
                
                <FormSection title="Payment & Address">
                    <FormRow label="Home Address" id="address">
                         <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
                    </FormRow>
                     <FormRow label="City" id="city">
                         <input type="text" id="city" name="city" value={formData.city} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
                    </FormRow>
                     <FormRow label="ZIP Code" id="zipCode">
                         <input type="text" id="zipCode" name="zipCode" value={formData.zipCode} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
                    </FormRow>
                </FormSection>

                <div className="pt-6 flex justify-end">
                    <button type="submit" className="px-6 py-2 bg-primary text-white font-semibold rounded-lg shadow-sm hover:bg-primary-hover transition-colors">
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
};