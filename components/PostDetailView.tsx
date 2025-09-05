


import React, { useMemo, useState, useRef } from 'react';
import type { Post, User, Comment } from '../types';
import { HandThumbUpIcon, HandThumbDownIcon, UserCircleIcon, PencilIcon, TrashIcon, ArrowUpTrayIcon, PinIcon, FlagIcon, ShieldCheckIcon, LockClosedIcon, LockOpenIcon } from '../types';
import { CommentForm } from './CommentForm';
import { CommentItem } from './CommentItem';
import { VerificationBadge } from './VerificationBadge';

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

interface PostDetailViewProps {
  post: Post;
  currentUser: User;
  users: User[];
  onBack: () => void;
  onInitiatePurchase: (post: Post) => void;
  onStartChat: (post: Post) => void;
  onEditPost: (post: Post) => void;
  onDeletePost: (postId: string) => void;
  onLike: (postId: string) => void;
  onDislike: (postId: string) => void;
  onAddComment: (postId: string, commentData: { content: string; mediaUrl?: string; mediaType?: 'image' | 'video'; }, parentId: string | null) => void;
  onEditComment: (postId: string, commentId: string, newContent: string) => void;
  onDeleteComment: (postId: string, commentId: string) => void;
  onViewProfile: (user: User) => void;
  onTogglePinPost: (postId: string) => void;
  onFlagPost: (postId: string) => void;
  onFlagComment: (postId: string, commentId: string) => void;
  onResolvePostFlag: (postId: string) => void;
  onResolveCommentFlag: (postId: string, commentId: string) => void;
  onTogglePostCommentRestriction: (postId: string) => void;
  onLikeComment: (postId: string, commentId: string) => void;
  onDislikeComment: (postId: string, commentId: string) => void;
  isSold?: boolean;
}

