
import React, { useState, useEffect, useCallback } from 'react';
import { analyzeDispute } from '../services/geminiService';
import type { Dispute, AIAnalysis } from '../types';

interface DisputeModalProps {
  dispute: Dispute;
  onClose: () => void;
  onResolve: (disputeId: string, resolution: string) => void;
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

export const DisputeModal: React.FC<DisputeModalProps> = ({ dispute, onClose, onResolve }) => {
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isActionView, setIsActionView] = useState(false);
  const [resolution, setResolution] = useState<ResolutionType | null>(null);
  const [partialAmount, setPartialAmount] = useState('');

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
            if (isNaN(amount) || amount <= 0) {
                alert('Please enter a valid partial refund amount.');
                return;
            }
            resolutionDetails = `Partial refund of $${amount.toFixed(2)} to buyer`;
            break;
    }
    
    onResolve(dispute.id, resolutionDetails);
  };

  useEffect(() => {
    handleAnalyze();
  }, [handleAnalyze]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-surface rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-text-primary">Dispute Details: {dispute.id}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">Case Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><span className="font-semibold">Buyer:</span> {dispute.buyer}</div>
                    <div><span className="font-semibold">Seller:</span> {dispute.seller}</div>
                    <div><span className="font-semibold">Transaction ID:</span> {dispute.transactionId}</div>
                    <div><span className="font-semibold">Reason:</span> {dispute.reason}</div>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">Chat History</h3>
                <div className="max-h-60 overflow-y-auto bg-gray-100 p-3 rounded-lg space-y-4">
                    {dispute.chatHistory.map((chat, index) => (
                        <div key={index} className={`flex ${chat.sender === 'buyer' ? 'justify-start' : 'justify-end'}`}>
                            <div className={`p-3 rounded-lg max-w-md ${chat.sender === 'buyer' ? 'bg-white shadow-sm' : 'bg-primary-light'}`}>
                                <p className="text-sm text-text-primary">{chat.message}</p>
                                <span className="text-xs text-text-secondary mt-1 block text-right">{chat.timestamp}</span>
                            </div>
                        </div>
                    ))}
                    {dispute.chatHistory.length === 0 && (
                        <p className="text-sm text-center text-text-secondary">No chat history available for this dispute.</p>
                    )}
                </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-text-primary mb-3">AI Mediation Analysis</h3>
                {isLoading && <LoadingSpinner />}
                {error && <p className="text-red-500">{error}</p>}
                {analysis && !isLoading && (
                    <div className="space-y-4 text-sm">
                        <AnalysisSection title="Summary">
                            <p className="text-text-secondary">{analysis.summary}</p>
                        </AnalysisSection>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <AnalysisSection title="Buyer's Claims">
                                <ul className="list-disc list-inside text-text-secondary space-y-1">
                                    {analysis.buyer_claims.map((claim, i) => <li key={i}>{claim}</li>)}
                                </ul>
                            </AnalysisSection>
                            <AnalysisSection title="Seller's Claims">
                                <ul className="list-disc list-inside text-text-secondary space-y-1">
                                    {analysis.seller_claims.map((claim, i) => <li key={i}>{claim}</li>)}
                                </ul>
                            </AnalysisSection>
                        </div>
                         {analysis.policy_violations.length > 0 && (
                            <AnalysisSection title="Policy Violations">
                                <ul className="list-disc list-inside text-yellow-700 space-y-1">
                                    {analysis.policy_violations.map((violation, i) => <li key={i}>{violation}</li>)}
                                </ul>
                            </AnalysisSection>
                        )}
                        <AnalysisSection title="Suggested Resolution">
                           <div className="bg-primary-light p-3 rounded-md text-primary-dark font-semibold">
                             <p>{analysis.suggested_resolution}</p>
                           </div>
                        </AnalysisSection>
                    </div>
                )}
            </div>
        </div>

        <div className="p-6 border-t bg-gray-50">
            {!isActionView ? (
                 <div className="flex justify-end space-x-3">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-text-secondary rounded-lg hover:bg-gray-300 transition-colors">Close</button>
                    <button onClick={() => setIsActionView(true)} className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-opacity-90 transition-colors">Take Action</button>
                 </div>
            ) : (
                <div>
                    <h4 className="text-md font-semibold text-gray-800 mb-3">Select Resolution Outcome</h4>
                    <div className="space-y-2">
                        <button onClick={() => setResolution('refund')} className={`w-full text-left p-2 rounded-md transition-colors ${resolution === 'refund' ? 'bg-red-500 text-white' : 'bg-gray-200 hover:bg-red-200'}`}>
                            Refund Buyer (Full Amount)
                        </button>
                        <button onClick={() => setResolution('release')} className={`w-full text-left p-2 rounded-md transition-colors ${resolution === 'release' ? 'bg-green-500 text-white' : 'bg-gray-200 hover:bg-green-200'}`}>
                            Release Funds to Seller
                        </button>
                        <div>
                             <button onClick={() => setResolution('partial')} className={`w-full text-left p-2 rounded-md transition-colors ${resolution === 'partial' ? 'bg-yellow-500 text-white' : 'bg-gray-200 hover:bg-yellow-200'}`}>
                                Offer Partial Refund
                            </button>
                             {resolution === 'partial' && (
                                <div className="mt-2">
                                    <label htmlFor="partialAmount" className="text-sm font-medium text-text-secondary">Refund Amount ($)</label>
                                    <input
                                        id="partialAmount"
                                        type="number"
                                        value={partialAmount}
                                        onChange={(e) => setPartialAmount(e.target.value)}
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                        placeholder="e.g., 50.00"
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