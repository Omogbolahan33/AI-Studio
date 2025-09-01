
import React, { useState } from 'react';
import type { User, Post } from '../types';
import { UserCircleIcon, ChatBubbleOvalLeftEllipsisIcon, UserPlusIcon, NoSymbolIcon, StopCircleIcon, CheckCircleIcon } from '../types';
import { PostListItem } from './PostListItem';
import { CommentItem } from './CommentItem';

interface UserProfilePageProps {
  user: User;
  allPosts: Post[];
  users: User[];
  currentUser: User;
  onClose: () => void;
  onStartChat: (user: User) => void;
  onToggleFollow: (userId: string) => void;
  onToggleBlock: (userId: string) => void;
  onToggleActivation: (userId: string) => void;
  onBanUser: (user: User) => void;
  onUnbanUser: (userId: string) => void;
}

const ProfileHeader: React.FC<{ 
    user: User;
    currentUser: User;
    onStartChat: () => void;
    onToggleFollow: () => void;
    onToggleBlock: () => void;
    onToggleActivation: () => void;
    onBanUser: () => void;
    onUnbanUser: () => void;
}> = ({ user, currentUser, onStartChat, onToggleFollow, onToggleBlock, onToggleActivation, onBanUser, onUnbanUser }) => {
    const isCurrentUser = user.id === currentUser.id;
    const isAdmin = currentUser.role === 'Admin';
    const isFollowing = currentUser.followingIds.includes(user.id);
    const isBlocked = currentUser.blockedUserIds.includes(user.id);
    const isBanned = user.banExpiresAt && new Date(user.banExpiresAt) > new Date();

    return (
        <div className="bg-surface p-6 rounded-t-lg shadow-md flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
            {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name} className="w-24 h-24 rounded-full border-4 border-white shadow-lg" />
            ) : (
                <UserCircleIcon className="w-24 h-24 text-gray-400" />
            )}
            <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl font-bold text-text-primary">{user.name}</h2>
                <p className="text-md text-text-secondary">{user.role}</p>
                 {isAdmin && (
                    <div className="mt-2 text-xs font-semibold">
                        <span className={`px-2 py-1 rounded-full ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {user.isActive ? 'Active' : 'Deactivated'}
                        </span>
                        {isBanned && (
                             <span className="ml-2 px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">
                                Banned until {new Date(user.banExpiresAt!).toLocaleDateString()}
                            </span>
                        )}
                    </div>
                 )}
            </div>
            {!isCurrentUser && (
                 <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                    <button 
                        onClick={onStartChat}
                        disabled={isBlocked}
                        className="w-full sm:w-auto flex items-center justify-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        title={isBlocked ? "Unblock user to message" : "Message"}
                    >
                        <ChatBubbleOvalLeftEllipsisIcon className="w-5 h-5" />
                        <span>Message</span>
                    </button>
                    <button 
                        onClick={onToggleFollow}
                        disabled={isBlocked}
                        className={`w-full sm:w-auto flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed ${
                            isFollowing ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-200 text-text-primary hover:bg-gray-300'
                        }`}
                        title={isBlocked ? "Unblock user to follow" : (isFollowing ? "Unfollow" : "Follow")}
                    >
                        <UserPlusIcon className="w-5 h-5" />
                        <span>{isFollowing ? 'Unfollow' : 'Follow'}</span>
                    </button>
                    <button 
                        onClick={onToggleBlock}
                        className={`w-full sm:w-auto flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                            isBlocked ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-red-100 text-red-700 hover:bg-red-200'
                        }`}
                    >
                        <NoSymbolIcon className="w-5 h-5" />
                        <span>{isBlocked ? 'Unblock' : 'Block'}</span>
                    </button>
                </div>
            )}
             {isAdmin && !isCurrentUser && (
                <div className="mt-4 md:mt-0 p-3 bg-gray-100 rounded-lg w-full md:w-auto">
                    <h4 className="text-sm font-bold text-center md:text-left mb-2 text-text-primary">Admin Actions</h4>
                    <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
                         <button 
                            onClick={onToggleActivation}
                            className={`w-full sm:w-auto px-3 py-1.5 text-sm rounded-md transition-colors ${
                                user.isActive ? 'bg-yellow-500 hover:bg-yellow-600 text-white' : 'bg-green-500 hover:bg-green-600 text-white'
                            }`}
                        >
                            {user.isActive ? 'Deactivate' : 'Reactivate'} User
                        </button>
                        {isBanned ? (
                            <button
                                onClick={onUnbanUser}
                                className="w-full sm:w-auto flex items-center justify-center space-x-1 px-3 py-1.5 text-sm rounded-md transition-colors bg-green-600 hover:bg-green-700 text-white"
                            >
                               <CheckCircleIcon className="w-4 h-4" />
                               <span>Unban User</span>
                            </button>
                        ) : (
                            <button 
                                onClick={onBanUser}
                                className="w-full sm:w-auto flex items-center justify-center space-x-1 px-3 py-1.5 text-sm rounded-md transition-colors bg-red-600 hover:bg-red-700 text-white"
                            >
                               <StopCircleIcon className="w-4 h-4" />
                               <span>Ban User</span>
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

type ProfileTab = 'Topics' | 'Adverts' | 'Comments';

const ProfileTabs: React.FC<{ activeTab: ProfileTab; onTabChange: (tab: ProfileTab) => void }> = ({ activeTab, onTabChange }) => (
    <div className="border-b border-gray-200 bg-surface">
        <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
            {(['Topics', 'Adverts', 'Comments'] as ProfileTab[]).map((tab) => (
                <button
                    key={tab}
                    onClick={() => onTabChange(tab)}
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab
                            ? 'border-primary text-primary'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                    {tab}
                </button>
            ))}
        </nav>
    </div>
);


export const UserProfilePage: React.FC<UserProfilePageProps> = ({ user, allPosts, users, currentUser, onClose, onStartChat, onToggleFollow, onToggleBlock, onToggleActivation, onBanUser, onUnbanUser }) => {
  const [activeTab, setActiveTab] = useState<ProfileTab>('Topics');
  
  const userPosts = allPosts.filter(p => p.author === user.name);
  const userTopics = userPosts.filter(p => !p.isAdvert);
  const userAdverts = userPosts.filter(p => p.isAdvert);
  const userComments = allPosts.flatMap(post =>
    post.comments
        .filter(comment => comment.author === user.name)
        .map(comment => ({ ...comment, postTitle: post.title }))
  );

  const renderContent = () => {
      switch(activeTab) {
          case 'Topics':
              return userTopics.length > 0 ? (
                  <div className="space-y-4">
                      {userTopics.map(post => <PostListItem key={post.id} post={post} users={users} currentUser={currentUser} categoryName="" onSelect={() => {}} onViewProfile={() => {}} onLike={() => {}} onDislike={() => {}} />)}
                  </div>
              ) : <p className="text-center text-text-secondary py-8">This user hasn't posted any topics yet.</p>;
          case 'Adverts':
              return userAdverts.length > 0 ? (
                  <div className="space-y-4">
                      {userAdverts.map(post => <PostListItem key={post.id} post={post} users={users} currentUser={currentUser} categoryName="" onSelect={() => {}} onViewProfile={() => {}} onLike={() => {}} onDislike={() => {}} />)}
                  </div>
              ) : <p className="text-center text-text-secondary py-8">This user hasn't posted any adverts yet.</p>;
          case 'Comments':
              return userComments.length > 0 ? (
                  <div className="space-y-4">
                    {userComments.map(comment => (
                      <div key={comment.id} className="bg-surface p-4 rounded-lg shadow-sm">
                        <p className="text-xs text-text-secondary mb-2">Comment on: <span className="font-semibold">{comment.postTitle}</span></p>
                        <CommentItem comment={comment} author={user} currentUser={currentUser} onViewProfile={() => {}} onEdit={() => {}} onDelete={() => {}} />
                      </div>
                    ))}
                  </div>
              ) : <p className="text-center text-text-secondary py-8">This user hasn't commented on any posts yet.</p>;
          default:
              return null;
      }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 backdrop-blur-sm">
        <div className="bg-background rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col relative">
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-white rounded-full p-1 z-10">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            
            <ProfileHeader 
                user={user} 
                currentUser={currentUser}
                onStartChat={() => onStartChat(user)} 
                onToggleFollow={() => onToggleFollow(user.id)}
                onToggleBlock={() => onToggleBlock(user.id)}
                onToggleActivation={() => onToggleActivation(user.id)}
                onBanUser={() => onBanUser(user)}
                onUnbanUser={() => onUnbanUser(user.id)}
            />
            <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

            <div className="p-4 sm:p-6 flex-1 overflow-y-auto">
                {renderContent()}
            </div>
        </div>
    </div>
  );
};