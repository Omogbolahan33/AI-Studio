import React from 'react';
import type { Transaction } from '../types';

interface TransactionsTableProps {
  transactions: Transaction[];
  onSelectTransaction: (transaction: Transaction) => void;
}

const statusColorMap: Record<Transaction['status'], string> = {
  Pending: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  Completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  'In Escrow': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  Shipped: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
  Delivered: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  Disputed: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  Cancelled: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
};

export const TransactionsTable: React.FC<TransactionsTableProps> = ({ transactions, onSelectTransaction }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-4 py-3">ID</th>
            <th scope="col" className="px-4 py-3">Item</th>
            <th scope="col" className="px-4 py-3">Amount</th>
            <th scope="col" className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr 
              key={transaction.id} 
              className="bg-white dark:bg-dark-surface border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer"
              onClick={() => onSelectTransaction(transaction)}
            >
              <th scope="row" className="px-4 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                {transaction.id}
              </th>
              <td className="px-4 py-4 dark:text-dark-text-primary">{transaction.item}</td>
              <td className="px-4 py-4 dark:text-dark-text-primary">₦{transaction.amount.toFixed(2)}</td>
              <td className="px-4 py-4">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColorMap[transaction.status]}`}>
                  {transaction.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};