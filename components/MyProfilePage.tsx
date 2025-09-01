
import React, { useState } from 'react';
import type { User, Post, Transaction, Dispute, Comment, ActivityLog } from '../types';
import { UserCircleIcon, Cog8ToothIcon, DocumentReportIcon, ShieldExclamationIcon, ChatBubbleBottomCenterTextIcon, ClockIcon } from '../types';
import { PostListItem } from './PostListItem';
import { CommentItem } from './CommentItem';
import { TransactionsTable } from './TransactionsTable';
import { DisputesTable } from './DisputesTable';
import { UserSettingsForm } from './UserSettingsForm';

interface MyProfilePageProps {
  currentUser: User;
  allPosts: Post[];
  allTransactions: Transaction[];
  allDisputes: Dispute[];
  activityLog: ActivityLog[];
  users: User[];
  onDisputeSelect: (dispute: Dispute) => void;
  onSelectTransaction: (transaction: Transaction) => void;
  onUpdateSettings: (userId: string, settingsData: Partial<User>) => void;
  onLike?: (postId: string) => void;
  onDislike?: (postId: string) => void;
  onViewProfile?: (user: User) => void;
  onEditComment?: (postId: string, commentId: string, newContent: string) => void;
  onDeleteComment?: (postId: string, commentId: string) => void;
}

type ProfileTab = 'Activity' | 'Transactions' | 'Disputes' | 'Settings' | 'Activity Log';

const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
    <button
        onClick={onClick}
        className={`flex items-center space-x-2 px-4 py-3 font-semibold text-sm transition-colors ${
            active
                ? 'border-b-2 border-primary text-primary'
                : 'text-text-secondary hover:text-text-primary'
        }`}
    >
        {children}
    </button>
);


export const MyProfilePage: React.FC<MyProfilePageProps> = ({ 
    currentUser, 
    allPosts, 
    allTransactions, 
    allDisputes,
    activityLog, 
    users, 
    onDisputeSelect,
    onSelectTransaction,
    onUpdateSettings,
    onLike = () => {},
    onDislike = () => {},
    onViewProfile = () => {},
    onEditComment,
    onDeleteComment,
}) => {
    const [activeTab, setActiveTab] = useState<ProfileTab>('Activity');
    
    const userPosts = allPosts.filter(p => p.author === currentUser.name);
    const userComments = allPosts.flatMap(post =>
        post.comments
            .filter(comment => comment.author === currentUser.name)
            .map(comment => ({ ...comment, postTitle: post.title, postAuthor: post.author, postId: post.id }))
    );

    const userActivity = [...userPosts, ...userComments]
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    const userTransactions = allTransactions.filter(t => t.buyer === currentUser.name || t.seller === currentUser.name);
    const userDisputes = allDisputes.filter(d => d.buyer === currentUser.name || d.seller === currentUser.name);

    const renderContent = () => {
        switch(activeTab) {
            case 'Activity':
                return userActivity.length > 0 ? (
                    <div className="space-y-6">
                        {userActivity.map(item => {
                            if ('title' in item) { // It's a Post
                                const post = item as Post;
                                return <PostListItem 
                                    key={`post-${post.id}`} 
                                    post={post} 
                                    users={users} 
                                    currentUser={currentUser} 
                                    categoryName="" 
                                    onSelect={() => {}} 
                                    onViewProfile={onViewProfile} 
                                    onLike={onLike} 
                                    onDislike={onDislike} 
                                />
                            } else { // It's a Comment
                                const comment = item as Comment & { postTitle: string; postAuthor: string, postId: string };
                                const author = users.find(u => u.name === comment.author);
                                return (
                                    <div key={`comment-${comment.id}`} className="bg-surface p-4 rounded-lg shadow-sm">
                                        <p className="text-sm text-text-secondary mb-2">You commented on: <span className="font-semibold">{comment.postTitle}</span> by <span className="font-semibold">{comment.postAuthor}</span></p>
                                        <CommentItem 
                                            comment={comment} 
                                            author={author} 
                                            currentUser={currentUser} 
                                            onViewProfile={onViewProfile} 
                                            onEdit={(newContent) => { if (onEditComment) onEditComment(comment.postId, comment.id, newContent); }}
                                            onDelete={() => { if (onDeleteComment) onDeleteComment(comment.postId, comment.id); }} 
                                        />
                                    </div>
                                )
                            }
                        })}
                    </div>
                ) : <p className="text-center text-text-secondary py-8">You have no recent activity.</p>;
            case 'Transactions':
                return userTransactions.length > 0 ? (
                    <div className="bg-surface rounded-lg shadow p-4 sm:p-6"><TransactionsTable transactions={userTransactions} onSelectTransaction={onSelectTransaction} /></div>
                ) : <p className="text-center text-text-secondary py-8">You have no transactions.</p>;
            case 'Disputes':
                return userDisputes.length > 0 ? (
                     <div className="bg-surface rounded-lg shadow p-4 sm:p-6"><DisputesTable disputes={userDisputes} onDisputeSelect={onDisputeSelect} /></div>
                ) : <p className="text-center text-text-secondary py-8">You have no disputes.</p>;
            case 'Activity Log':
                return activityLog.length > 0 ? (
                    <div className="bg-surface rounded-lg shadow p-4 sm:p-6">
                        <ul className="space-y-4">
                            {activityLog.map(log => (
                                <li key={log.id} className="border-b pb-2">
                                    <p className="font-semibold text-text-primary">{log.action}: <span className="font-normal">{log.details}</span></p>
                                    <p className="text-xs text-text-secondary">{new Date(log.timestamp).toLocaleString()}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : <p className="text-center text-text-secondary py-8">Your activity log is empty.</p>;
            case 'Settings':
                return <UserSettingsForm currentUser={currentUser} onUpdateSettings={onUpdateSettings} />;
        }
    }
    
    return (
        <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-6">
                 {currentUser.avatarUrl ? (
                    <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-24 h-24 rounded-full border-4 border-white shadow-lg" />
                ) : (
                    <UserCircleIcon className="w-24 h-24 text-gray-400" />
                )}
                <div>
                    <h1 className="text-3xl font-bold text-text-primary">{currentUser.name}</h1>
                    <p className="text-md text-text-secondary">@{currentUser.username}</p>
                </div>
            </div>

            <div className="border-b border-gray-200">
                <nav className="flex flex-wrap -mb-px">
                    <TabButton active={activeTab === 'Activity'} onClick={() => setActiveTab('Activity')}>
                        <ChatBubbleBottomCenterTextIcon className="w-5 h-5 mr-2" /> Activity
                    </TabButton>
                    <TabButton active={activeTab === 'Transactions'} onClick={() => setActiveTab('Transactions')}>
                        <DocumentReportIcon className="w-5 h-5 mr-2" /> Transactions
                    </TabButton>
                    <TabButton active={activeTab === 'Disputes'} onClick={() => setActiveTab('Disputes')}>
                         <ShieldExclamationIcon className="w-5 h-5 mr-2" /> Disputes
                    </TabButton>
                    <TabButton active={activeTab === 'Activity Log'} onClick={() => setActiveTab('Activity Log')}>
                         <ClockIcon className="w-5 h-5 mr-2" /> Activity Log
                    </TabButton>
                    <TabButton active={activeTab === 'Settings'} onClick={() => setActiveTab('Settings')}>
                        <Cog8ToothIcon className="w-5 h-5 mr-2" /> Settings
                    </TabButton>
                </nav>
            </div>
            
            <div className="mt-6">
                {renderContent()}
            </div>
        </div>
    );
};