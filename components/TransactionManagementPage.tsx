import React, { useState } from 'react';
import type { Transaction, Dispute } from '../types';
import { TransactionsTable } from './TransactionsTable';
import { DisputesTable } from './DisputesTable';
import { DocumentReportIcon, ShieldExclamationIcon } from '../types';

interface TransactionManagementPageProps {
  transactions: Transaction[];
  disputes: Dispute[];
  onSelectTransaction: (transaction: Transaction) => void;
  onDisputeSelect: (dispute: Dispute) => void;
  initialTab?: 'transactions' | 'disputes';
}

const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
    <button
        onClick={onClick}
        className={`flex items-center space-x-2 px-4 py-3 font-semibold text-sm transition-colors ${
            active
                ? 'border-b-2 border-primary text-primary'
                : 'text-text-secondary hover:text-text-primary'
        }`}
    >
        {children}
    </button>
);

export const TransactionManagementPage: React.FC<TransactionManagementPageProps> = ({
  transactions,
  disputes,
  onSelectTransaction,
  onDisputeSelect,
  initialTab = 'transactions'
}) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  
  const openDisputesCount = disputes.filter(d => d.status === 'Open').length;

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-text-primary dark:text-dark-text-primary mb-4">Transaction Management</h1>
      
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <nav className="flex flex-wrap -mb-px">
          <TabButton active={activeTab === 'transactions'} onClick={() => setActiveTab('transactions')}>
            <DocumentReportIcon className="w-5 h-5 mr-2" />
            <span>All Transactions</span>
          </TabButton>
          <TabButton active={activeTab === 'disputes'} onClick={() => setActiveTab('disputes')}>
            <ShieldExclamationIcon className="w-5 h-5 mr-2" />
            <span>Disputes</span>
             {openDisputesCount > 0 && (
                <span className="ml-2 text-xs font-bold bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 rounded-full px-2 py-0.5">
                    {openDisputesCount}
                </span>
            )}
          </TabButton>
        </nav>
      </div>

      <div className="bg-surface dark:bg-dark-surface rounded-lg shadow">
        {activeTab === 'transactions' && (
          <TransactionsTable transactions={transactions} onSelectTransaction={onSelectTransaction} />
        )}
        {activeTab === 'disputes' && (
          <DisputesTable disputes={disputes} onDisputeSelect={onDisputeSelect} />
        )}
      </div>
    </div>
  );
};