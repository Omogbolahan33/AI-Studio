
import React, { useState } from 'react';
import type { User } from '../types';

interface BanUserModalProps {
  user: User;
  onClose: () => void;
  onConfirm: (userId: string, days: number, reason: string) => void;
}

const PRESET_REASONS = [
    "Spamming",
    "Harassment or abusive behavior",
    "Posting inappropriate content",
    "Scamming or fraudulent activity",
    "Other (please specify)",
];

export const BanUserModal: React.FC<BanUserModalProps> = ({ user, onClose, onConfirm }) => {
  const [days, setDays] = useState('7');
  const [reason, setReason] = useState(PRESET_REASONS[0]);
  const [customReason, setCustomReason] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numDays = parseInt(days, 10);
    if (isNaN(numDays) || numDays <= 0) {
      alert('Please enter a valid number of days.');
      return;
    }
    const finalReason = reason === "Other (please specify)" ? customReason : reason;
    if (!finalReason.trim()) {
        alert('Please provide a reason for the ban.');
        return;
    }
    onConfirm(user.id, numDays, finalReason);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-surface rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-text-primary">Ban User: {user.name}</h2>
          <p className="text-sm text-text-secondary mt-1">Temporarily restrict this user from creating new posts.</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div>
              <label htmlFor="ban-days" className="block text-sm font-medium text-text-secondary">
                Duration of Ban (in days)
              </label>
              <input
                id="ban-days"
                type="number"
                value={days}
                onChange={(e) => setDays(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                min="1"
                required
              />
            </div>
            <div>
              <label htmlFor="ban-reason" className="block text-sm font-medium text-text-secondary">
                Reason for Ban
              </label>
              <select 
                id="ban-reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              >
                  {PRESET_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            {reason === 'Other (please specify)' && (
                <div>
                    <label htmlFor="custom-reason" className="block text-sm font-medium text-text-secondary">
                        Please specify the reason
                    </label>
                    <textarea
                        id="custom-reason"
                        value={customReason}
                        onChange={(e) => setCustomReason(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                        rows={3}
                        required
                    />
                </div>
            )}
          </div>
          <div className="p-6 border-t bg-gray-50 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-text-secondary rounded-lg hover:bg-gray-300 transition-colors">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors">Confirm Ban</button>
          </div>
        </form>
      </div>
    </div>
  );
};