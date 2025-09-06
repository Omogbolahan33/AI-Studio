import React from 'react';
import { HomeIcon, DocumentReportIcon, UsersIcon, CogIcon, ShieldExclamationIcon, ChatBubbleLeftRightIcon, XMarkIcon, ChartPieIcon } from '../types';
import type { View, UserRole } from '../types';

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
  const handleLinkClick = (view: View) => {
    onNavigate(view);
    onCloseMobile();
  };
  
  const adminLinks = (
    <>
      <NavLink icon={<HomeIcon className="w-6 h-6" />} label="Dashboard" active={activeView === 'Dashboard'} onClick={() => handleLinkClick('Dashboard')} />
      {role === 'Super Admin' && (
        <NavLink icon={<ChartPieIcon className="w-6 h-6" />} label="Analytics" active={activeView === 'Analytics'} onClick={() => handleLinkClick('Analytics')} />
      )}
      <NavLink icon={<ChatBubbleLeftRightIcon className="w-6 h-6" />} label="Forum" active={activeView === 'Forum'} onClick={() => handleLinkClick('Forum')} />
      <NavLink icon={<DocumentReportIcon className="w-6 h-6" />} label="Transaction Management" active={activeView === 'Transaction Management'} onClick={() => handleLinkClick('Transaction Management')} />
      <NavLink icon={<CogIcon className="w-6 h-6" />} label="Settings" active={activeView === 'Settings'} onClick={() => handleLinkClick('Settings')} />
    </>
  );

  const SidebarContent = () => (
    <div className={`bg-gray-800 text-white flex flex-col p-4 space-y-2 h-full w-64`}>
       <div className={`p-4 text-center border-b border-gray-700 min-h-[65px] flex items-center justify-between w-full`}>
        <h2 className={`text-xl font-bold text-white whitespace-nowrap`}>
          Marketplace OS
        </h2>
        <button onClick={onCloseMobile} className="md:hidden p-1 text-gray-300 rounded-full hover:text-white hover:bg-gray-700 transition-colors" aria-label="Close sidebar">
            <XMarkIcon className="w-6 h-6" />
        </button>
      </div>
      <nav className="flex-1 mt-4 space-y-2 w-full">
        {adminLinks}
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