
import React from 'react';
import type { Transaction } from '../types';

interface TransactionsTableProps {
  transactions: Transaction[];
}

const statusColorMap: Record<Transaction['status'], string> = {
  Completed: 'bg-green-100 text-green-800',
  'In Escrow': 'bg-blue-100 text-blue-800',
  Pending: 'bg-yellow-100 text-yellow-800',
  Failed: 'bg-red-100 text-red-800',
};

export const TransactionsTable: React.FC<TransactionsTableProps> = ({ transactions }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="px-4 py-3">ID</th>
            <th scope="col" className="px-4 py-3">Item</th>
            <th scope="col" className="px-4 py-3">Amount</th>
            <th scope="col" className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id} className="bg-white border-b hover:bg-gray-50">
              <th scope="row" className="px-4 py-4 font-medium text-gray-900 whitespace-nowrap">
                {transaction.id}
              </th>
              <td className="px-4 py-4">{transaction.item}</td>
              <td className="px-4 py-4">${transaction.amount.toFixed(2)}</td>
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
