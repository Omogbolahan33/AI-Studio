



import React, { useState, useMemo } from 'react';
import type { User, Post, Review, UserRole } from '../types';
import { UserCircleIcon, ChatBubbleOvalLeftEllipsisIcon, UserPlusIcon, NoSymbolIcon, StopCircleIcon, CheckCircleIcon, StarIcon, HandThumbUpIcon, ChatBubbleBottomCenterTextIcon, UserMinusIcon, ArrowUpIcon, ArrowDownIcon } from '../types';
import { PostListItem } from './PostListItem';
import { CommentItem } from './CommentItem';
import { UserList } from './UserList';
import { VerificationBadge } from './VerificationBadge';
import { StarRating } from './StarRating';
import { ReviewModal } from './ReviewModal';
import { ReviewsList } from './ReviewsList';


interface UserProfilePageProps {
  user: User;
  allPosts: Post[];
  users: User[];
  currentUser: User;
  onClose: () => void;
  onStartChat: (user: User) => void;
  onRequestFollow: (userId: string) => void;
  onUnfollow: (userId: string) => void;
  onCancelFollowRequest: (userId: string) => void;
  onToggleBlock: (userId: string) => void;
  onToggleActivation: (userId: string) => void;
  onBanUser: (user: User) => void;
  onUnbanUser: (userId: string) => void;
  onViewProfile: (user: User) => void;
  onLike: (postId: string) => void;
  onDislike: (postId: string) => void;
  onAddReview: (userId: string, rating: number, comment: string) => void;
  onSelectPost: (post: Post) => void;
  onTogglePinPost: (postId: string) => void;
  onFlagPost: (postId: string) => void;
  onFlagComment: (postId: string, commentId: string) => void;
  onResolvePostFlag: (postId: string) => void;
  onResolveCommentFlag: (postId: string, commentId: string) => void;
  onEditComment: (postId: string, commentId: string, newContent: string) => void;
  onDeleteComment: (postId: string, commentId: string) => void;
  onSetUserRole: (userId: string, newRole: UserRole) => void;
}

const ProfileStat: React.FC<{ value: string | number, label: string, icon: React.ReactNode }> = ({ value, label, icon }) => (
    <div className="flex items-center space-x-2 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg h-full">
        <div className="text-primary dark:text-indigo-400">{icon}</div>
        <div>
            <p className="text-xl font-bold text-text-primary dark:text-dark-text-primary">{value}</p>
            <p className="text-xs text-text-secondary dark:text-dark-text-secondary">{label}</p>
        </div>
    </div>
);

type ProfileTab = 'Topics' | 'Adverts' | 'Comments' | 'Followers' | 'Following' | 'Reviews';

interface ProfileHeaderProps {
    user: User;
    currentUser: User;
    stats: { avgRating: number; totalLikes: number; totalComments: number; };
    onStartChat: () => void;
    onRequestFollow: () => void;
    onUnfollow: () => void;
    onCancelFollowRequest: () => void;
    onToggleBlock: () => void;
    onToggleActivation: () => void;
    onBanUser: () => void;
    onUnbanUser: () => void;
    onRateUser: () => void;
    onSelectTab: (tab: ProfileTab) => void;
    onSetUserRole: (newRole: UserRole) => void;
}


