
import React, { useState, useEffect, useRef } from 'react';
import type { UserRole, View, Notification, Chat } from '../types';
import { Bars3Icon, BellIcon, EnvelopeIcon } from '../types';
import { NotificationPanel } from './NotificationPanel';

interface HeaderProps {
    role: UserRole;
    onToggleMobileSidebar: () => void;
    userName: string;
    onSignOut: () => void;
    onNavigate: (view: View) => void;
    notifications: Notification[];
    messages: Chat[];
    onMarkNotificationAsRead: (id: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ role, onToggleMobileSidebar, userName, onSignOut, onNavigate, notifications, messages, onMarkNotificationAsRead }) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [messagesOpen, setMessagesOpen] = useState(false);
  
  const profileRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (profileRef.current && !profileRef.current.contains(event.target as Node)) setProfileOpen(false);
        if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) setNotificationsOpen(false);
        if (messagesRef.current && !messagesRef.current.contains(event.target as Node)) setMessagesOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleProfileClick = () => {
    onNavigate('My Profile');
    setProfileOpen(false);
  };
  
  const unreadMessagesCount = messages.length; // Simplified for now
  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  const AdminHeader = () => (
    <>
      <div className="flex items-center space-x-2">
        <button
            onClick={onToggleMobileSidebar}
            className="md:hidden p-2 rounded-full text-gray-500 hover:bg-gray-200"
            aria-label="Open sidebar"
        >
            <Bars3Icon className="w-6 h-6" />
        </button>
      </div>
      <div className="flex-1 flex justify-center px-4">
        <div className="relative w-full max-w-md">
            <input
            type="search"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 w-full border rounded-full bg-gray-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="absolute top-0 left-0 mt-3 ml-3 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            </div>
        </div>
      </div>
    </>
  );

  const MemberHeader = () => (
    <>
        <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-primary">Socials</h1>
            <nav className="hidden md:flex items-center space-x-2">
                <button onClick={() => onNavigate('Forum')} className="px-3 py-2 text-sm font-semibold text-text-primary rounded-md hover:bg-gray-100">Forum</button>
                <button onClick={() => onNavigate('My Chats')} className="px-3 py-2 text-sm font-semibold text-text-primary rounded-md hover:bg-gray-100">My Chats</button>
            </nav>
        </div>
        <div className="flex items-center space-x-4">
             <div className="relative" ref={messagesRef}>
                <button onClick={() => setMessagesOpen(p => !p)} className="relative p-2 text-gray-500 rounded-full hover:bg-gray-100">
                    <EnvelopeIcon className="w-6 h-6" />
                    {unreadMessagesCount > 0 && <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />}
                </button>
                {messagesOpen && <NotificationPanel type="message" items={messages} onNavigate={() => onNavigate('My Chats')} onClose={() => setMessagesOpen(false)} />}
            </div>
             <div className="relative" ref={notificationsRef}>
                <button onClick={() => setNotificationsOpen(p => !p)} className="relative p-2 text-gray-500 rounded-full hover:bg-gray-100">
                    <BellIcon className="w-6 h-6" />
                    {unreadNotificationsCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                            {unreadNotificationsCount}
                        </span>
                    )}
                </button>
                 {notificationsOpen && <NotificationPanel type="notification" items={notifications} onMarkAsRead={onMarkNotificationAsRead} onClose={() => setNotificationsOpen(false)} />}
            </div>
        </div>
    </>
  );

  return (
    <header className="bg-surface shadow-sm p-4 flex justify-between items-center flex-shrink-0 z-10">
      {role === 'Admin' ? <AdminHeader /> : <MemberHeader />}
      
      <div className="relative" ref={profileRef}>
        <button
          onClick={() => setProfileOpen(prev => !prev)}
          className="flex items-center space-x-2 rounded-full p-1 pr-3 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          aria-label="Open user menu"
        >
          <img
            src={`https://i.pravatar.cc/40?u=${userName}`}
            alt="Avatar"
            className="w-8 h-8 rounded-full"
          />
           <span className="font-semibold text-text-primary hidden sm:block">{userName}</span>
        </button>
        
        {profileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 ring-1 ring-black ring-opacity-5">
                {role === 'Member' && (
                     <button
                        onClick={handleProfileClick}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                        My Profile
                    </button>
                )}
                <button
                    onClick={onSignOut}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                    Sign Out
                </button>
            </div>
        )}
      </div>
    </header>
  );
};