
import React, { useState, useMemo } from 'react';
import type { User, Post, Transaction, Dispute, Comment, ActivityLog, Review } from '../types';
import { UserCircleIcon, Cog8ToothIcon, DocumentReportIcon, ShieldExclamationIcon, ChatBubbleBottomCenterTextIcon, ClockIcon, UsersIcon, PencilIcon, StarIcon, HandThumbUpIcon, CurrencyDollarIcon, MagnifyingGlassIcon, ArrowDownIcon, ArrowUpIcon } from '../types';
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
  onDeactivateAccount: () => void;
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
  onToggleSoldStatus: (postId: string) => void;
}

type ProfileTab = 'Activity' | 'Transactions' | 'Disputes' | 'Followers' | 'Following' | 'Reviews' | 'Activity Log' | 'Settings';

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
    onDeactivateAccount,
    onLike = () => {},
    onDislike = () => {},
    onViewProfile = () => {},
    onAddComment,
    onEditComment = () => {},
    onDeleteComment = () => {},
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
    onDislikeComment,
    onToggleSoldStatus
}) => {
    const [activeTab, setActiveTab] = useState<ProfileTab>('Activity');
    const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
    const [transactionSearchTerm, setTransactionSearchTerm] = useState('');
    const [transactionFilter, setTransactionFilter] = useState<'all' | 'purchases' | 'sales'>('all');
    const [transactionSort, setTransactionSort] = useState<'newest' | 'oldest'>('newest');

    const handleUpdateAvatar = (avatarUrl: string) => {
        onUpdateSettings(currentUser.id, { avatarUrl });
        setIsAvatarModalOpen(false);
    };

    const displayedTransactions = useMemo(() => {
        let transactions: Transaction[] = [];
        if (transactionFilter === 'purchases') {
            transactions = allTransactions.filter(t => t.buyer === currentUser.name);
        } else if (transactionFilter === 'sales') {
            transactions = allTransactions.filter(t => t.seller === currentUser.name);
        } else {
            transactions = allTransactions.filter(t => t.buyer === currentUser.name || t.seller === currentUser.name);
        }

        if (transactionSearchTerm) {
            const lowercasedTerm = transactionSearchTerm.toLowerCase();
            transactions = transactions.filter(t =>
                t.item.toLowerCase().includes(lowercasedTerm) ||
                t.id.toLowerCase().includes(lowercasedTerm) ||
                t.buyer.toLowerCase().includes(lowercasedTerm) ||
                t.seller.toLowerCase().includes(lowercasedTerm)
            );
        }

        return [...transactions].sort((a, b) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            return transactionSort === 'newest' ? dateB - dateA : dateA - dateB;
        });
    }, [allTransactions, currentUser.name, transactionFilter, transactionSearchTerm, transactionSort]);
    
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
                                return <PostListItem 
                                    key={`post-${post.id}`} 
                                    post={post} 
                                    isSold={post.isSold}
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
                                        <p className="text-sm text-text-secondary dark:text-dark-text-secondary mb-2">You commented on: <span className="font-semibold">{comment.postTitle}</span></p>
                                        <CommentItem 
                                            comment={comment}
                                            postId={comment.postId}
                                            currentUser={currentUser}
                                            users={users}
                                            onViewProfile={onViewProfile}
                                            onAddComment={onAddComment}
                                            onEditComment={onEditComment}
                                            onDeleteComment={onDeleteComment}
                                            onStartReply={() => onSelectPost(post)}
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
            case 'Transactions':
                return (
                    <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row gap-4 items-center p-4 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                             <div className="relative w-full sm:flex-1">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="search"
                                    placeholder="Search by item, ID, or user..."
                                    value={transactionSearchTerm}
                                    onChange={(e) => setTransactionSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2 w-full border dark:border-gray-600 rounded-lg bg-surface dark:bg-dark-surface dark:text-dark-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>
                            <div className="flex items-center gap-2 w-full sm:w-auto">
                                <select value={transactionFilter} onChange={(e) => setTransactionFilter(e.target.value as any)} className="py-2 px-3 w-full sm:w-auto border rounded-lg bg-surface dark:bg-dark-surface focus:outline-none focus:ring-2 focus:ring-primary text-sm">
                                    <option value="all">All</option>
                                    <option value="purchases">Purchases</option>
                                    <option value="sales">Sales</option>
                                </select>
                                <select value={transactionSort} onChange={(e) => setTransactionSort(e.target.value as any)} className="py-2 px-3 w-full sm:w-auto border rounded-lg bg-surface dark:bg-dark-surface focus:outline-none focus:ring-2 focus:ring-primary text-sm">
                                    <option value="newest">Newest</option>
                                    <option value="oldest">Oldest</option>
                                </select>
                            </div>
                        </div>
                         {displayedTransactions.length > 0 ? (
                            <TransactionsTable transactions={displayedTransactions} onSelectTransaction={onSelectTransaction} />
                         ) : <p className="text-center text-text-secondary py-8">You have no transactions that match your criteria.</p>}
                    </div>
                )
            case 'Disputes':
                return userDisputes.length > 0 ? (
                    <DisputesTable disputes={userDisputes} onDisputeSelect={onDisputeSelect} />
                ) : <p className="text-center text-text-secondary py-8">You have no disputes.</p>;
            case 'Followers':
                return <UserList users={followers} currentUser={currentUser} onViewProfile={onViewProfile} onStartChat={onStartChat} onUnfollow={onUnfollow} emptyStateMessage="You don't have any followers yet." />;
            case 'Following':
                 return <UserList users={following} currentUser={currentUser} onViewProfile={onViewProfile} onStartChat={onStartChat} onUnfollow={onUnfollow} emptyStateMessage="You aren't following anyone yet." />;
            case 'Reviews':
                return <ReviewsList reviews={currentUser.reviews} users={users} />;
            case 'Activity Log':
                return activityLog.length > 0 ? (
                    <div className="space-y-3">
                        {activityLog.map(log => (
                            <div key={log.id} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg flex items-center space-x-3 text-sm">
                                <ClockIcon className="w-5 h-5 text-text-secondary flex-shrink-0"/>
                                <div>
                                    <span className="font-semibold">{log.action}:</span>
                                    <span className="text-text-secondary ml-1">{log.details}</span>
                                </div>
                                <span className="text-xs text-text-secondary ml-auto flex-shrink-0">{new Date(log.timestamp).toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                ) : <p className="text-center text-text-secondary py-8">No activity to show.</p>;
            case 'Settings':
                return <UserSettingsForm currentUser={currentUser} onUpdateSettings={onUpdateSettings} onDeactivateAccount={onDeactivateAccount} />;
            default:
                return null;
        }
    }

    return (
        <div className="max-w-7xl mx-auto">
            {isAvatarModalOpen && <UpdateAvatarModal onClose={() => setIsAvatarModalOpen(false)} onSave={handleUpdateAvatar} />}
            <div className="bg-surface dark:bg-dark-surface p-6 rounded-lg shadow-md mb-6">
                <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
                    <div className="relative group flex-shrink-0">
                        {currentUser.avatarUrl ? (
                            <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 shadow-lg object-cover" />
                        ) : (
                            <UserCircleIcon className="w-24 h-24 text-gray-400" />
                        )}
                        <button onClick={() => setIsAvatarModalOpen(true)} className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center rounded-full transition-opacity">
                             <PencilIcon className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity"/>
                        </button>
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-2">
                            <h1 className="text-3xl font-bold text-text-primary dark:text-dark-text-primary">{currentUser.name}</h1>
                            {currentUser.isVerified ? <VerificationBadge /> : null}
                        </div>
                        <div className="flex items-center justify-center md:justify-start gap-2 mt-1">
                            <StarRating rating={stats.avgRating} />
                            {currentUser.reviews.length > 0 && (
                                <span className="text-sm text-text-secondary dark:text-dark-text-secondary">({currentUser.reviews.length} reviews)</span>
                            )}
                        </div>
                        <p className="text-md text-text-secondary dark:text-dark-text-secondary">@{currentUser.username}</p>
                    </div>
                </div>
                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button onClick={() => setActiveTab('Reviews')} className="text-left w-full rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary transition-colors">
                        <ProfileStat value={currentUser.reviews.length} label="Reviews" icon={<StarIcon className="w-6 h-6" />} />
                    </button>
                    <ProfileStat value={userPosts.length} label="Total Posts" icon={<DocumentReportIcon className="w-6 h-6" />} />
                    <button onClick={() => setActiveTab('Followers')} className="text-left w-full rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary transition-colors">
                        <ProfileStat value={followers.length} label="Followers" icon={<UsersIcon className="w-6 h-6" />} />
                    </button>
                    <ProfileStat value={allTransactions.filter(t => t.seller === currentUser.name && t.status === 'Completed').length} label="Items Sold" icon={<CurrencyDollarIcon className="w-6 h-6" />} />
                </div>
            </div>
            
            <div className="bg-surface dark:bg-dark-surface rounded-lg shadow-md">
                 <div className="border-b border-gray-200 dark:border-gray-700">
                    <nav className="flex flex-wrap -mb-px px-4 sm:px-6">
                        <TabButton active={activeTab === 'Activity'} onClick={() => setActiveTab('Activity')}><ChatBubbleBottomCenterTextIcon className="w-5 h-5"/><span>Activity</span></TabButton>
                        <TabButton active={activeTab === 'Transactions'} onClick={() => setActiveTab('Transactions')}><DocumentReportIcon className="w-5 h-5"/><span>Transactions</span></TabButton>
                        <TabButton active={activeTab === 'Disputes'} onClick={() => setActiveTab('Disputes')}><ShieldExclamationIcon className="w-5 h-5"/><span>Disputes</span></TabButton>
                        <TabButton active={activeTab === 'Reviews'} onClick={() => setActiveTab('Reviews')}><StarIcon className="w-5 h-5"/><span>Reviews</span></TabButton>
                        <TabButton active={activeTab === 'Followers'} onClick={() => setActiveTab('Followers')}><UsersIcon className="w-5 h-5"/><span>Followers</span></TabButton>
                        <TabButton active={activeTab === 'Following'} onClick={() => setActiveTab('Following')}><UsersIcon className="w-5 h-5"/><span>Following</span></TabButton>
                        <TabButton active={activeTab === 'Activity Log'} onClick={() => setActiveTab('Activity Log')}><ClockIcon className="w-5 h-5"/><span>Activity Log</span></TabButton>
                        <TabButton active={activeTab === 'Settings'} onClick={() => setActiveTab('Settings')}><Cog8ToothIcon className="w-5 h-5"/><span>Settings</span></TabButton>
                    </nav>
                </div>
                <div className="p-4 sm:p-6">
                    {renderContent()}
                </div>
            </div>

        </div>
    );
};
