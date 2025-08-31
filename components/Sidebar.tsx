
import React from 'react';
import { HomeIcon, DocumentReportIcon, UsersIcon, CogIcon, ShieldExclamationIcon, ChatBubbleLeftRightIcon, View, UserRole, ChatBubbleOvalLeftEllipsisIcon } from '../types';

interface NavLinkProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
  isCollapsed: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ icon, label, active, onClick, isCollapsed }) => (
  <button
    onClick={onClick}
    title={isCollapsed ? label : undefined}
    className={`flex items-center w-full py-3 rounded-lg transition-colors duration-200 text-left ${
      active
        ? 'bg-primary text-white shadow'
        : 'text-gray-200 hover:bg-primary-hover hover:text-white'
    } ${isCollapsed ? 'px-3 justify-center' : 'px-4'}`}
  >
    <span className="w-6 h-6">{icon}</span>
    {!isCollapsed && <span className="font-medium ml-3">{label}</span>}
  </button>
);

interface SidebarProps {
    activeView: View;
    onNavigate: (view: View) => void;
    role: UserRole;
    isCollapsed: boolean;
    userName: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView, onNavigate, role, isCollapsed, userName }) => {
  const adminLinks = (
    <>
      <NavLink icon={<HomeIcon className="w-6 h-6" />} label="Dashboard" active={activeView === 'Dashboard'} onClick={() => onNavigate('Dashboard')} isCollapsed={isCollapsed} />
      <NavLink icon={<ChatBubbleLeftRightIcon className="w-6 h-6" />} label="Forum" active={activeView === 'Forum'} onClick={() => onNavigate('Forum')} isCollapsed={isCollapsed} />
      <NavLink icon={<DocumentReportIcon className="w-6 h-6" />} label="Transactions" active={activeView === 'Transactions'} onClick={() => onNavigate('Transactions')} isCollapsed={isCollapsed} />
      <NavLink icon={<ShieldExclamationIcon className="w-6 h-6" />} label="Disputes" active={activeView === 'Disputes'} onClick={() => onNavigate('Disputes')} isCollapsed={isCollapsed} />
      <NavLink icon={<UsersIcon className="w-6 h-6" />} label="Users" active={activeView === 'Users'} onClick={() => onNavigate('Users')} isCollapsed={isCollapsed} />
      <NavLink icon={<CogIcon className="w-6 h-6" />} label="Settings" active={activeView === 'Settings'} onClick={() => onNavigate('Settings')} isCollapsed={isCollapsed} />
    </>
  );

  const memberLinks = (
    <>
        <NavLink icon={<ChatBubbleLeftRightIcon className="w-6 h-6" />} label="Forum" active={activeView === 'Forum'} onClick={() => onNavigate('Forum')} isCollapsed={isCollapsed} />
        <NavLink icon={<ChatBubbleOvalLeftEllipsisIcon className="w-6 h-6" />} label="My Chats" active={activeView === 'My Chats'} onClick={() => onNavigate('My Chats')} isCollapsed={isCollapsed} />
        <NavLink icon={<DocumentReportIcon className="w-6 h-6" />} label="My Transactions" active={activeView === 'My Transactions'} onClick={() => onNavigate('My Transactions')} isCollapsed={isCollapsed} />
        <NavLink icon={<ShieldExclamationIcon className="w-6 h-6" />} label="My Disputes" active={activeView === 'My Disputes'} onClick={() => onNavigate('My Disputes')} isCollapsed={isCollapsed} />
    </>
  );

  return (
    <div className={`bg-gray-800 text-white flex-col p-4 space-y-2 hidden md:flex transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'}`}>
      <div className="p-4 text-center border-b border-gray-700 min-h-[65px] flex items-center justify-center">
        <h2 className={`text-xl font-bold text-white whitespace-nowrap transition-opacity duration-200 ease-in-out ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}>
            {!isCollapsed ? `Hi, ${userName.split(' ')[0]}` : ''}
        </h2>
      </div>
      <nav className="flex-1 mt-4 space-y-2">
        {role === 'Admin' ? adminLinks : memberLinks}
      </nav>
      <div className={`p-4 border-t border-gray-700 transition-opacity duration-300 ${isCollapsed ? 'opacity-0 h-0' : 'opacity-100'}`}>
        {!isCollapsed && <p className="text-sm text-gray-400 text-center">© 2024</p>}
      </div>
    </div>
  );
};
