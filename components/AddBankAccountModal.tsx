import React, { useState } from 'react';
import type { BankAccount } from '../types';

interface AddBankAccountModalProps {
  onClose: () => void;
  onSave: (account: BankAccount) => void;
}

export const AddBankAccountModal: React.FC<AddBankAccountModalProps> = ({ onClose, onSave }) => {
  const [account, setAccount] = useState<BankAccount>({ accountName: '', accountNumber: '', bankName: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccount({ ...account, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (account.accountName && account.accountNumber && account.bankName) {
      onSave(account);
    } else {
      alert('Please fill out all fields.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex justify-center items-center p-4">
      <div className="bg-surface dark:bg-dark-surface rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-text-primary dark:text-dark-text-primary">Add Payout Account</h2>
          <p className="text-sm text-text-secondary dark:text-dark-text-secondary mt-1">This is required to sell items. Your details are saved securely.</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div>
              <label htmlFor="bankName" className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary">Bank Name</label>
              <input type="text" id="bankName" name="bankName" value={account.bankName} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-surface dark:bg-dark-surface dark:text-dark-text-primary" />
            </div>
            <div>
              <label htmlFor="accountName" className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary">Account Holder Name</label>
              <input type="text" id="accountName" name="accountName" value={account.accountName} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-surface dark:bg-dark-surface dark:text-dark-text-primary" />
            </div>
            <div>
              <label htmlFor="accountNumber" className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary">Account Number</label>
              <input type="text" id="accountNumber" name="accountNumber" value={account.accountNumber} onChange={handleChange} required pattern="\d{10,}" title="Account number should be at least 10 digits" className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-surface dark:bg-dark-surface dark:text-dark-text-primary" />
            </div>
          </div>
          <div className="p-6 border-t bg-gray-50 dark:bg-gray-900 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-text-secondary rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors">Save Account</button>
          </div>
        </form>
      </div>
    </div>
  );
};