const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user, currentUser, stats, onStartChat, onRequestFollow, onUnfollow, onCancelFollowRequest, onToggleBlock, onToggleActivation, onBanUser, onUnbanUser, onRateUser, onSelectTab, onSetUserRole }) => {
    const isCurrentUser = user.id === currentUser.id;
    const isFollowing = currentUser.followingIds.includes(user.id);
    const isFollowPending = user.pendingFollowerIds.includes(currentUser.id);
    const isBlocked = currentUser.blockedUserIds.includes(user.id);
    const isBanned = user.banExpiresAt && new Date(user.banExpiresAt) > new Date();
    
    const isSuperAdmin = currentUser.role === 'Super Admin';
    const isAdmin = currentUser.role === 'Admin';
    
    const canTakeAction = 
        (isSuperAdmin && !isCurrentUser) || 
        (isAdmin && !isCurrentUser && user.role === 'Member');

    return (
        <div className="bg-surface dark:bg-dark-surface p-6 rounded-t-lg shadow-md flex flex-col items-center space-y-4">
            <div className="flex flex-col md:flex-row items-center w-full gap-6">
                {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.name} className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover" />
                ) : (
                    <UserCircleIcon className="w-24 h-24 text-gray-400" />
                )}
                <div className="flex-1 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-2">
                        <h2 className="text-3xl font-bold text-text-primary dark:text-dark-text-primary">{user.name}</h2>
                        {user.isVerified && <VerificationBadge />}
                    </div>
                     <div className="flex items-center justify-center md:justify-start gap-2 mt-1">
                        <StarRating rating={stats.avgRating} />
                    </div>
                    <p className="text-md text-text-secondary dark:text-dark-text-secondary">@{user.username}</p>
                     {(isAdmin || isSuperAdmin) && (
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
            </div>
            
             <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-3 pt-4">
                <button onClick={() => onSelectTab('Reviews')} className="text-left w-full rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary transition-colors">
                    <ProfileStat value={user.reviews.length} label="Reviews" icon={<StarIcon className="w-6 h-6" />} />
                </button>
                <ProfileStat value={stats.totalLikes} label="Likes Received" icon={<HandThumbUpIcon className="w-6 h-6" />} />
                <button onClick={() => onSelectTab('Comments')} className="text-left w-full rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary transition-colors">
                    <ProfileStat value={stats.totalComments} label="Comments Received" icon={<ChatBubbleBottomCenterTextIcon className="w-6 h-6" />} />
                </button>
            </div>

            {!isCurrentUser && (
                 <div className="w-full pt-4 flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-2">
                    { isFollowing ? (
                         <button onClick={onUnfollow} className="w-full sm:w-auto flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-colors bg-gray-200 text-text-primary hover:bg-gray-300">
                            <span>Following</span>
                         </button>
                    ) : isFollowPending ? (
                        <button 
                            onClick={onCancelFollowRequest}
                            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-colors bg-gray-200 text-text-primary hover:bg-gray-300"
                            title="Cancel follow request"
                        >
                            <UserMinusIcon className="w-5 h-5" />
                            <span>Pending</span>
                        </button>
                    ) : (
                        <button 
                            onClick={onRequestFollow}
                            disabled={isBlocked}
                            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed bg-blue-500 text-white hover:bg-blue-600"
                            title={isBlocked ? "Unblock user to follow" : "Follow"}
                        >
                            <UserPlusIcon className="w-5 h-5" />
                            <span>Follow</span>
                        </button>
                    )}
                    <button onClick={onStartChat} disabled={isBlocked} className="w-full sm:w-auto flex items-center justify-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
                        <ChatBubbleOvalLeftEllipsisIcon className="w-5 h-5" />
                        <span>Message</span>
                    </button>
                    <button onClick={onRateUser} className="w-full sm:w-auto flex items-center justify-center space-x-2 px-4 py-2 bg-yellow-400 text-yellow-900 rounded-lg hover:bg-yellow-500 transition-colors">
                        <StarIcon className="w-5 h-5" />
                        <span>Rate User</span>
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
             {canTakeAction && (
                <div className="mt-2 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg w-full">
                    <h4 className="text-sm font-bold text-center md:text-left mb-2 text-text-primary dark:text-dark-text-primary">Admin Actions</h4>
                    <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-2">
                         <button 
                            onClick={onToggleActivation}
                            className={`w-full sm:w-auto px-3 py-1.5 text-sm rounded-md transition-colors ${
                                user.isActive ? 'bg-yellow-500 hover:bg-yellow-600 text-white' : 'bg-green-500 hover:bg-green-600 text-white'
                            }`}
                        >
                            {user.isActive ? 'Deactivate' : 'Reactivate'} User
                        </button>
                        {isBanned ? (
                            <button onClick={onUnbanUser} className="w-full sm:w-auto flex items-center justify-center space-x-1 px-3 py-1.5 text-sm rounded-md transition-colors bg-green-600 hover:bg-green-700 text-white">
                               <CheckCircleIcon className="w-4 h-4" />
                               <span>Unban User</span>
                            </button>
                        ) : (
                            <button onClick={onBanUser} className="w-full sm:w-auto flex items-center justify-center space-x-1 px-3 py-1.5 text-sm rounded-md transition-colors bg-red-600 hover:bg-red-700 text-white">
                               <StopCircleIcon className="w-4 h-4" />
                               <span>Ban User</span>
                            </button>
                        )}
                        {isSuperAdmin && user.role !== 'Super Admin' && (
                            <>
                                {user.role === 'Member' && (
                                    <button onClick={() => onSetUserRole('Admin')} className="w-full sm:w-auto flex items-center justify-center space-x-1 px-3 py-1.5 text-sm rounded-md transition-colors bg-indigo-500 hover:bg-indigo-600 text-white">
                                        <ArrowUpIcon className="w-4 h-4"/>
                                        <span>Promote to Admin</span>
                                    </button>
                                )}
                                {user.role === 'Admin' && (
                                    <button onClick={() => onSetUserRole('Member')} className="w-full sm:w-auto flex items-center justify-center space-x-1 px-3 py-1.5 text-sm rounded-md transition-colors bg-gray-500 hover:bg-gray-600 text-white">
                                        <ArrowDownIcon className="w-4 h-4"/>
                                        <span>Demote to Member</span>
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};


const ProfileTabs: React.FC<{ activeTab: ProfileTab; onTabChange: (tab: ProfileTab) => void }> = ({ activeTab, onTabChange }) => (
    <div className="border-b border-gray-200 dark:border-gray-700 bg-surface dark:bg-dark-surface sticky top-0 z-10">
        <nav className="-mb-px flex space-x-8 px-6 overflow-x-auto" aria-label="Tabs">
            {(['Topics', 'Adverts', 'Reviews', 'Comments', 'Followers', 'Following'] as ProfileTab[]).map((tab) => (
                <button
                    key={tab}
                    onClick={() => onTabChange(tab)}
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab
                            ? 'border-primary text-primary dark:text-indigo-400 dark:border-indigo-400'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-300 dark:hover:border-gray-500'
                    }`}
                >
                    {tab}
                </button>
            ))}
        </nav>
    </div>
);


export const UserProfilePage: React.FC<UserProfilePageProps> = ({ user, allPosts, users, currentUser, onClose, onStartChat, onRequestFollow, onUnfollow, onCancelFollowRequest, onToggleBlock, onToggleActivation, onBanUser, onUnbanUser, onViewProfile, onLike, onDislike, onAddReview, onSelectPost, onTogglePinPost, onFlagPost, onFlagComment, onResolvePostFlag, onResolveCommentFlag, onEditComment, onDeleteComment, onSetUserRole }) => {
  const [activeTab, setActiveTab] = useState<ProfileTab>('Topics');
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  
  const stats = useMemo(() => {
    const userPosts = allPosts.filter(p => p.author === user.name);
    const totalLikes = userPosts.reduce((sum, post) => sum + post.likedBy.length, 0);
    const totalComments = userPosts.reduce((sum, post) => sum + post.comments.length, 0);
    const avgRating = user.reviews.length > 0 ? user.reviews.reduce((sum, r) => sum + r.rating, 0) / user.reviews.length : 0;
    return { totalLikes, totalComments, avgRating };
  }, [allPosts, user]);
  
  const userPosts = useMemo(() => allPosts.filter(p => p.author === user.name), [allPosts, user.name]);
  const userTopics = useMemo(() => userPosts.filter(p => !p.isAdvert), [userPosts]);
  const userAdverts = useMemo(() => userPosts.filter(p => p.isAdvert), [userPosts]);
  const userComments = useMemo(() => allPosts.flatMap(post =>
    post.comments
        .filter(comment => comment.author === user.name)
        .map(comment => ({ ...comment, postTitle: post.title, postId: post.id }))
  ), [allPosts, user.name]);

  const followers = useMemo(() => users.filter(u => u.followingIds.includes(user.id)), [users, user.id]);
  const following = useMemo(() => users.filter(u => user.followingIds.includes(u.id)), [users, user.followingIds]);

  const handleAddReviewSubmit = (rating: number, comment: string) => {
      onAddReview(user.id, rating, comment);
      setIsReviewModalOpen(false);
  }

  const renderContent = () => {
      switch(activeTab) {
          case 'Topics':
              return userTopics.length > 0 ? (
                  <div className="space-y-4">
                      {userTopics.map(post => <PostListItem key={post.id} post={post} users={users} currentUser={currentUser} categoryName="" onSelect={() => onSelectPost(post)} onViewProfile={onViewProfile} onLike={onLike} onDislike={onDislike} onTogglePinPost={onTogglePinPost} onFlagPost={onFlagPost} />)}
                  </div>
              ) : <p className="text-center text-text-secondary py-8">This user hasn't posted any topics yet.</p>;
          case 'Adverts':
              return userAdverts.length > 0 ? (
                  <div className="space-y-4">
                      {userAdverts.map(post => <PostListItem key={post.id} post={post} users={users} currentUser={currentUser} categoryName="" onSelect={() => onSelectPost(post)} onViewProfile={onViewProfile} onLike={onLike} onDislike={onDislike} onTogglePinPost={onTogglePinPost} onFlagPost={onFlagPost} />)}
                  </div>
              ) : <p className="text-center text-text-secondary py-8">This user hasn't posted any adverts yet.</p>;
          case 'Reviews':
              return <ReviewsList reviews={user.reviews} users={users} />;
          case 'Comments':
              return userComments.length > 0 ? (
                  <div className="space-y-4">
                    {userComments.map(comment => {
                      const post = allPosts.find(p => p.id === comment.postId);
                      if (!post) return null;
                      return (
                        <div
                          key={comment.id}
                          onClick={() => onSelectPost(post)}
                          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelectPost(post); }}
                          role="button"
                          tabIndex={0}
                          className="w-full text-left bg-surface dark:bg-dark-surface p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <p className="text-xs text-text-secondary dark:text-dark-text-secondary mb-2">Comment on: <span className="font-semibold">{comment.postTitle}</span></p>
                          <CommentItem comment={comment} author={user} currentUser={currentUser} onViewProfile={onViewProfile} onEdit={(newContent) => onEditComment(comment.postId, comment.id, newContent)} onDelete={() => onDeleteComment(comment.postId, comment.id)} onFlag={() => onFlagComment(comment.postId, comment.id)} onResolve={() => onResolveCommentFlag(comment.postId, comment.id)} />
                        </div>
                      );
                    })}
                  </div>
              ) : <p className="text-center text-text-secondary py-8">This user hasn't commented on any posts yet.</p>;
          case 'Followers':
               return <UserList users={followers} currentUser={currentUser} onViewProfile={onViewProfile} onStartChat={onStartChat} onUnfollow={onUnfollow} emptyStateMessage={`${user.name} doesn't have any followers yet.`} />;
          case 'Following':
               return <UserList users={following} currentUser={currentUser} onViewProfile={onViewProfile} onStartChat={onStartChat} onUnfollow={onUnfollow} emptyStateMessage={`${user.name} is not following anyone yet.`} />;
          default:
              return null;
      }
  }

  return (
    <>
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 backdrop-blur-sm">
            <div className="bg-background dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-white dark:bg-gray-700 rounded-full p-1 z-20">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                
                <ProfileHeader 
                    user={user} 
                    currentUser={currentUser}
                    stats={stats}
                    onStartChat={() => onStartChat(user)} 
                    onRequestFollow={() => onRequestFollow(user.id)}
                    onUnfollow={() => onUnfollow(user.id)}
                    onCancelFollowRequest={() => onCancelFollowRequest(user.id)}
                    onToggleBlock={() => onToggleBlock(user.id)}
                    onToggleActivation={() => onToggleActivation(user.id)}
                    onBanUser={() => onBanUser(user)}
                    onUnbanUser={() => onUnbanUser(user.id)}
                    onRateUser={() => setIsReviewModalOpen(true)}
                    onSelectTab={setActiveTab}
                    onSetUserRole={(newRole) => onSetUserRole(user.id, newRole)}
                />
                <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

                <div className="p-4 sm:p-6 flex-1 overflow-y-auto bg-gray-50 dark:bg-dark-background">
                    {renderContent()}
                </div>
            </div>
        </div>
        {isReviewModalOpen && <ReviewModal userToReview={user} onClose={() => setIsReviewModalOpen(false)} onSubmit={handleAddReviewSubmit} />}
    </>
  );
};