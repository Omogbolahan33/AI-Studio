
import React from 'react';
import type { Transaction, User, Post } from '../types';
import { UserCircleIcon } from '../types';

interface TransactionDetailModalProps {
  transaction: Transaction;
  users: User[];
  posts: Post[];
  onClose: () => void;
  onViewProfile: (user: User) => void;
  onRaiseDispute: (transactionId: string) => void;
  onReportTransaction: (transactionId: string) => void;
}

const DetailRow: React.FC<{ label: string, children: React.ReactNode }> = ({ label, children }) => (
    <div>
        <p className="text-sm font-medium text-text-secondary">{label}</p>
        <div className="text-md text-text-primary">{children}</div>
    </div>
);

const UserChip: React.FC<{ user?: User, onClick: () => void }> = ({ user, onClick }) => (
    <button onClick={onClick} className="flex items-center space-x-2 rounded-full p-1 pr-2 bg-gray-100 hover:bg-gray-200 transition-colors">
        {user?.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.name} className="w-6 h-6 rounded-full" />
        ) : (
            <UserCircleIcon className="w-6 h-6 text-gray-400" />
        )}
        <span className="text-sm font-semibold">{user?.name || 'Unknown User'}</span>
    </button>
);


export const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({ transaction, users, posts, onClose, onViewProfile, onRaiseDispute, onReportTransaction }) => {
  const buyer = users.find(u => u.name === transaction.buyer);
  const seller = users.find(u => u.name === transaction.seller);
  const post = posts.find(p => p.id === transaction.postId);

  const handleProfileClick = (user?: User) => {
    if (user) {
      onClose(); // Close this modal before opening the profile
      onViewProfile(user);
    }
  };

  const statusColorMap: Record<Transaction['status'], string> = {
    Completed: 'bg-green-100 text-green-800',
    'In Escrow': 'bg-blue-100 text-blue-800',
    Pending: 'bg-yellow-100 text-yellow-800',
    Failed: 'bg-red-100 text-red-800',
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-surface rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-text-primary">Transaction Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
             <DetailRow label="Transaction ID">
                <p className="font-mono text-sm">{transaction.id}</p>
             </DetailRow>
              <DetailRow label="Date">
                <p>{new Date(transaction.date).toLocaleDateString()}</p>
             </DetailRow>
            <DetailRow label="Buyer">
                <UserChip user={buyer} onClick={() => handleProfileClick(buyer)} />
            </DetailRow>
            <DetailRow label="Seller">
                <UserChip user={seller} onClick={() => handleProfileClick(seller)} />
            </DetailRow>
             <DetailRow label="Item">
                <p className="font-semibold">{transaction.item}</p>
                {post && <p className="text-xs text-primary hover:underline cursor-pointer">View original post</p>}
             </DetailRow>
             <DetailRow label="Amount">
                <p className="font-bold text-xl text-secondary">${transaction.amount.toFixed(2)}</p>
             </DetailRow>
          </div>
           <div className="text-center">
                <p className="text-sm font-medium text-text-secondary mb-1">Status</p>
                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${statusColorMap[transaction.status]}`}>
                  {transaction.status}
                </span>
            </div>
        </div>
        <div className="p-6 border-t bg-gray-50 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
            <button
              onClick={() => onRaiseDispute(transaction.id)}
              className="px-4 py-2 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition-colors"
            >
              Raise a Dispute
            </button>
            <button
              onClick={() => onReportTransaction(transaction.id)}
              className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors"
            >
              Report Transaction
            </button>
        </div>
      </div>
    </div>
  );
};