export const PostDetailView: React.FC<PostDetailViewProps> = ({ post, currentUser, users, onBack, onInitiatePurchase, onStartChat, onEditPost, onDeletePost, onLike, onDislike, onAddComment, onEditComment, onDeleteComment, onViewProfile, onTogglePinPost, onFlagPost, onFlagComment, onResolvePostFlag, onResolveCommentFlag, isSold, onTogglePostCommentRestriction, onLikeComment, onDislikeComment }) => {
  const [replyingTo, setReplyingTo] = useState<Comment | null>(null);
  const mainCommentFormRef = useRef<HTMLDivElement>(null);

  const isAuthor = currentUser.name === post.author;
  const author = users.find(u => u.name === post.author);
  const hasLiked = post.likedBy.includes(currentUser.id);
  const hasDisliked = post.dislikedBy.includes(currentUser.id);
  const isAdmin = currentUser.role === 'Admin' || currentUser.role === 'Super Admin';
  const hasFlagged = post.flaggedBy.includes(currentUser.id);
  
  const isPinned = useMemo(() => {
    if (!post.pinnedAt) return false;
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return new Date(post.pinnedAt) > twentyFourHoursAgo;
  }, [post.pinnedAt]);

  const stripHtml = (html: string) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  };
  
  const handleShare = async () => {
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
  
  const isCommentingDisabled = post.isCommentingRestricted && currentUser.role === 'Member';

  const handleStartReply = (comment: Comment) => {
    setReplyingTo(comment);
    mainCommentFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };
  
  return (
    <div>
        <button onClick={onBack} className="mb-6 text-primary font-semibold hover:underline">
            &larr; Back to Posts
        </button>

        <div className="bg-surface dark:bg-dark-surface rounded-lg shadow-lg overflow-hidden">
             {isAdmin && post.flaggedBy.length > 0 && (
                <div className="p-4 bg-yellow-100 dark:bg-yellow-900/50 border-b-2 border-yellow-300 dark:border-yellow-700 flex justify-between items-center">
                    <div>
                        <p className="font-bold text-yellow-800 dark:text-yellow-200 flex items-center gap-2">
                            <FlagIcon className="w-5 h-5"/>
                            This post has been flagged by {post.flaggedBy.length} user(s).
                        </p>
                    </div>
                    <button onClick={() => onResolvePostFlag(post.id)} className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                        <ShieldCheckIcon className="w-4 h-4" />
                        Dismiss Flag
                    </button>
                </div>
            )}
            
            {post.mediaUrl && (
                <div className="w-full h-96 bg-gray-200 dark:bg-gray-800">
                    {post.mediaType === 'image' ? (
                        <img src={post.mediaUrl} alt={post.title} className="w-full h-full object-contain" />
                    ) : (
                        <video src={post.mediaUrl} controls className="w-full h-full object-contain" />
                    )}
                </div>
            )}
            
            <div className="p-6">
                 {isPinned && (
                    <div className="flex items-center text-sm font-semibold text-yellow-600 dark:text-yellow-400 gap-1 mb-2">
                        <PinIcon className="w-4 h-4" />
                        <span>PINNED POST</span>
                    </div>
                )}
                <h1 className="text-3xl font-bold text-text-primary dark:text-dark-text-primary mb-4">{post.title}</h1>
                
                <div className="flex items-center justify-between mb-6">
                    <button onClick={() => author && onViewProfile(author)} className="flex items-center space-x-3 group">
                        {author?.avatarUrl ? (
                            <img src={author.avatarUrl} alt={author.name} className="w-12 h-12 rounded-full object-cover" />
                        ) : (
                            <UserCircleIcon className="w-12 h-12 text-gray-400" />
                        )}
                        <div>
                            <div className="flex items-center gap-1">
                                <p className="font-bold text-text-primary dark:text-dark-text-primary group-hover:underline">{post.author}</p>
                                {author?.isVerified && <VerificationBadge />}
                            </div>
                            <p className="text-sm text-text-secondary dark:text-dark-text-secondary">
                                {timeAgo(post.timestamp)}
                                {post.editedTimestamp && <span className="italic"> • Edited</span>}
                            </p>
                        </div>
                    </button>
                    
                    <div className="flex items-center space-x-2">
                         {isAdmin && (
                            <button onClick={() => onTogglePinPost(post.id)} title={isPinned ? 'Unpin Post' : 'Pin Post'} className={`p-2 rounded-full transition-colors ${isPinned ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 hover:bg-gray-200'}`}>
                                <PinIcon className="w-5 h-5" />
                            </button>
                        )}
                        {(isAuthor || isAdmin) && (
                            <>
                                <button onClick={() => onEditPost(post)} title="Edit post" className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
                                    <PencilIcon className="w-5 h-5" />
                                </button>
                                <button onClick={() => onDeletePost(post.id)} title="Delete post" className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
                                    <TrashIcon className="w-5 h-5 text-red-500" />
                                </button>
                            </>
                        )}
                        {isAdmin && (
                            <button onClick={() => onTogglePostCommentRestriction(post.id)} title={post.isCommentingRestricted ? "Unlock Comments" : "Lock Comments"} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
                                {post.isCommentingRestricted ? <LockOpenIcon className="w-5 h-5 text-green-500" /> : <LockClosedIcon className="w-5 h-5 text-red-500" />}
                            </button>
                        )}
                    </div>
                </div>

                <div className="prose dark:prose-invert max-w-none text-text-primary dark:text-dark-text-primary" dangerouslySetInnerHTML={{ __html: post.content }} />
                
                {post.isAdvert && (
                     <div className="relative mt-8 p-6 bg-primary-light dark:bg-indigo-900/50 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4">
                        {isSold && (
                            <>
                                <div className="absolute inset-0 bg-gray-500 bg-opacity-40 rounded-lg z-10"></div>
                                <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                                    <span className="text-6xl font-extrabold text-white transform -rotate-12 border-4 border-white p-4 select-none" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>SOLD</span>
                                </div>
                            </>
                        )}
                        <div>
                            <p className="text-sm text-text-secondary dark:text-dark-text-secondary">Price</p>
                            <p className="text-4xl font-extrabold text-primary dark:text-indigo-300">₦{post.price?.toLocaleString()}</p>
                        </div>
                         {!isAuthor && (
                            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                                <button onClick={() => onStartChat(post)} disabled={isSold} className="px-6 py-3 bg-secondary text-white font-semibold rounded-lg hover:opacity-90 transition disabled:bg-gray-400 disabled:cursor-not-allowed">Message Seller</button>
                                <button onClick={() => onInitiatePurchase(post)} disabled={isSold} className="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-hover transition disabled:bg-gray-400 disabled:cursor-not-allowed">Buy Now</button>
                            </div>
                         )}
                    </div>
                )}
            </div>

            <div className="p-6 border-t dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900/50">
                <div className="flex items-center space-x-2">
                    <button onClick={() => onLike(post.id)} disabled={isAuthor} className={`flex items-center space-x-2 px-3 py-1.5 rounded-full transition-colors ${hasLiked ? 'bg-primary-light text-primary' : 'hover:bg-gray-200 dark:hover:bg-gray-700'} disabled:opacity-50 disabled:cursor-not-allowed`}>
                        <HandThumbUpIcon className="w-5 h-5"/>
                        <span className="font-semibold text-sm">{post.likedBy.length}</span>
                    </button>
                    <button onClick={() => onDislike(post.id)} disabled={isAuthor} className={`flex items-center space-x-2 px-3 py-1.5 rounded-full transition-colors ${hasDisliked ? 'bg-red-100 text-red-600' : 'hover:bg-gray-200 dark:hover:bg-gray-700'} disabled:opacity-50 disabled:cursor-not-allowed`}>
                        <HandThumbDownIcon className="w-5 h-5"/>
                        <span className="font-semibold text-sm">{post.dislikedBy.length}</span>
                    </button>
                </div>
                <div className="flex items-center space-x-2">
                    {!isAuthor && (
                         <button onClick={() => onFlagPost(post.id)} disabled={hasFlagged} title={hasFlagged ? "You have already flagged this post" : "Flag post"} className={`flex items-center space-x-2 px-3 py-1.5 rounded-full transition-colors ${hasFlagged ? 'bg-red-100 text-red-600' : 'hover:bg-gray-200 dark:hover:bg-gray-700'} disabled:opacity-50`}>
                             <FlagIcon className="w-5 h-5"/>
                             <span className="font-semibold text-sm">{hasFlagged ? 'Flagged' : 'Flag'}</span>
                         </button>
                    )}
                    <button onClick={handleShare} className="flex items-center space-x-2 px-3 py-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                        <ArrowUpTrayIcon className="w-5 h-5"/>
                        <span className="font-semibold text-sm">Share</span>
                    </button>
                </div>
            </div>
            
            <div className="p-6">
                <h3 className="text-xl font-bold mb-4">{post.comments.length} Comment{post.comments.length !== 1 && 's'}</h3>
                <div className="space-y-6">
                    {post.comments.map(comment => (
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                            postId={post.id}
                            users={users}
                            currentUser={currentUser}
                            onViewProfile={onViewProfile}
                            onAddComment={onAddComment}
                            onEditComment={onEditComment}
                            onDeleteComment={onDeleteComment}
                            onStartReply={handleStartReply}
                            onFlagComment={onFlagComment}
                            onResolveCommentFlag={onResolveCommentFlag}
                            onLikeComment={onLikeComment}
                            onDislikeComment={onDislikeComment}
                        />
                    ))}

                    <div ref={mainCommentFormRef} className="pt-6 border-t dark:border-gray-700">
                        <h4 className="font-semibold text-text-primary dark:text-dark-text-primary mb-3">Leave a Reply</h4>
                        {isCommentingDisabled ? (
                            <div className="p-4 bg-gray-100 dark:bg-gray-700 text-center rounded-lg text-sm text-text-secondary dark:text-dark-text-secondary">
                                Commenting has been restricted by a moderator.
                            </div>
                        ) : (
                            <CommentForm 
                                currentUser={currentUser} 
                                users={users}
                                onSubmit={(commentData) => {
                                    onAddComment(post.id, commentData, replyingTo ? replyingTo.id : null)
                                    setReplyingTo(null);
                                }}
                                replyingTo={replyingTo ? { author: replyingTo.author, content: replyingTo.content } : null}
                                onCancelReply={() => setReplyingTo(null)}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};