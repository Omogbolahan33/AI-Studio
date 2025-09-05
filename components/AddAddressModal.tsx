import React, { useState } from 'react';

interface AddAddressModalProps {
  onClose: () => void;
  onSave: (address: { address: string; city: string; zipCode: string }) => void;
}

export const AddAddressModal: React.FC<AddAddressModalProps> = ({ onClose, onSave }) => {
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (address && city && zipCode) {
      onSave({ address, city, zipCode });
    } else {
      alert('Please fill out all fields.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex justify-center items-center p-4">
      <div className="bg-surface dark:bg-dark-surface rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-text-primary dark:text-dark-text-primary">Add Shipping Address</h2>
          <p className="text-sm text-text-secondary dark:text-dark-text-secondary mt-1">A shipping address is required to make a purchase.</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary">Street Address</label>
              <input type="text" id="address" value={address} onChange={(e) => setAddress(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-surface dark:bg-dark-surface dark:text-dark-text-primary" />
            </div>
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary">City</label>
              <input type="text" id="city" value={city} onChange={(e) => setCity(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-surface dark:bg-dark-surface dark:text-dark-text-primary" />
            </div>
            <div>
              <label htmlFor="zipCode" className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary">ZIP / Postal Code</label>
              <input type="text" id="zipCode" value={zipCode} onChange={(e) => setZipCode(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-surface dark:bg-dark-surface dark:text-dark-text-primary" />
            </div>
          </div>
          <div className="p-6 border-t bg-gray-50 dark:bg-gray-900 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-text-secondary rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors">Save Address</button>
          </div>
        </form>
      </div>
    </div>
  );
};