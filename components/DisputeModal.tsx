import React, { useState, useEffect, useCallback } from 'react';
import { analyzeDispute } from '../services/geminiService';
import type { Dispute, AIAnalysis, Transaction, User } from '../types';

interface DisputeModalProps {
  dispute: Dispute;
  transaction: Transaction | undefined;
  currentUser: User;
  users: User[];
  onClose: () => void;
  onResolve: (disputeId: string, resolution: string) => void;
  onAdminSendMessage: (disputeId: string, message: string) => void;
}

const LoadingSpinner: React.FC = () => (
    <div className="flex items-center justify-center space-x-2">
        <div className="w-4 h-4 rounded-full animate-pulse bg-primary"></div>
        <div className="w-4 h-4 rounded-full animate-pulse bg-primary" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-4 h-4 rounded-full animate-pulse bg-primary" style={{ animationDelay: '0.4s' }}></div>
        <span className="ml-2 text-text-secondary">AI is analyzing the case...</span>
    </div>
);

const AnalysisSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div>
        <h4 className="text-md font-semibold text-text-primary mb-2">{title}</h4>
        {children}
    </div>
);

type ResolutionType = 'refund' | 'release' | 'partial';

export const DisputeModal: React.FC<DisputeModalProps> = ({ dispute, transaction, currentUser, users, onClose, onResolve, onAdminSendMessage }) => {
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isActionView, setIsActionView] = useState(false);
  const [resolution, setResolution] = useState<ResolutionType | null>(null);
  const [partialAmount, setPartialAmount] = useState('');
  const [adminMessage, setAdminMessage] = useState('');

  const handleAnalyze = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await analyzeDispute(dispute);
      setAnalysis(result);
    } catch (err) {
      setError('Failed to analyze dispute. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [dispute]);
  
  const handleConfirmResolution = () => {
    if (!resolution) return;

    let resolutionDetails = '';
    switch (resolution) {
        case 'refund':
            resolutionDetails = 'Full refund to buyer';
            break;
        case 'release':
            resolutionDetails = 'Release funds to seller';
            break;
        case 'partial':
            const amount = parseFloat(partialAmount);
            if (isNaN(amount) || amount <= 0 || (transaction && amount > transaction.amount)) {
                alert('Please enter a valid partial refund amount.');
                return;
            }
            resolutionDetails = `Partial refund of ₦${amount.toFixed(2)} to buyer`;
            break;
    }
    
    onResolve(dispute.id, resolutionDetails);
  };

  const handleAdminMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminMessage.trim()) {
      onAdminSendMessage(dispute.id, adminMessage.trim());
      setAdminMessage('');
    }
  };

  useEffect(() => {
    handleAnalyze();
  }, [handleAnalyze]);
  
  const admins = users.filter(u => u.role === 'Admin');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-surface dark:bg-dark-surface rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-text-primary dark:text-dark-text-primary">Dispute Details: {dispute.id}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-text-primary dark:text-dark-text-primary mb-2">Case Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <div><span className="font-semibold">Buyer:</span> {dispute.buyer}</div>
                    <div><span className="font-semibold">Seller:</span> {dispute.seller}</div>
                    <div><span className="font-semibold">Transaction ID:</span> {dispute.transactionId}</div>
                    <div><span className="font-semibold">Reason:</span> {dispute.reason}</div>
                    {transaction && (
                        <>
                            <div className="col-span-2 sm:col-span-1"><span className="font-semibold">Item:</span> {transaction.item}</div>
                            <div><span className="font-semibold">Amount:</span> ₦{transaction.amount.toLocaleString()}</div>
                        </>
                    )}
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold text-text-primary dark:text-dark-text-primary mb-2">Chat History</h3>
                <div className="max-h-60 overflow-y-auto bg-gray-100 dark:bg-dark-background p-3 rounded-lg space-y-4">
                    {dispute.chatHistory.map((chat, index) => {
                        let senderType: 'buyer' | 'seller' | 'admin' = 'buyer';
                        if(chat.sender === dispute.seller) senderType = 'seller';
                        if(admins.some(a => a.name === chat.sender)) senderType = 'admin';

                        const senderClasses = {
                            buyer: 'justify-start',
                            seller: 'justify-end',
                            admin: 'justify-center',
                        };
                        const bubbleClasses = {
                           buyer: 'bg-white shadow-sm dark:bg-gray-600',
                           seller: 'bg-primary-light dark:bg-indigo-900/50',
                           admin: 'bg-red-100 dark:bg-red-900/50 border border-red-200 dark:border-red-500/50 text-red-800 dark:text-red-200 w-full',
                        };
                       return (
                        <div key={index} className={`flex ${senderClasses[senderType]}`}>
                            <div className={`p-3 rounded-lg max-w-md ${bubbleClasses[senderType]}`}>
                                {senderType === 'admin' && <p className="font-bold text-sm mb-1">Admin Message</p>}
                                <p className="text-sm text-text-primary dark:text-dark-text-primary">{chat.message}</p>
                                <span className="text-xs text-text-secondary dark:text-dark-text-secondary mt-1 block text-right">{new Date(chat.timestamp).toLocaleString()}</span>
                            </div>
                        </div>
                    )})}
                    {dispute.chatHistory.length === 0 && (
                        <p className="text-sm text-center text-text-secondary">No chat history available for this dispute.</p>
                    )}
                </div>
                {currentUser.role === 'Admin' && (
                    <form onSubmit={handleAdminMessageSubmit} className="mt-2 flex items-center space-x-2">
                         <input
                            type="text"
                            value={adminMessage}
                            onChange={(e) => setAdminMessage(e.target.value)}
                            placeholder="Type an admin message to mediate..."
                            className="flex-1 px-4 py-2 border rounded-full bg-gray-100 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                        <button type="submit" className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors">
                           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086L2.279 16.76a.75.75 0 00.95.826l16-5.333a.75.75 0 000-1.418l-16-5.333z" /></svg>
                        </button>
                    </form>
                )}
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-text-primary dark:text-dark-text-primary mb-3">AI Mediation Analysis</h3>
                {isLoading && <LoadingSpinner />}
                {error && <p className="text-red-500">{error}</p>}
                {analysis && !isLoading && (
                    <div className="space-y-4 text-sm">
                        <AnalysisSection title="Summary">
                            <p className="text-text-secondary dark:text-dark-text-secondary">{analysis.summary}</p>
                        </AnalysisSection>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <AnalysisSection title="Buyer's Claims">
                                <ul className="list-disc list-inside text-text-secondary dark:text-dark-text-secondary space-y-1">
                                    {analysis.buyer_claims.map((claim, i) => <li key={i}>{claim}</li>)}
                                </ul>
                            </AnalysisSection>
                            <AnalysisSection title="Seller's Claims">
                                <ul className="list-disc list-inside text-text-secondary dark:text-dark-text-secondary space-y-1">
                                    {analysis.seller_claims.map((claim, i) => <li key={i}>{claim}</li>)}
                                </ul>
                            </AnalysisSection>
                        </div>
                         {analysis.policy_violations.length > 0 && (
                            <AnalysisSection title="Policy Violations">
                                <ul className="list-disc list-inside text-yellow-700 dark:text-yellow-400 space-y-1">
                                    {analysis.policy_violations.map((violation, i) => <li key={i}>{violation}</li>)}
                                </ul>
                            </AnalysisSection>
                        )}
                        <AnalysisSection title="Suggested Resolution">
                           <div className="bg-primary-light p-3 rounded-md text-primary-dark font-semibold dark:bg-indigo-900/50 dark:text-indigo-300">
                             <p>{analysis.suggested_resolution}</p>
                           </div>
                        </AnalysisSection>
                    </div>
                )}
            </div>
        </div>

        <div className="p-6 border-t bg-gray-50 dark:bg-dark-surface">
            {!isActionView ? (
                 <div className="flex justify-end space-x-3">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-text-secondary dark:text-dark-text-secondary rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">Close</button>
                    <button onClick={() => setIsActionView(true)} className="px-4 py-2 bg-secondary text-white rounded-lg hover:opacity-90 transition-colors">Take Action</button>
                 </div>
            ) : (
                <div>
                    <h4 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-3">Select Resolution Outcome</h4>
                    <div className="space-y-2">
                        <button onClick={() => setResolution('refund')} className={`w-full text-left p-2 rounded-md transition-colors ${resolution === 'refund' ? 'bg-red-500 text-white' : 'bg-gray-200 dark:bg-gray-600 hover:bg-red-200 dark:hover:bg-red-900/30'}`}>
                            Refund Buyer (Full Amount)
                        </button>
                        <button onClick={() => setResolution('release')} className={`w-full text-left p-2 rounded-md transition-colors ${resolution === 'release' ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-600 hover:bg-green-200 dark:hover:bg-green-900/30'}`}>
                            Release Funds to Seller
                        </button>
                        <div>
                             <button onClick={() => setResolution('partial')} className={`w-full text-left p-2 rounded-md transition-colors ${resolution === 'partial' ? 'bg-yellow-500 text-white' : 'bg-gray-200 dark:bg-gray-600 hover:bg-yellow-200 dark:hover:bg-yellow-900/30'}`}>
                                Offer Partial Refund
                            </button>
                             {resolution === 'partial' && (
                                <div className="mt-2">
                                    <label htmlFor="partialAmount" className="text-sm font-medium text-text-secondary">Refund Amount (₦)</label>
                                    <input
                                        id="partialAmount"
                                        type="number"
                                        value={partialAmount}
                                        onChange={(e) => setPartialAmount(e.target.value)}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-surface dark:bg-gray-800"
                                        placeholder={`Max ₦${transaction?.amount.toLocaleString()}`}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="mt-4 flex justify-end space-x-3">
                        <button onClick={() => setIsActionView(false)} className="px-4 py-2 bg-gray-200 text-text-secondary rounded-lg hover:bg-gray-300 transition-colors">Cancel</button>
                        <button onClick={handleConfirmResolution} disabled={!resolution} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover disabled:bg-gray-300 transition-colors">Confirm Resolution</button>
                    </div>
                </div>
            )}
        </div>

      </div>
    </div>
  );
};