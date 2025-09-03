import React, { useState, useEffect } from 'react';
import type { Transaction, User, Post, AdminAction } from '../types';
import { UserCircleIcon, CheckCircleIcon, ShieldExclamationIcon, ArrowUturnLeftIcon } from '../types';

interface TransactionDetailModalProps {
  transaction: Transaction;
  currentUser: User;
  users: User[];
  posts: Post[];
  onClose: () => void;
  onViewProfile: (user: User) => void;
  onRaiseDispute: (transactionId: string) => void;
  onMarkAsShipped: (transactionId: string, trackingNumber: string) => void;
  onAcceptItem: (transactionId: string) => void;
  onAdminUpdateTransaction: (transactionId: string, updates: Partial<Transaction>) => void;
  onSelectPost: (post: Post) => void;
  onOpenReviewModal: (transaction: Transaction) => void;
  onOpenTransactionChat: (transaction: Transaction) => void;
  onReverseAdminAction: (transactionId: string, actionId: string) => void;
}

const DetailRow: React.FC<{ label: string, children: React.ReactNode }> = ({ label, children }) => (
    <div>
        <p className="text-sm font-medium text-text-secondary dark:text-dark-text-secondary">{label}</p>
        <div className="text-md text-text-primary dark:text-dark-text-primary">{children}</div>
    </div>
);

const UserChip: React.FC<{ user?: User, onClick: () => void }> = ({ user, onClick }) => (
    <button onClick={onClick} className="flex items-center space-x-2 rounded-full p-1 pr-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
        {user?.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.name} className="w-6 h-6 rounded-full" />
        ) : (
            <UserCircleIcon className="w-6 h-6 text-gray-400" />
        )}
        <span className="text-sm font-semibold">{user?.name || 'Unknown User'}</span>
    </button>
);

const TransactionStepper: React.FC<{ status: Transaction['status'] }> = ({ status }) => {
    const steps = ['Payment', 'In Escrow', 'Shipped', 'Delivered', 'Completed'];
    const statusMap: Partial<Record<Transaction['status'], number>> = {
        'Pending': 0,
        'In Escrow': 1,
        'Shipped': 2,
        'Delivered': 3,
        'Completed': 4,
    };
    
    let currentStepIndex = statusMap[status] ?? -1;

    if (currentStepIndex === -1) { // Handle Disputed or Cancelled
        if (status === 'Disputed') currentStepIndex = 2; // Show up to shipped
        if (status === 'Cancelled') currentStepIndex = 0; // Show up to payment
    }


    return (
        <div className="w-full">
            <div className="flex">
                {steps.map((step, index) => (
                    <div key={step} className="flex-1 flex items-center">
                        <div className="flex flex-col items-center w-full text-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors text-lg font-bold ${index <= currentStepIndex ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-300'}`}>
                                {index < currentStepIndex ? <CheckCircleIcon className="w-6 h-6" /> : '✓'}
                            </div>
                            <p className={`mt-2 text-xs font-semibold ${index <= currentStepIndex ? 'text-primary dark:text-indigo-400' : 'text-text-secondary dark:text-dark-text-secondary'}`}>{step}</p>
                        </div>
                        {index < steps.length - 1 && (
                            <div className={`flex-1 h-1 transition-colors ${index < currentStepIndex ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-600'}`} />
                        )}
                    </div>
                ))}
            </div>
             {(status === 'Disputed' || status === 'Cancelled') && (
                 <div className={`mt-4 p-3 text-center ${status === 'Disputed' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'} font-semibold rounded-lg`}>
                    Status: {status}
                </div>
            )}
        </div>
    );
};

const CountdownTimer: React.FC<{ expiryDate: string }> = ({ expiryDate }) => {
    const calculateTimeLeft = () => {
        const difference = +new Date(expiryDate) - +new Date();
        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        }
        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        return () => clearTimeout(timer);
    });

    const timerComponents: string[] = [];
    Object.keys(timeLeft).forEach(interval => {
        if (!timeLeft[interval as keyof typeof timeLeft]) {
            return;
        }
        const value = timeLeft[interval as keyof typeof timeLeft];
        timerComponents.push(`${value} ${interval.substring(0,1)}`);
    });

    return (
        <div className="text-sm text-red-600 font-medium mb-4">
            {timerComponents.length ? <span>Funds auto-release in: {timerComponents.join(' ')}</span> : <span>Inspection period has ended.</span>}
        </div>
    );
};

