

import React, { useState } from 'react';
import type { Comment, User } from '../types';
import { UserCircleIcon, TrashIcon, PencilIcon, FlagIcon, ShieldCheckIcon } from '../types';
import { CommentForm } from './CommentForm';
import { VerificationBadge } from './VerificationBadge';


interface CommentItemProps {
  comment: Comment;
  author?: User;
  currentUser: User;
  onViewProfile: (user: User) => void;
  onEdit: (newContent: string) => void;
  onDelete: () => void;
  onFlag: () => void;
  onResolve: () => void;
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

export const CommentItem: React.FC<CommentItemProps> = ({ comment, author, currentUser, onViewProfile, onEdit, onDelete, onFlag, onResolve }) => {
  const [isEditing, setIsEditing] = useState(false);
  const isAuthor = currentUser.name === comment.author;
  const isAdmin = currentUser.role === 'Admin';
  const hasFlagged = comment.flaggedBy.includes(currentUser.id);

  const handleDelete = () => {
    onDelete();
  };
  
  const handleEditSubmit = (commentData: { content: string }) => {
    onEdit(commentData.content);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
        <div className="p-4 bg-primary-light rounded-lg">
            <CommentForm
                currentUser={currentUser}
                onSubmit={handleEditSubmit}
                initialContent={comment.content}
                isEditMode={true}
            />
             <div className="flex justify-end space-x-2 mt-2">
                <button onClick={() => setIsEditing(false)} className="px-3 py-1 text-sm bg-gray-200 rounded-md hover:bg-gray-300">Cancel</button>
            </div>
        </div>
    );
  }
  
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
      <div className="flex-1 bg-gray-100 dark:bg-gray-700 p-4 rounded-lg rounded-tl-none relative group">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
                <button onClick={() => author && onViewProfile(author)} className="font-bold text-text-primary dark:text-dark-text-primary text-sm hover:underline">{comment.author}</button>
                {author?.isVerified && <VerificationBadge />}
                 {comment.flaggedBy.length > 0 && (
                    // FIX: Wrapped FlagIcon in a span with a title to resolve the type error.
                    // The 'title' attribute is not a standard prop on the custom SVG component.
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
          dangerouslySetInnerHTML={{ __html: comment.content }} 
        />
        
        <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {isAdmin && comment.flaggedBy.length > 0 && (
                 <button
                    onClick={onResolve}
                    title="Dismiss flag"
                    className="p-1 text-gray-400 hover:text-green-500 rounded-full hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors"
                >
                    <ShieldCheckIcon className="w-4 h-4" />
                </button>
            )}
            {!isAuthor && (
                 <button
                    onClick={onFlag}
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
                    onClick={handleDelete}
                    title="Delete comment"
                    className="p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-100 transition-colors"
                >
                    <TrashIcon className="w-4 h-4" />
                </button>
            )}
        </div>

      </div>
    </div>
  );
};