

import React, { useState, useMemo } from 'react';
import type { User, Post, Transaction, Dispute, Comment, ActivityLog, Review } from '../types';
import { UserCircleIcon, Cog8ToothIcon, DocumentReportIcon, ShieldExclamationIcon, ChatBubbleBottomCenterTextIcon, ClockIcon, UsersIcon, PencilIcon, StarIcon, HandThumbUpIcon, CurrencyDollarIcon } from '../types';
import { PostListItem } from './PostListItem';
import { CommentItem } from './CommentItem';
import { TransactionsTable } from './TransactionsTable';
import { DisputesTable } from './DisputesTable';
import { UserSettingsForm } from './UserSettingsForm';
import { UserList } from './UserList';
import { UpdateAvatarModal } from './UpdateAvatarModal';
import { VerificationBadge } from './VerificationBadge';
import { ReviewsList } from './ReviewsList';
import { StarRating } from './StarRating';


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
  onAddComment: (postId: string, commentData: { content: string; mediaUrl?: string; mediaType?: 'image' | 'video' }, parentId?: string | null) => void;
  onEditComment?: (postId: string, commentId: string, newContent: string) => void;
  onDeleteComment?: (postId: string, commentId: string) => void;
  onUnfollow: (userId: string) => void;
  onStartChat: (user: User) => void;
  onAddReview: (userId: string, rating: number, comment: string) => void;
  onSelectPost: (post: Post) => void;
  onTogglePinPost: (postId: string) => void;
  onFlagPost: (postId: string) => void;
  onFlagComment: (postId: string, commentId: string) => void;
  onResolvePostFlag: (postId: string) => void;
  onResolveCommentFlag: (postId: string, commentId: string) => void;
  onTogglePostCommentRestriction: (postId: string) => void;
  onLikeComment: (postId: string, commentId: string) => void;
  onDislikeComment: (postId: string, commentId: string) => void;
}

type ProfileTab = 'Activity' | 'Purchases' | 'Sales' | 'Disputes' | 'Followers' | 'Following' | 'Reviews' | 'Activity Log' | 'Settings';

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

