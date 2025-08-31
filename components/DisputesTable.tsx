
import React from 'react';
import type { Dispute } from '../types';

interface DisputesTableProps {
  disputes: Dispute[];
  onDisputeSelect: (dispute: Dispute) => void;
}

export const DisputesTable: React.FC<DisputesTableProps> = ({ disputes, onDisputeSelect }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="px-4 py-3">ID</th>
            <th scope="col" className="px-4 py-3">Reason</th>
            <th scope="col" className="px-4 py-3">Date</th>
            <th scope="col" className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {disputes.map((dispute) => (
            <tr key={dispute.id} className="bg-white border-b hover:bg-gray-50">
              <th scope="row" className="px-4 py-4 font-medium text-gray-900 whitespace-nowrap">
                {dispute.id}
              </th>
              <td className="px-4 py-4">{dispute.reason}</td>
              <td className="px-4 py-4">{dispute.openedDate}</td>
              <td className="px-4 py-4">
                <button
                  onClick={() => onDisputeSelect(dispute)}
                  className="font-medium text-primary hover:underline"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
