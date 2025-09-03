import React, { useMemo } from 'react';
import type { Post, User } from '../types';
import { HandThumbUpIcon, HandThumbDownIcon, ChatBubbleBottomCenterTextIcon, UserCircleIcon, ArrowUpTrayIcon, PinIcon, FlagIcon } from '../types';
import { VerificationBadge } from './VerificationBadge';
import { StarRating } from './StarRating';

interface PostListItemProps {
  post: Post;
  categoryName: string;
  users: User[];
  currentUser: User;
  onSelect: () => void;
  onViewProfile: (user: User) => void;
  onLike: (postId: string) => void;
  onDislike: (postId: string) => void;
  onTogglePinPost: (postId: string) => void;
  onFlagPost: (postId: string) => void;
}

const ActionButton: React.FC<{
    icon: React.ReactNode;
    label: string;
    count?: number;
    onClick: (e: React.MouseEvent) => void;
    isActive?: boolean;
    disabled?: boolean;
    activeClasses?: string;
}> = ({ icon, label, count, onClick, isActive, disabled, activeClasses = 'bg-primary-light text-primary' }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        title={label}
        className={`flex items-center space-x-2 text-sm font-medium rounded-full px-3 py-1 transition-colors ${
            isActive ? activeClasses : 'text-text-secondary dark:text-dark-text-secondary hover:bg-gray-100 dark:hover:bg-gray-700'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
        {icon}
        {typeof count !== 'undefined' && <span>{count}</span>}
    </button>
);

const timeAgo = (isoDate: string): string => {
    if (!isoDate) return '';
    const date = new Date(isoDate);
    const now = new Date();
    const seconds = Math.round((now.getTime() - date.getTime()) / 1000);

    if (seconds < 5) return "Just now";
    
    const intervals = [
        { label: 'year', seconds: 31536000 },
        { label: 'month', seconds: 2592000 },
        { label: 'day', seconds: 86400 },
        { label: 'hour', seconds: 3600 },
        { label: 'minute', seconds: 60 }
    ];

    for (const interval of intervals) {
        const count = Math.floor(seconds / interval.seconds);
        if (count >= 1) {
            return `${count} ${interval.label}${count !== 1 ? 's' : ''} ago`;
        }
    }
    return "Just now";
};

export const PostListItem: React.FC<PostListItemProps> = ({ post, categoryName, users, currentUser, onSelect, onViewProfile, onLike, onDislike, onTogglePinPost, onFlagPost }) => {
  const author = users.find(u => u.name === post.author);
  const isAuthor = currentUser.name === post.author;
  const hasLiked = post.likedBy.includes(currentUser.id);
  const hasDisliked = post.dislikedBy.includes(currentUser.id);
  const isAdmin = currentUser.role === 'Admin';
  const hasFlagged = post.flaggedBy.includes(currentUser.id);
  
  const isPinned = useMemo(() => {
    if (!post.pinnedAt) return false;
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return new Date(post.pinnedAt) > twentyFourHoursAgo;
  }, [post.pinnedAt]);
  
  const avgRating = useMemo(() => {
    if (!author || !author.reviews || author.reviews.length === 0) return 0;
    const totalRating = author.reviews.reduce((sum, r) => sum + r.rating, 0);
    return totalRating / author.reviews.length;
  }, [author]);
  const reviewCount = author?.reviews?.length || 0;

  const handleAuthorClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (author) {
      onViewProfile(author);
    }
  };
  
  const handleActionClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
  };

  const stripHtml = (html: string) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  }
  
  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}?postId=${post.id}`;
    const textToShare = stripHtml(post.content).substring(0, 200) + '...';

    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: textToShare,
          url: shareUrl,
        });
      } catch (error) {
        if (!(error instanceof DOMException && error.name === 'AbortError')) {
            console.error('Error sharing post:', error);
        }
      }
    } else {
      navigator.clipboard.writeText(shareUrl)
        .then(() => alert('Link to post copied to clipboard!'))
        .catch(err => console.error('Failed to copy link:', err));
    }
  };


  return (
    <div 
        className="bg-surface dark:bg-dark-surface rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden flex flex-col"
    >
        <div className="p-4">
            <div className="flex items-center mb-3">
            <button onClick={handleAuthorClick} className="flex items-center text-left rounded-full focus:outline-none focus:ring-2 focus:ring-primary">
                {author?.avatarUrl ? (
                <img src={author.avatarUrl} alt={author.name} className="w-10 h-10 rounded-full mr-3 object-cover" />
                ) : (
                <UserCircleIcon className="w-10 h-10 text-gray-400 mr-3" />
                )}
                <div>
                    <div className="flex items-center gap-1">
                        <p className="font-bold text-text-primary dark:text-dark-text-primary hover:underline">{post.author}</p>
                        {author?.isVerified && <VerificationBadge />}
                    </div>
                    <p className="text-xs text-text-secondary dark:text-dark-text-secondary">
                      {timeAgo(post.timestamp)}
                      {post.editedTimestamp && <span className="italic"> • Edited</span>}
                    </p>
                    {post.isAdvert && author && reviewCount > 0 && (
                        <div className="flex items-center space-x-1 mt-1">
                            <StarRating rating={avgRating} size="sm" />
                            <span className="text-xs text-text-secondary">({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})</span>
                        </div>
                    )}
                </div>
            </button>
            </div>
            
            <div onClick={onSelect} className="cursor-pointer">
                <div className="flex items-center gap-2 mb-2">
                    {isPinned && (
                        <div className="flex items-center text-xs font-semibold text-yellow-600 dark:text-yellow-400 gap-1">
                            <PinIcon className="w-4 h-4" />
                            <span>PINNED</span>
                        </div>
                    )}
                    {isAdmin && post.flaggedBy.length > 0 && (
                         <div className="flex items-center text-xs font-semibold text-red-600 dark:text-red-400 gap-1">
                            <FlagIcon className="w-4 h-4" />
                            <span>FLAGGED</span>
                        </div>
                    )}
                </div>
                <h3 className="text-xl font-bold text-text-primary dark:text-dark-text-primary mb-2 hover:text-primary transition-colors">{post.title}</h3>
                <span className={`text-xs font-semibold inline-block py-1 px-2.5 uppercase rounded-full mb-3 ${post.isAdvert ? 'text-green-600 bg-green-200 dark:bg-green-900 dark:text-green-300' : 'text-indigo-600 bg-indigo-200 dark:bg-indigo-900 dark:text-indigo-300'}`}>
                    {categoryName}
                </span>
            </div>
        </div>
      
        {post.mediaUrl && (
            <div onClick={onSelect} className="bg-gray-100 dark:bg-gray-800 cursor-pointer h-64 w-full overflow-hidden">
                {post.mediaType === 'image' ? (
                    <img src={post.mediaUrl} alt={post.title} className="w-full h-full object-cover" />
                ) : (
                    <video src={post.mediaUrl} controls className="w-full h-full object-cover" />
                )}
            </div>
        )}

        <div className="p-4 flex-grow flex flex-col">
            <div onClick={onSelect} className="cursor-pointer flex-grow">
                <p className="text-sm text-text-secondary dark:text-dark-text-secondary mt-2 line-clamp-2">
                    {stripHtml(post.content)}
                </p>

                {post.isAdvert && post.price && (
                    <div className="text-2xl font-bold text-secondary text-right mt-4">
                        ₦{post.price.toLocaleString()}
                    </div>
                )}
            </div>
      
            <div className="mt-4 flex items-center justify-between border-t dark:border-gray-700 pt-2">
                 <div className="flex items-center space-x-2">
                    {isAdmin && (
                        <ActionButton
                            icon={<PinIcon className={`w-5 h-5 ${isPinned ? 'text-yellow-600' : ''}`} />}
                            label={isPinned ? 'Unpin' : 'Pin'}
                            onClick={(e) => handleActionClick(e, () => onTogglePinPost(post.id))}
                            isActive={isPinned}
                            activeClasses="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                        />
                    )}
                    {!isAuthor && (
                        <ActionButton
                            icon={<FlagIcon className="w-5 h-5" />}
                            label={hasFlagged ? 'Flagged' : 'Flag'}
                            onClick={(e) => handleActionClick(e, () => onFlagPost(post.id))}
                            isActive={hasFlagged}
                            disabled={hasFlagged}
                            activeClasses="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                        />
                    )}
                </div>
                <div className="flex items-center space-x-2">
                    <ActionButton
                        icon={<ChatBubbleBottomCenterTextIcon className="w-5 h-5" />}
                        label="Comments"
                        count={post.comments.length}
                        onClick={(e) => handleActionClick(e, onSelect)}
                    />
                    <ActionButton
                        icon={<HandThumbUpIcon className="w-5 h-5" />}
                        label="Like"
                        count={post.likedBy.length}
                        onClick={(e) => handleActionClick(e, () => onLike(post.id))}
                        isActive={hasLiked}
                        disabled={isAuthor}
                    />
                    <ActionButton
                        icon={<HandThumbDownIcon className="w-5 h-5" />}
                        label="Dislike"
                        count={post.dislikedBy.length}
                        onClick={(e) => handleActionClick(e, () => onDislike(post.id))}
                        isActive={hasDisliked}
                        disabled={isAuthor}
                    />
                    <ActionButton
                        icon={<ArrowUpTrayIcon className="w-5 h-5" />}
                        label="Share"
                        onClick={handleShare}
                    />
                </div>
            </div>
        </div>
    </div>
  );
};