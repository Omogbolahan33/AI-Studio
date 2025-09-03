import React, { useState, useEffect, useRef } from 'react';
import type { UserRole, View, Notification, Chat, User, Post } from '../types';
import { Bars3Icon, BellIcon, EnvelopeIcon, SunIcon, MoonIcon, UserGroupIcon, MagnifyingGlassIcon, ChevronLeftIcon, UsersIcon, DocumentTextIcon, ChevronDownIcon, CommunityIcon, UserPlusIcon, UserCircleIcon } from '../types';
import { NotificationPanel } from './NotificationPanel';
import { FollowingPanel } from './FollowingPanel';
import { FollowRequestPanel } from './FollowRequestPanel';


interface HeaderProps {
    role: UserRole;
    onToggleMobileSidebar: () => void;
    userName: string;
    onSignOut: () => void;
    onNavigate: (view: View) => void;
    notifications: Notification[];
    messages: Chat[];
    onNotificationClick: (item: Notification | Chat) => void;
    theme: 'light' | 'dark';
    onToggleTheme: () => void;
    currentUser: User;
    users: User[];
    posts: Post[];
    onStartChat: (user: User) => void;
    onViewProfile: (user: User) => void;
    onSelectPost: (post: Post) => void;
    onAcceptFollowRequest: (requesterId: string) => void;
    onDeclineFollowRequest: (requesterId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ role, onToggleMobileSidebar, userName, onSignOut, onNavigate, notifications, messages, onNotificationClick, theme, onToggleTheme, currentUser, users, posts, onStartChat, onViewProfile, onSelectPost, onAcceptFollowRequest, onDeclineFollowRequest }) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [messagesOpen, setMessagesOpen] = useState(false);
  const [followingOpen, setFollowingOpen] = useState(false);
  const [followRequestsOpen, setFollowRequestsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<(User | Post)[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [searchType, setSearchType] = useState<'Users' | 'Posts'>('Users');
  const [isSearchTypeOpen, setIsSearchTypeOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const followingRef = useRef<HTMLDivElement>(null);
  const followRequestsRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchTypeRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (profileRef.current && !profileRef.current.contains(event.target as Node)) setProfileOpen(false);
        if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) setNotificationsOpen(false);
        if (messagesRef.current && !messagesRef.current.contains(event.target as Node)) setMessagesOpen(false);
        if (followingRef.current && !followingRef.current.contains(event.target as Node)) setFollowingOpen(false);
        if (followRequestsRef.current && !followRequestsRef.current.contains(event.target as Node)) setFollowRequestsOpen(false);
        if (searchRef.current && !searchRef.current.contains(event.target as Node)) setIsSearchFocused(false);
        if (searchTypeRef.current && !searchTypeRef.current.contains(event.target as Node)) setIsSearchTypeOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
        setSearchResults([]);
        return;
    }

    if (searchType === 'Users') {
        const filtered = users.filter(user =>
            (user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.username.toLowerCase().includes(searchQuery.toLowerCase())) &&
            user.id !== currentUser.id
        ).slice(0, 5);
        setSearchResults(filtered);
    } else {
        const filtered = posts.filter(post => 
            post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            stripHtml(post.content).toLowerCase().includes(searchQuery.toLowerCase())
        ).slice(0, 5);
        setSearchResults(filtered);
    }
  }, [searchQuery, users, posts, currentUser.id, searchType]);
  
  const stripHtml = (html: string) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  };

  const handleSelectResult = (item: User | Post) => {
    if ('username' in item) {
        onViewProfile(item);
    } else {
        onSelectPost(item);
    }
    setSearchQuery('');
    setSearchResults([]);
    setIsSearchFocused(false);
    setIsMobileSearchOpen(false);
  };

  const handleProfileClick = () => {
    onNavigate('My Profile');
    setProfileOpen(false);
  };
  
  const unreadMessagesCount = messages.length; // Simplified for now
  const unreadNotificationsCount = notifications.filter(n => !n.read && n.type !== 'follow_request').length;
  const followRequestCount = currentUser.pendingFollowerIds.length;
  const followRequestUsers = users.filter(u => currentUser.pendingFollowerIds.includes(u.id));

  const SmartSearch = () => (
    <div ref={searchRef} className="relative w-full max-w-lg">
        <div className="flex w-full items-center">
            <div ref={searchTypeRef} className="relative">
                <button 
                    type="button"
                    onClick={() => setIsSearchTypeOpen(prev => !prev)} 
                    className="flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-l-full hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none"
                    aria-haspopup="true"
                    aria-expanded={isSearchTypeOpen}
                >
                    {searchType}
                    <ChevronDownIcon className="w-2.5 h-2.5 ml-2.5" />
                </button>
                {isSearchTypeOpen && (
                    <div className="absolute mt-2 w-36 bg-surface dark:bg-dark-surface rounded-md shadow-lg z-20 ring-1 ring-black ring-opacity-5">
                        <button onClick={() => { setSearchType('Users'); setIsSearchTypeOpen(false); }} className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                            <UsersIcon className="w-5 h-5" />
                            <span>Users</span>
                        </button>
                        <button onClick={() => { setSearchType('Posts'); setIsSearchTypeOpen(false); }} className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
                            <DocumentTextIcon className="w-5 h-5" />
                            <span>Posts</span>
                        </button>
                    </div>
                )}
            </div>

            <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
                </div>
                <input
                    type="search"
                    placeholder={`Search for ${searchType.toLowerCase()}...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    className="block pl-10 p-2.5 w-full z-20 text-sm bg-gray-100 dark:bg-gray-700 rounded-r-full border border-l-0 border-gray-300 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    autoComplete="off"
                />
            </div>
        </div>
        
        {isSearchFocused && searchQuery && (
             <div className="absolute mt-2 w-full bg-surface dark:bg-dark-surface rounded-md shadow-lg z-20 ring-1 ring-black ring-opacity-5">
                <ul className="max-h-60 overflow-y-auto divide-y dark:divide-gray-700">
                    {searchResults.length > 0 ? searchResults.map(item => (
                        <li key={item.id}>
                            {'username' in item ? (
                                <button
                                    onClick={() => handleSelectResult(item as User)}
                                    className="w-full text-left px-4 py-2 flex items-center space-x-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    <img src={item.avatarUrl} alt={item.name} className="w-8 h-8 rounded-full" />
                                    <div>
                                        <p className="font-semibold text-sm">{item.name}</p>
                                        <p className="text-xs text-gray-500">@{item.username}</p>
                                    </div>
                                </button>
                            ) : (
                                <button
                                    onClick={() => handleSelectResult(item as Post)}
                                    className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    <p className="font-semibold text-sm truncate">{item.title}</p>
                                    <p className="text-xs text-gray-500">by {item.author}</p>
                                </button>
                            )}
                        </li>
                    )) : (
                        <li className="px-4 py-3 text-sm text-center text-gray-500">No {searchType.toLowerCase()} found.</li>
                    )}
                </ul>
            </div>
        )}
    </div>
);


  const AdminHeader = () => (
    <>
      <div className="flex items-center space-x-2">
        <button
            onClick={onToggleMobileSidebar}
            className="md:hidden p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
            aria-label="Open sidebar"
        >
            <Bars3Icon className="w-6 h-6" />
        </button>
      </div>
      <div className="flex-1 flex justify-center px-4">
        <SmartSearch />
      </div>
    </>
  );

  const MemberHeader = () => (
    <>
        <div className="flex items-center space-x-4">
            <button onClick={() => onNavigate('Forum')} className="flex items-center gap-2 text-2xl font-bold text-primary dark:text-dark-text-primary focus:outline-none hover:text-primary-hover dark:hover:text-gray-300">
                <CommunityIcon className="w-8 h-8"/>
                <span>Socials</span>
            </button>
            <nav className="hidden md:flex items-center space-x-2">
                <button onClick={() => onNavigate('My Chats')} className="px-3 py-2 text-sm font-semibold text-text-primary dark:text-dark-text-primary rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">My Chats</button>
            </nav>
        </div>
        <div className="flex-1 flex justify-center px-4 hidden md:flex">
             <SmartSearch />
        </div>
        <div className="flex items-center space-x-2 sm:space-x-4">
             <button onClick={() => setIsMobileSearchOpen(true)} className="md:hidden p-2 text-gray-500 dark:text-gray-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                <MagnifyingGlassIcon className="w-6 h-6" />
            </button>
             <div ref={messagesRef}>
                <button onClick={() => setMessagesOpen(p => !p)} className="relative p-2 text-gray-500 dark:text-gray-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                    <EnvelopeIcon className="w-6 h-6" />
                    {unreadMessagesCount > 0 && <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />}
                </button>
                {messagesOpen && <NotificationPanel type="message" items={messages} onItemClick={onNotificationClick} onClose={() => setMessagesOpen(false)} />}
            </div>
            <div ref={followRequestsRef}>
                 <button onClick={() => setFollowRequestsOpen(p => !p)} className="relative p-2 text-gray-500 dark:text-gray-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700" title="Follow Requests">
                    <UserPlusIcon className="w-6 h-6" />
                    {followRequestCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-white">
                            {followRequestCount}
                        </span>
                    )}
                </button>
                {followRequestsOpen && <FollowRequestPanel requests={followRequestUsers} onAccept={onAcceptFollowRequest} onDecline={onDeclineFollowRequest} onClose={() => setFollowRequestsOpen(false)} />}
            </div>
             <div ref={notificationsRef}>
                <button onClick={() => setNotificationsOpen(p => !p)} className="relative p-2 text-gray-500 dark:text-gray-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                    <BellIcon className="w-6 h-6" />
                    {unreadNotificationsCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                            {unreadNotificationsCount}
                        </span>
                    )}
                </button>
                 {notificationsOpen && <NotificationPanel type="notification" items={notifications.filter(n => n.type !== 'follow_request')} onItemClick={onNotificationClick} onClose={() => setNotificationsOpen(false)} />}
            </div>
        </div>
    </>
  );

  const MobileSearch = () => (
    <div className="p-0 flex items-center gap-2 w-full">
         <button
            onClick={() => setIsMobileSearchOpen(false)}
            className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
            aria-label="Close search"
        >
            <ChevronLeftIcon className="w-6 h-6" />
        </button>
        <div className="flex-1">
            <SmartSearch />
        </div>
    </div>
);


  return (
    <header className="bg-surface dark:bg-dark-surface shadow-sm p-4 flex justify-between items-center flex-shrink-0 z-10 gap-4 relative">
       {isMobileSearchOpen && role === 'Member' ? (
            <MobileSearch />
        ) : (
            <>
                {role === 'Admin' ? <AdminHeader /> : <MemberHeader />}
      
                <div className="flex items-center space-x-2">
                    <div className="relative" ref={profileRef}>
                        <button
                            onClick={() => setProfileOpen(prev => !prev)}
                            className="flex-shrink-0 flex items-center space-x-2 rounded-full p-1 sm:pr-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                            aria-label="Open user menu"
                        >
                            <img
                            src={currentUser.avatarUrl || `https://i.pravatar.cc/40?u=${userName}`}
                            alt="Avatar"
                            className="w-8 h-8 rounded-full object-cover"
                            />
                        <span className="font-semibold text-text-primary dark:text-dark-text-primary hidden sm:block">{userName}</span>
                        </button>
                    
                        {profileOpen && (
                            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-dark-surface rounded-md shadow-lg py-1 z-20 ring-1 ring-black ring-opacity-5">
                                {role === 'Member' && (
                                    <button
                                        onClick={handleProfileClick}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-3"
                                    >
                                        <UserCircleIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                        <span>My Profile</span>
                                    </button>
                                )}
                                <button
                                    onClick={onToggleTheme}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-3"
                                >
                                    {theme === 'light' ? (
                                        <MoonIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                    ) : (
                                        <SunIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                                    )}
                                    <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
                                </button>
                                <div className="my-1 border-t border-gray-100 dark:border-gray-700" />
                                <button
                                    onClick={onSignOut}
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                                >
                                    Sign Out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </>
        )}
    </header>
  );
};