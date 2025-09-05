
import React, { useState, useMemo } from 'react';
import type { Comment, User } from '../types';
import { UserCircleIcon, TrashIcon, PencilIcon, FlagIcon, ShieldCheckIcon, HandThumbUpIcon, HandThumbDownIcon, UnverifiedBadge } from '../types';
import { CommentForm } from './CommentForm';
import { VerificationBadge } from './VerificationBadge';


interface CommentItemProps {
  comment: Comment;
  postId: string;
  users: User[];
  currentUser: User;
  onViewProfile: (user: User) => void;
  onAddComment: (postId: string, commentData: { content: string; mediaUrl?: string; mediaType?: 'image' | 'video'; }, parentId: string | null) => void;
  onEditComment: (postId: string, commentId: string, newContent: string) => void;
  onDeleteComment: (postId: string, commentId: string) => void;
  onStartReply: (comment: Comment) => void;
  onFlagComment: (postId: string, commentId: string) => void;
  onResolveCommentFlag: (postId: string, commentId: string) => void;
  onLikeComment: (postId: string, commentId: string) => void;
  onDislikeComment: (postId: string, commentId: string) => void;
}

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

export const CommentItem: React.FC<CommentItemProps> = ({ comment, postId, users, currentUser, onViewProfile, onAddComment, onEditComment, onDeleteComment, onStartReply, onFlagComment, onResolveCommentFlag, onLikeComment, onDislikeComment }) => {
  const [isEditing, setIsEditing] = useState(false);
  
  const author = useMemo(() => users.find(u => u.name === comment.author), [users, comment.author]);
  const isAuthor = currentUser.id === author?.id;
  const isAdmin = currentUser.role === 'Admin' || currentUser.role === 'Super Admin';
  const hasFlagged = comment.flaggedBy.includes(currentUser.id);
  const hasLiked = comment.likedBy.includes(currentUser.id);
  const hasDisliked = comment.dislikedBy.includes(currentUser.id);


  const handleEditSubmit = (commentData: { content: string }) => {
    onEditComment(postId, comment.id, commentData.content);
    setIsEditing(false);
  };

  const highlightedContent = useMemo(() => {
    return comment.content.replace(/@(\w+)/g, (match, username) => {
        const userExists = users.some(u => u.username === username);
        if (userExists) {
            return `<span class="mention">${match}</span>`;
        }
        return match;
    });
}, [comment.content, users]);


  return (
    <div className="flex items-start space-x-4">
      <div className="flex-shrink-0">
        <button onClick={() => author && onViewProfile(author)} className="rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
          {author?.avatarUrl ? (
            <img src={author.avatarUrl} alt={author.name} className="w-10 h-10 rounded-full object-cover" />
          ) : (
            <UserCircleIcon className="w-10 h-10 text-gray-400" />
          )}
        </button>
      </div>
      <div className="flex-1">
        {isEditing ? (
          <div>
            <CommentForm
                currentUser={currentUser}
                users={users}
                onSubmit={handleEditSubmit}
                initialContent={comment.content}
                isEditMode={true}
            />
             <div className="flex justify-end space-x-2 mt-2">
                <button onClick={() => setIsEditing(false)} className="px-3 py-1 text-sm bg-gray-200 rounded-md hover:bg-gray-300">Cancel</button>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg rounded-tl-none relative group">
              <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                      <button onClick={() => author && onViewProfile(author)} className="font-bold text-text-primary dark:text-dark-text-primary text-sm hover:underline">{comment.author}</button>
                      {author?.isVerified ? <VerificationBadge /> : <UnverifiedBadge />}
                       {comment.flaggedBy.length > 0 && (
                          <span title={`Flagged by ${comment.flaggedBy.length} user(s)`}>
                              <FlagIcon className="w-4 h-4 text-red-500"/>
                          </span>
                      )}
                  </div>
                <p className="text-xs text-text-secondary dark:text-dark-text-secondary">
                  {timeAgo(comment.timestamp)}
                  {comment.editedTimestamp && <span className="italic"> • Edited</span>}
                </p>
              </div>
              
              {comment.mediaUrl && (
                <div className="mt-2 rounded-md overflow-hidden bg-gray-200">
                  {comment.mediaType === 'image' ? (
                    <img src={comment.mediaUrl} alt="Comment media" className="w-auto h-auto max-h-64 object-contain" />
                  ) : (
                    <video src={comment.mediaUrl} controls className="w-auto h-auto max-h-64 object-contain" />
                  )}
                </div>
              )}
              
              <div 
                className="prose prose-sm dark:prose-invert max-w-none text-text-primary dark:text-dark-text-primary mt-2" 
                dangerouslySetInnerHTML={{ __html: highlightedContent }} 
              />
              
              <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {isAdmin && comment.flaggedBy.length > 0 && (
                       <button
                          onClick={() => onResolveCommentFlag(postId, comment.id)}
                          title="Dismiss flag"
                          className="p-1 text-gray-400 hover:text-green-500 rounded-full hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors"
                      >
                          <ShieldCheckIcon className="w-4 h-4" />
                      </button>
                  )}
                  {!isAuthor && (
                       <button
                          onClick={() => onFlagComment(postId, comment.id)}
                          disabled={hasFlagged}
                          title={hasFlagged ? "You have already flagged this comment" : "Flag comment"}
                          className="p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                          <FlagIcon className={`w-4 h-4 ${hasFlagged ? 'text-red-500' : ''}`} />
                      </button>
                  )}
                  {isAuthor && (
                      <button
                          onClick={() => setIsEditing(true)}
                          title="Edit comment"
                          className="p-1 text-gray-400 hover:text-primary rounded-full hover:bg-primary-light transition-colors"
                      >
                          <PencilIcon className="w-4 h-4" />
                      </button>
                  )}
                  {(isAuthor || isAdmin) && (
                      <button
                          onClick={() => onDeleteComment(postId, comment.id)}
                          title="Delete comment"
                          className="p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-100 transition-colors"
                      >
                          <TrashIcon className="w-4 h-4" />
                      </button>
                  )}
              </div>
            </div>

            <div className="mt-2 text-sm flex items-center space-x-4">
                <button onClick={() => onStartReply(comment)} className="font-semibold text-text-secondary hover:text-primary transition-colors">Reply</button>
                 <div className="flex items-center space-x-1 text-text-secondary">
                    <button onClick={() => onLikeComment(postId, comment.id)} disabled={isAuthor} className={`p-1 rounded-full hover:bg-gray-200 disabled:opacity-50 ${hasLiked ? 'text-primary' : ''}`}>
                        <HandThumbUpIcon className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-semibold">{comment.likedBy.length}</span>
                </div>
                 <div className="flex items-center space-x-1 text-text-secondary">
                    <button onClick={() => onDislikeComment(postId, comment.id)} disabled={isAuthor} className={`p-1 rounded-full hover:bg-gray-200 disabled:opacity-50 ${hasDisliked ? 'text-red-500' : ''}`}>
                        <HandThumbDownIcon className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-semibold">{comment.dislikedBy.length}</span>
                </div>
            </div>
          </>
        )}

        {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 reply-container">
                <div className="reply-thread-line"></div>
                <div className="space-y-4">
                    {comment.replies.map(reply => (
                        <CommentItem
                            key={reply.id}
                            comment={reply}
                            postId={postId}
                            users={users}
                            currentUser={currentUser}
                            onViewProfile={onViewProfile}
                            onAddComment={onAddComment}
                            onEditComment={onEditComment}
                            onDeleteComment={onDeleteComment}
                            onStartReply={onStartReply}
                            onFlagComment={onFlagComment}
                            onResolveCommentFlag={onResolveCommentFlag}
                            onLikeComment={onLikeComment}
                            onDislikeComment={onDislikeComment}
                        />
                    ))}
                </div>
            </div>
        )}
      </div>
    </div>
  );
};
