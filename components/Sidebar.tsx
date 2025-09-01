
import React from 'react';
import { HomeIcon, DocumentReportIcon, UsersIcon, CogIcon, ShieldExclamationIcon, ChatBubbleLeftRightIcon, View, UserRole, ChatBubbleOvalLeftEllipsisIcon } from '../types';

interface NavLinkProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}

const NavLink: React.FC<NavLinkProps> = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    title={label}
    className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors duration-200 text-left ${
      active
        ? 'bg-primary text-white shadow'
        : 'text-gray-200 hover:bg-primary-hover hover:text-white'
    }`}
  >
    <span className="w-6 h-6">{icon}</span>
    <span className="font-medium ml-3">{label}</span>
  </button>
);

interface SidebarProps {
    activeView: View;
    onNavigate: (view: View) => void;
    role: UserRole;
    isMobileOpen: boolean;
    onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView, onNavigate, role, isMobileOpen, onCloseMobile }) => {
  const adminLinks = (
    <>
      <NavLink icon={<HomeIcon className="w-6 h-6" />} label="Dashboard" active={activeView === 'Dashboard'} onClick={() => onNavigate('Dashboard')} />
      <NavLink icon={<ChatBubbleLeftRightIcon className="w-6 h-6" />} label="Forum" active={activeView === 'Forum'} onClick={() => onNavigate('Forum')} />
      <NavLink icon={<DocumentReportIcon className="w-6 h-6" />} label="Transactions" active={activeView === 'Transactions'} onClick={() => onNavigate('Transactions')} />
      <NavLink icon={<ShieldExclamationIcon className="w-6 h-6" />} label="Disputes" active={activeView === 'Disputes'} onClick={() => onNavigate('Disputes')} />
      <NavLink icon={<UsersIcon className="w-6 h-6" />} label="Users" active={activeView === 'Users'} onClick={() => onNavigate('Users')} />
      <NavLink icon={<CogIcon className="w-6 h-6" />} label="Settings" active={activeView === 'Settings'} onClick={() => onNavigate('Settings')} />
    </>
  );

  const memberLinks = (
    <>
        <NavLink icon={<ChatBubbleLeftRightIcon className="w-6 h-6" />} label="Forum" active={activeView === 'Forum'} onClick={() => onNavigate('Forum')} />
        <NavLink icon={<ChatBubbleOvalLeftEllipsisIcon className="w-6 h-6" />} label="My Chats" active={activeView === 'My Chats'} onClick={() => onNavigate('My Chats')} />
    </>
  );
  
  const SidebarContent = () => (
    <div className={`bg-gray-800 text-white flex flex-col p-4 space-y-2 h-full w-64`}>
       <div className={`p-4 text-center border-b border-gray-700 min-h-[65px] flex items-center justify-start w-full`}>
        <h2 className={`text-xl font-bold text-white whitespace-nowrap`}>
          Marketplace OS
        </h2>
      </div>
      <nav className="flex-1 mt-4 space-y-2 w-full">
        {role === 'Admin' ? adminLinks : memberLinks}
      </nav>
      <div className={`p-4 border-t border-gray-700`}>
        <p className="text-sm text-gray-400 text-center">© 2024</p>
      </div>
    </div>
  );

  return (
    <>
        {/* Desktop Sidebar */}
        <div className={`hidden md:flex flex-shrink-0`}>
            <SidebarContent />
        </div>

        {/* Mobile Sidebar */}
        <div 
            className={`fixed inset-0 z-40 md:hidden transition-transform duration-300 ease-in-out ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
             <div className="w-64">
                <SidebarContent />
            </div>
        </div>
        {isMobileOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden" onClick={onCloseMobile}></div>}

    </>
  );
};