const PendingSpinner: React.FC = () => (
    <div className="flex flex-col items-center justify-center space-y-2 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="mt-2 text-sm font-semibold text-text-secondary dark:text-dark-text-secondary">Processing payment...</p>
        <p className="text-xs text-text-secondary dark:text-dark-text-secondary">Please wait, this may take a moment.</p>
    </div>
);


export const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({ transaction, currentUser, users, posts, onClose, onViewProfile, onRaiseDispute, onMarkAsShipped, onAcceptItem, onAdminUpdateTransaction, onSelectPost, onOpenReviewModal, onOpenTransactionChat, onReverseAdminAction }) => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [partialRefundAmount, setPartialRefundAmount] = useState('');
  const [showPartialRefundInput, setShowPartialRefundInput] = useState(false);

  const buyer = users.find(u => u.name === transaction.buyer);
  const seller = users.find(u => u.name === transaction.seller);
  const post = posts.find(p => p.id === transaction.postId);
  const isBuyer = currentUser.name === transaction.buyer;
  const isSeller = currentUser.name === transaction.seller;
  const isAdmin = currentUser.role === 'Admin' || currentUser.role === 'Super Admin';
  const isSuperAdmin = currentUser.role === 'Super Admin';
  
  const hasReviewed = seller?.reviews.some(r => r.reviewerId === currentUser.id && r.transactionId === transaction.id);

  const handleProfileClick = (user?: User) => {
    if (user) {
      onClose();
      onViewProfile(user);
    }
  };

  const handleMarkAsShippedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingNumber.trim()) {
      onMarkAsShipped(transaction.id, trackingNumber.trim());
    }
  };
  
  const handleSelectPostClick = () => {
    if (post) {
      onSelectPost(post);
      onClose();
    }
  };
  
  const handlePartialRefundConfirm = () => {
    const amount = parseFloat(partialRefundAmount);
    if (isNaN(amount) || amount <= 0 || amount > transaction.amount) {
        alert('Please enter a valid refund amount that is less than or equal to the transaction amount.');
        return;
    }
    onAdminUpdateTransaction(transaction.id, {
        status: 'Cancelled',
        cancelledAt: new Date().toISOString(),
        refundedAmount: amount,
        failureReason: `Admin issued a partial refund of ₦${amount.toLocaleString()}.`
    });
    setShowPartialRefundInput(false);
    setPartialRefundAmount('');
  };

  const renderSellerActions = () => {
    switch (transaction.status) {
      case 'In Escrow':
        return (
          <form onSubmit={handleMarkAsShippedSubmit} className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h4 className="font-semibold text-text-primary dark:text-dark-text-primary mb-2">Action Required: Ship Item</h4>
            <p className="text-sm text-text-secondary dark:text-dark-text-secondary mb-3">The buyer's payment is secured. Ship the item and enter the tracking number below to proceed.</p>
            <input type="text" value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} placeholder="Enter tracking number" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-surface dark:bg-dark-surface rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" required />
            <button type="submit" className="mt-3 w-full px-4 py-2 bg-secondary text-white font-semibold rounded-lg hover:opacity-90 transition-colors">Confirm Shipment</button>
          </form>
        );
      case 'Shipped': return <p className="text-center text-text-secondary mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">Waiting for item to be delivered...</p>;
      case 'Delivered': return <p className="text-center text-text-secondary mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">Item delivered. Waiting for buyer to accept and release funds.</p>;
      case 'Completed': return <p className="text-center text-green-600 font-semibold mt-4 p-4 bg-green-50 dark:bg-green-900 rounded-lg">✓ Payment has been released to your account.</p>;
      default: return null;
    }
  };

  const renderBuyerActions = () => {
    switch (transaction.status) {
      case 'In Escrow': return <p className="text-center text-text-secondary dark:text-dark-text-secondary mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">Waiting for the seller to ship your item.</p>;
      case 'Shipped': return <p className="text-center text-text-secondary dark:text-dark-text-secondary mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">Your item is on its way!</p>;
      case 'Delivered':
        return (
          <div className="mt-4 p-4 bg-primary-light dark:bg-indigo-900/50 rounded-lg text-center">
            <h4 className="font-semibold text-text-primary dark:text-dark-text-primary mb-2">Action Required: Item Delivered</h4>
            <p className="text-sm text-text-secondary dark:text-dark-text-secondary mb-3">Your item has arrived. Please inspect it. If everything is okay, release the payment to the seller.</p>
            {transaction.inspectionPeriodEnds && <CountdownTimer expiryDate={transaction.inspectionPeriodEnds} />}
            <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-3">
              <button onClick={() => onAcceptItem(transaction.id)} className="px-4 py-2 bg-secondary text-white font-semibold rounded-lg hover:opacity-90 transition-colors">Accept & Release Funds</button>
              <button onClick={() => onRaiseDispute(transaction.id)} className="px-4 py-2 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition-colors">Raise a Dispute</button>
            </div>
          </div>
        );
      case 'Completed': 
        return (
             <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/50 rounded-lg text-center space-y-3">
                <p className="text-green-800 dark:text-green-300 font-semibold">✓ You have accepted the item. This transaction is complete.</p>
                {!hasReviewed ? (
                    <button onClick={() => onOpenReviewModal(transaction)} className="px-4 py-2 bg-yellow-400 text-yellow-900 font-semibold rounded-lg hover:bg-yellow-500 transition-colors">Leave a Review</button>
                ) : (
                    <p className="text-sm text-text-secondary dark:text-dark-text-secondary">You have left a review for this transaction.</p>
                )}
            </div>
        );
      case 'Cancelled':
          if (post) {
            return (
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-center">
                <button
                  onClick={handleSelectPostClick}
                  className="w-full px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-hover transition-colors"
                >
                  Return to Listing to Try Again
                </button>
              </div>
            );
          }
          return null;
      default: return null;
    }
  };
  
  const renderAdminActions = () => (
    <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-500/50 rounded-lg">
        <h4 className="font-semibold text-red-800 dark:text-red-300 mb-2 flex items-center gap-2"><ShieldExclamationIcon className="w-5 h-5"/> Admin Intervention</h4>
        <p className="text-sm text-red-700 dark:text-red-300/80 mb-3">Manually resolve this transaction. This action is final and will override the current status.</p>
        
        {showPartialRefundInput ? (
             <div className="space-y-3">
                <h5 className="font-semibold text-text-primary dark:text-dark-text-primary">Enter Partial Refund Amount</h5>
                <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-text-secondary dark:text-dark-text-secondary">₦</span>
                    <input 
                    type="number" 
                    value={partialRefundAmount}
                    onChange={(e) => setPartialRefundAmount(e.target.value)}
                    placeholder={`Max ${transaction.amount.toLocaleString()}`}
                    className="w-full pl-7 pr-3 py-2 border border-gray-300 dark:border-gray-600 bg-surface dark:bg-dark-surface rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    max={transaction.amount}
                    min="0.01"
                    step="0.01"
                    />
                </div>
                <div className="flex justify-end space-x-2">
                    <button onClick={() => setShowPartialRefundInput(false)} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-text-secondary rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">Cancel</button>
                    <button onClick={handlePartialRefundConfirm} className="px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-hover transition-colors">Confirm Refund</button>
                </div>
            </div>
        ) : (
            <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-3">
                <button onClick={() => onAdminUpdateTransaction(transaction.id, { status: 'Completed', completedAt: new Date().toISOString() })} className="px-4 py-2 bg-secondary text-white font-semibold rounded-lg hover:opacity-90 transition-colors">Force Payout to Seller</button>
                <button onClick={() => setShowPartialRefundInput(true)} className="px-4 py-2 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition-colors">Partial Refund</button>
                <button onClick={() => onAdminUpdateTransaction(transaction.id, { status: 'Cancelled', cancelledAt: new Date().toISOString(), failureReason: 'Admin issued a full refund to the buyer.' })} className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors">Force Full Refund</button>
            </div>
        )}
    </div>
  );

  const formatDate = (dateString?: string) => dateString ? new Date(dateString).toLocaleString() : 'N/A';
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-surface dark:bg-dark-surface rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-text-primary dark:text-dark-text-primary">Transaction Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
        </div>
        
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="mb-6">
            <TransactionStepper status={transaction.status} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
             <DetailRow label="Transaction ID"><p className="font-mono text-sm">{transaction.id}</p></DetailRow>
             <DetailRow label="Amount"><p className="font-bold text-xl text-secondary">₦{transaction.amount.toLocaleString()}</p></DetailRow>
             <DetailRow label="Buyer"><UserChip user={buyer} onClick={() => handleProfileClick(buyer)} /></DetailRow>
             <DetailRow label="Seller"><UserChip user={seller} onClick={() => handleProfileClick(seller)} /></DetailRow>
             <div className="sm:col-span-2">
                 <DetailRow label="Item">
                    <p className="font-semibold">{transaction.item}</p>
                    {post && <button onClick={handleSelectPostClick} className="text-xs text-primary hover:underline">View original post</button>}
                 </DetailRow>
             </div>
             {transaction.trackingNumber && <DetailRow label="Tracking Number"><p className="font-mono text-sm">{transaction.trackingNumber}</p></DetailRow>}
             <hr className="sm:col-span-2 my-2 dark:border-gray-700" />
             <DetailRow label="Date Initiated">{formatDate(transaction.date)}</DetailRow>
             <DetailRow label="Date Shipped">{formatDate(transaction.shippedAt)}</DetailRow>
             <DetailRow label="Date Delivered">{formatDate(transaction.deliveredAt)}</DetailRow>
             <DetailRow label="Date Completed">{formatDate(transaction.completedAt)}</DetailRow>
          </div>
           {transaction.status === 'Cancelled' && (
              <div className="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-500/50 rounded-lg text-center">
                  <h4 className="font-bold text-red-800 dark:text-red-300">Transaction Cancelled</h4>
                  {transaction.failureReason && <p className="text-sm text-red-700 dark:text-red-300/80 mt-1">{transaction.failureReason}</p>}
              </div>
          )}
          {transaction.adminActions && transaction.adminActions.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold text-text-primary dark:text-dark-text-primary">Admin Action History</h4>
              <ul className="space-y-2 text-sm border p-3 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                {transaction.adminActions.map(action => (
                  <li key={action.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                    <div>
                      <p><span className="font-semibold">{action.adminName}</span> performed "{action.action}"</p>
                      <p className="text-xs text-text-secondary dark:text-dark-text-secondary">{formatDate(action.timestamp)} {action.details && `(${action.details})`}</p>
                    </div>
                    {isSuperAdmin && action.adminId !== currentUser.id && action.action !== 'Reversal' && (
                        <button onClick={() => onReverseAdminAction(transaction.id, action.id)} className="mt-2 sm:mt-0 flex items-center space-x-1 text-xs px-2 py-1 bg-gray-200 dark:bg-gray-500 hover:bg-gray-300 dark:hover:bg-gray-400 rounded-md">
                            <ArrowUturnLeftIcon className="w-4 h-4" />
                            <span>Reverse</span>
                        </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
           <div className="mt-4">
             <button
                onClick={() => onOpenTransactionChat(transaction)}
                className="w-full px-4 py-3 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 font-semibold rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-900 transition-colors"
            >
                Go to Transaction Chat
            </button>
           </div>
          {transaction.status === 'Pending' ? <PendingSpinner /> : (isAdmin ? renderAdminActions() : (isSeller ? renderSellerActions() : renderBuyerActions()))}
        </div>

        <div className="p-4 border-t bg-gray-50 dark:bg-dark-surface flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-text-secondary dark:text-dark-text-secondary rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">Close</button>
        </div>
      </div>
    </div>
  );
};