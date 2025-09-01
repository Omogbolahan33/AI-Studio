
import React, { useState, useMemo } from 'react';
import type { User } from '../types';
import { MagnifyingGlassIcon } from '../types';

interface UsersPageProps {
  users: User[];
  onViewProfile: (user: User) => void;
}

const UserStatusBadge: React.FC<{ user: User }> = ({ user }) => {
    const isBanned = user.banExpiresAt && new Date(user.banExpiresAt) > new Date();

    if (!user.isActive) {
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Deactivated</span>;
    }
    if (isBanned) {
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Banned</span>;
    }
    return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Active</span>;
};

export const UsersPage: React.FC<UsersPageProps> = ({ users, onViewProfile }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = useMemo(() => {
    if (!searchTerm) {
      return users;
    }
    const lowercasedFilter = searchTerm.toLowerCase();
    return users.filter(user =>
      user.name.toLowerCase().includes(lowercasedFilter) ||
      user.username.toLowerCase().includes(lowercasedFilter)
    );
  }, [users, searchTerm]);

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">User Management</h1>
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="search"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border rounded-lg bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>
      <div className="bg-surface rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                    <th scope="col" className="px-6 py-3">Name</th>
                    <th scope="col" className="px-6 py-3">Role</th>
                    <th scope="col" className="px-6 py-3">Status</th>
                    <th scope="col" className="px-6 py-3">Actions</th>
                </tr>
            </thead>
            <tbody>
                {filteredUsers.map(user => (
                    <tr key={user.id} className="bg-white border-b hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                            <div className="flex items-center">
                                <img className="h-10 w-10 rounded-full" src={user.avatarUrl} alt="" />
                                <div className="ml-4">
                                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                    <div className="text-sm text-gray-500">@{user.username}</div>
                                </div>
                            </div>
                        </td>
                        <td className="px-6 py-4">{user.role}</td>
                        <td className="px-6 py-4">
                            <UserStatusBadge user={user} />
                        </td>
                        <td className="px-6 py-4">
                            <button
                                onClick={() => onViewProfile(user)}
                                className="font-medium text-primary hover:underline"
                            >
                                Manage
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </div>
  );
};