const ProfileStat: React.FC<{ value: string | number, label: string, icon: React.ReactNode }> = ({ value, label, icon }) => (
    <div className="flex items-center space-x-2 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg h-full">
        <div className="text-primary dark:text-indigo-400">{icon}</div>
        <div>
            <p className="text-xl font-bold text-text-primary dark:text-dark-text-primary">{value}</p>
            <p className="text-xs text-text-secondary dark:text-dark-text-secondary">{label}</p>
        </div>
    </div>
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
    onAddComment,
    onEditComment,
    onDeleteComment,
    onUnfollow,
    onStartChat,
    onAddReview,
    onSelectPost,
    onTogglePinPost,
    onFlagPost,
    onFlagComment,
    onResolvePostFlag,
    onResolveCommentFlag,
    onTogglePostCommentRestriction,
    onLikeComment,
    onDislikeComment
}) => {
    const [activeTab, setActiveTab] = useState<ProfileTab>('Activity');
    const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

    const handleUpdateAvatar = (avatarUrl: string) => {
        onUpdateSettings(currentUser.id, { avatarUrl });
        setIsAvatarModalOpen(false);
    };
    
    const stats = useMemo(() => {
        const userPosts = allPosts.filter(p => p.author === currentUser.name);
        const totalLikes = userPosts.reduce((sum, post) => sum + post.likedBy.length, 0);
        const totalComments = userPosts.reduce((sum, post) => sum + post.comments.length, 0);
        const avgRating = currentUser.reviews.length > 0 ? currentUser.reviews.reduce((sum, r) => sum + r.rating, 0) / currentUser.reviews.length : 0;
        return { totalLikes, totalComments, avgRating };
      }, [allPosts, currentUser]);

    const userPosts = allPosts.filter(p => p.author === currentUser.name);
    const userComments = allPosts.flatMap(post =>
        post.comments
            .filter(comment => comment.author === currentUser.name)
            .map(comment => ({ ...comment, postTitle: post.title, postAuthor: post.author, postId: post.id }))
    );

    const userActivity = [...userPosts, ...userComments]
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    const userDisputes = allDisputes.filter(d => d.buyer === currentUser.name || d.seller === currentUser.name);

    const followers = users.filter(u => u.followingIds.includes(currentUser.id));
    const following = users.filter(u => currentUser.followingIds.includes(u.id));

    const renderContent = () => {
        switch(activeTab) {
            case 'Activity':
                return userActivity.length > 0 ? (
                    <div className="space-y-6">
                        {userActivity.map(item => {
                            if ('title' in item) { // It's a Post
                                const post = item as Post;
                                const isSold = allTransactions.some(t => t.postId === post.id && t.status === 'Completed');
                                return <PostListItem 
                                    key={`post-${post.id}`} 
                                    post={post} 
                                    isSold={isSold}
                                    users={users} 
                                    currentUser={currentUser} 
                                    categoryName="" 
                                    onSelect={() => onSelectPost(post)} 
                                    onViewProfile={onViewProfile} 
                                    onLike={onLike} 
                                    onDislike={onDislike} 
                                    onTogglePinPost={onTogglePinPost}
                                    onFlagPost={onFlagPost}
                                />
                            } else { // It's a Comment
                                const comment = item as Comment & { postTitle: string; postAuthor: string, postId: string };
                                const post = allPosts.find(p => p.id === comment.postId);
                                if (!post) return null;
                                return (
                                    <div 
                                        key={`comment-${comment.id}`} 
                                        onClick={() => onSelectPost(post)}
                                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelectPost(post); }}
                                        role="button"
                                        tabIndex={0}
                                        className="w-full text-left bg-surface dark:bg-dark-surface p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
                                    >
                                        <p className="text-sm text-text-secondary mb-2">You commented on: <span className="font-semibold">{comment.postTitle}</span> by <span className="font-semibold">{comment.postAuthor}</span></p>
                                        {/* FIX: Corrected props passed to CommentItem to match its definition. Removed 'author' and added 'postId', 'users', 'onAddComment', and correctly named event handlers. */}
                                        <CommentItem
                                            comment={comment}
                                            postId={comment.postId}
                                            users={users}
                                            currentUser={currentUser}
                                            onViewProfile={onViewProfile}
                                            onAddComment={onAddComment}
                                            onEditComment={onEditComment ? onEditComment : () => {}}
                                            onDeleteComment={onDeleteComment ? onDeleteComment : () => {}}
                                            onFlagComment={onFlagComment}
                                            onResolveCommentFlag={onResolveCommentFlag}
                                            onLikeComment={onLikeComment}
                                            onDislikeComment={onDislikeComment}
                                        />
                                    </div>
                                )
                            }
                        })}
                    </div>
                ) : <p className="text-center text-text-secondary py-8">You have no recent activity.</p>;
            case 'Purchases':
                const purchaseTransactions = allTransactions.filter(t => t.buyer === currentUser.name);
                return purchaseTransactions.length > 0 ? (
                    <div className="bg-surface dark:bg-dark-surface rounded-lg shadow p-4 sm:p-6"><TransactionsTable transactions={purchaseTransactions} onSelectTransaction={onSelectTransaction} /></div>
                ) : <p className="text-center text-text-secondary py-8">You have not purchased any items.</p>;
            case 'Sales':
                const salesTransactions = allTransactions.filter(t => t.seller === currentUser.name);
                return salesTransactions.length > 0 ? (
                    <div className="bg-surface dark:bg-dark-surface rounded-lg shadow p-4 sm:p-6"><TransactionsTable transactions={salesTransactions} onSelectTransaction={onSelectTransaction} /></div>
                ) : <p className="text-center text-text-secondary py-8">You have not sold any items.</p>;
            case 'Disputes':
                return userDisputes.length > 0 ? (
                     <div className="bg-surface dark:bg-dark-surface rounded-lg shadow p-4 sm:p-6"><DisputesTable disputes={userDisputes} onDisputeSelect={onDisputeSelect} /></div>
                ) : <p className="text-center text-text-secondary py-8">You have no disputes.</p>;
            case 'Followers':
                 return <UserList users={followers} currentUser={currentUser} onViewProfile={onViewProfile} onStartChat={onStartChat} onUnfollow={onUnfollow} emptyStateMessage="You don't have any followers yet." />;
            case 'Following':
                 return <UserList users={following} currentUser={currentUser} onViewProfile={onViewProfile} onStartChat={onStartChat} onUnfollow={onUnfollow} emptyStateMessage="You are not following anyone yet." />;
            case 'Reviews':
                return <ReviewsList reviews={currentUser.reviews} users={users} />;
            case 'Activity Log':
                return activityLog.length > 0 ? (
                    <div className="bg-surface dark:bg-dark-surface rounded-lg shadow p-4 sm:p-6">
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
            <div className="flex flex-col items-center space-y-4 mb-6">
                 <div className="relative group flex-shrink-0">
                    {currentUser.avatarUrl ? (
                        <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover" />
                    ) : (
                        <UserCircleIcon className="w-24 h-24 text-gray-400" />
                    )}
                    <button 
                        onClick={() => setIsAvatarModalOpen(true)}
                        className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center rounded-full transition-opacity duration-300 text-white opacity-0 group-hover:opacity-100"
                        aria-label="Change profile picture"
                    >
                        <PencilIcon className="w-8 h-8" />
                    </button>
                </div>
                <div className="text-center">
                    <div className="flex items-center justify-center gap-2">
                         <h1 className="text-3xl font-bold text-text-primary dark:text-dark-text-primary">{currentUser.name}</h1>
                         {currentUser.isVerified && <VerificationBadge />}
                    </div>
                    <div className="flex items-center justify-center gap-2 mt-1">
                        <StarRating rating={stats.avgRating} />
                    </div>
                    <p className="text-md text-text-secondary dark:text-dark-text-secondary">@{currentUser.username}</p>
                </div>
                 <div className="w-full max-w-lg grid grid-cols-2 md:grid-cols-3 gap-3 pt-4">
                    <button onClick={() => setActiveTab('Reviews')} className="text-left w-full rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary transition-colors">
                        <ProfileStat value={currentUser.reviews.length} label="Reviews" icon={<StarIcon className="w-6 h-6" />} />
                    </button>
                    <ProfileStat value={stats.totalLikes} label="Likes Received" icon={<HandThumbUpIcon className="w-6 h-6" />} />
                    <button onClick={() => setActiveTab('Activity')} className="text-left w-full rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary transition-colors">
                        <ProfileStat value={stats.totalComments} label="Comments Received" icon={<ChatBubbleBottomCenterTextIcon className="w-6 h-6" />} />
                    </button>
                </div>
            </div>

            <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="flex flex-wrap -mb-px">
                    <TabButton active={activeTab === 'Activity'} onClick={() => setActiveTab('Activity')}>
                        <ChatBubbleBottomCenterTextIcon className="w-5 h-5 mr-2" /> Activity
                    </TabButton>
                     <TabButton active={activeTab === 'Reviews'} onClick={() => setActiveTab('Reviews')}>
                        <StarIcon className="w-5 h-5 mr-2" /> Reviews
                    </TabButton>
                    <TabButton active={activeTab === 'Purchases'} onClick={() => setActiveTab('Purchases')}>
                        <DocumentReportIcon className="w-5 h-5 mr-2" /> Purchases
                    </TabButton>
                     <TabButton active={activeTab === 'Sales'} onClick={() => setActiveTab('Sales')}>
                        <CurrencyDollarIcon className="w-5 h-5 mr-2" /> Sales
                    </TabButton>
                    <TabButton active={activeTab === 'Disputes'} onClick={() => setActiveTab('Disputes')}>
                         <ShieldExclamationIcon className="w-5 h-5 mr-2" /> Disputes
                    </TabButton>
                    <TabButton active={activeTab === 'Followers'} onClick={() => setActiveTab('Followers')}>
                         <UsersIcon className="w-5 h-5 mr-2" /> Followers
                    </TabButton>
                    <TabButton active={activeTab === 'Following'} onClick={() => setActiveTab('Following')}>
                         <UsersIcon className="w-5 h-5 mr-2" /> Following
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
            {isAvatarModalOpen && <UpdateAvatarModal onClose={() => setIsAvatarModalOpen(false)} onSave={handleUpdateAvatar} />}
        </div>
    );
};