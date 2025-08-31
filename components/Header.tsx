
import React from 'react';
import type { UserRole } from '../types';
import { ArrowLeftOnRectangleIcon } from '../types';

interface HeaderProps {
    role: UserRole;
    onToggleSidebar: () => void;
    userName: string;
    onSignOut: () => void;
}

export const Header: React.FC<HeaderProps> = ({ role, onToggleSidebar, userName, onSignOut }) => {
  return (
    <header className="bg-surface shadow-sm p-4 flex justify-between items-center">
      <div className="relative">
        <input
          type="search"
          placeholder="Search..."
          className="pl-10 pr-4 py-2 w-full md:w-64 border rounded-full bg-gray-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <div className="absolute top-0 left-0 mt-3 ml-3 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <button
          onClick={onToggleSidebar}
          className="flex items-center space-x-2 rounded-full p-1 pr-2 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          aria-label="Toggle sidebar"
        >
          <div className="text-right hidden md:block">
            <p className="font-semibold text-text-primary">{userName}</p>
            <p className="text-sm text-text-secondary">{role}</p>
          </div>
          <img
            src={`https://i.pravatar.cc/40?u=${userName}`}
            alt="Avatar"
            className="w-10 h-10 rounded-full"
          />
        </button>
        <button
          onClick={onSignOut}
          title="Sign Out"
          className="p-2 rounded-full text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          aria-label="Sign Out"
        >
          <ArrowLeftOnRectangleIcon className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
};
