import React, { useState, useMemo } from 'react';
import type { Dispute } from '../types';
import { MagnifyingGlassIcon } from '../types';

interface DisputesTableProps {
  disputes: Dispute[];
  onDisputeSelect: (dispute: Dispute) => void;
}

const timeAgo = (isoDate: string): string => {
    if (!isoDate) return '';
    const date = new Date(isoDate);
    const now = new Date();
    const seconds = Math.round((now.getTime() - date.getTime()) / 1000);

    if (seconds < 5) return "Just now";
    
    const intervals = [
        { label: 'year', seconds: 31536000 },
        { label: 'month', seconds: 2592000 },
        { label: 'day', seconds: 86400 },
        { label: 'hour', seconds: 3600 },
        { label: 'minute', seconds: 60 }
    ];

    for (const interval of intervals) {
        const count = Math.floor(seconds / interval.seconds);
        if (count >= 1) {
            return `${count} ${interval.label}${count !== 1 ? 's' : ''} ago`;
        }
    }
    return "Just now";
};


export const DisputesTable: React.FC<DisputesTableProps> = ({ disputes, onDisputeSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Open' | 'Resolved' | 'Escalated'>('Open');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  const filteredAndSortedDisputes = useMemo(() => {
    let filtered = [...disputes];

    if (statusFilter !== 'All') {
      filtered = filtered.filter(d => d.status === statusFilter);
    }

    if (searchTerm.trim()) {
      const lowercasedFilter = searchTerm.toLowerCase();
      filtered = filtered.filter(d => 
        d.id.toLowerCase().includes(lowercasedFilter) ||
        d.transactionId.toLowerCase().includes(lowercasedFilter) ||
        d.buyer.toLowerCase().includes(lowercasedFilter) ||
        d.seller.toLowerCase().includes(lowercasedFilter) ||
        d.reason.toLowerCase().includes(lowercasedFilter)
      );
    }

    return filtered.sort((a, b) => {
      const dateA = new Date(a.openedDate).getTime();
      const dateB = new Date(b.openedDate).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
  }, [disputes, searchTerm, statusFilter, sortOrder]);

  return (
    <div className="overflow-x-auto">
       <div className="p-4 bg-gray-50 dark:bg-gray-700/50 flex flex-col sm:flex-row items-center gap-4 border-b dark:border-gray-600">
        <div className="relative w-full sm:flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="search"
            placeholder="Search by ID, user, or reason..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border dark:border-gray-600 rounded-lg bg-surface dark:bg-dark-surface dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            aria-label="Filter by status"
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="py-2 px-3 w-full sm:w-auto border rounded-lg bg-surface dark:bg-dark-surface focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          >
            <option value="Open">Status: Open</option>
            <option value="Resolved">Status: Resolved</option>
            <option value="Escalated">Status: Escalated</option>
            <option value="All">Status: All</option>
          </select>
          <select
            value={sortOrder}
            aria-label="Sort by date"
            onChange={(e) => setSortOrder(e.target.value as any)}
            className="py-2 px-3 w-full sm:w-auto border rounded-lg bg-surface dark:bg-dark-surface focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-4 py-3">ID</th>
            <th scope="col" className="px-4 py-3">Reason</th>
            <th scope="col" className="px-4 py-3">Date</th>
            <th scope="col" className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredAndSortedDisputes.length > 0 ? (
            filteredAndSortedDisputes.map((dispute) => (
              <tr key={dispute.id} className="bg-white dark:bg-dark-surface border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <th scope="row" className="px-4 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                  {dispute.id}
                </th>
                <td className="px-4 py-4">{dispute.reason}</td>
                <td className="px-4 py-4">{timeAgo(dispute.openedDate)}</td>
                <td className="px-4 py-4">
                  <button
                    onClick={() => onDisputeSelect(dispute)}
                    className="font-medium text-primary hover:underline"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))
           ) : (
            <tr>
              <td colSpan={4} className="text-center py-10 text-text-secondary dark:text-dark-text-secondary">
                No disputes match your criteria.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};