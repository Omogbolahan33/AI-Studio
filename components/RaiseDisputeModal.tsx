import React, { useState } from 'react';
import type { Transaction } from '../types';
import { PaperClipIcon, XMarkIcon } from '../types';

interface RaiseDisputeModalProps {
  transaction: Transaction;
  onClose: () => void;
  onSubmit: (transactionId: string, reason: string, file?: File) => void;
}

export const RaiseDisputeModal: React.FC<RaiseDisputeModalProps> = ({ transaction, onClose, onSubmit }) => {
  const [reason, setReason] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
        setFile(selectedFile);
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }
        setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reason.trim()) {
      onSubmit(transaction.id, reason.trim(), file || undefined);
    } else {
      alert('Please provide a reason for the dispute.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex justify-center items-center p-4">
      <div className="bg-surface dark:bg-dark-surface rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-text-primary dark:text-dark-text-primary">Raise Dispute for TXN: {transaction.id}</h2>
          <p className="text-sm text-text-secondary dark:text-dark-text-secondary mt-1">Item: {transaction.item}</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div>
              <label htmlFor="dispute-reason" className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary">
                Reason for Dispute
              </label>
              <textarea
                id="dispute-reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-surface dark:bg-dark-surface dark:text-dark-text-primary"
                rows={4}
                required
                placeholder="Please describe the issue in detail (e.g., item not as described, item not received, etc.)"
              />
            </div>

            <div>
              <label htmlFor="dispute-file" className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary">
                Add Evidence (Optional)
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <PaperClipIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600 dark:text-gray-400">
                    <label htmlFor="dispute-file-input" className="relative cursor-pointer bg-surface dark:bg-dark-surface rounded-md font-medium text-primary hover:text-primary-hover focus-within:outline-none">
                      <span>Upload a file</span>
                      <input id="dispute-file-input" name="dispute-file-input" type="file" className="sr-only" onChange={handleFileChange} accept="image/*,video/*" />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    Image or video up to 10MB
                  </p>
                </div>
              </div>
              {previewUrl && (
                <div className="mt-2 relative">
                  {file?.type.startsWith('image/') ? (
                      <img src={previewUrl} alt="Evidence preview" className="w-full rounded-lg max-h-40 object-contain" />
                  ) : (
                      <video src={previewUrl} controls className="w-full rounded-lg max-h-40 object-contain" />
                  )}
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-75"
                    title="Remove file"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

          </div>
          <div className="p-6 border-t bg-gray-50 dark:bg-dark-surface flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-text-secondary rounded-lg hover:bg-gray-300 transition-colors">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors">Submit Dispute</button>
          </div>
        </form>
      </div>
    </div>
  );
};