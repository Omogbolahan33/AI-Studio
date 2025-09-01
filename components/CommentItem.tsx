
import React, { useState } from 'react';
import type { Comment, User } from '../types';
import { UserCircleIcon, TrashIcon, PencilIcon } from '../types';
import { CommentForm } from './CommentForm';

interface CommentItemProps {
  comment: Comment;
  author?: User;
  currentUser: User;
  onViewProfile: (user: User) => void;
  onEdit: (newContent: string) => void;
  onDelete: (commentId: string) => void;
}

export const CommentItem: React.FC<CommentItemProps> = ({ comment, author, currentUser, onViewProfile, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const isAuthor = currentUser.name === comment.author;
  const isAdmin = currentUser.role === 'Admin';

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this comment? This action cannot be undone.')) {
      onDelete(comment.id);
    }
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
            <img src={author.avatarUrl} alt={author.name} className="w-10 h-10 rounded-full" />
          ) : (
            <UserCircleIcon className="w-10 h-10 text-gray-400" />
          )}
        </button>
      </div>
      <div className="flex-1 bg-gray-100 p-4 rounded-lg rounded-tl-none relative group">
        <div className="flex items-center justify-between">
          <button onClick={() => author && onViewProfile(author)} className="font-bold text-text-primary text-sm hover:underline">{comment.author}</button>
          <p className="text-xs text-text-secondary">{comment.timestamp}</p>
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
          className="prose prose-sm max-w-none text-text-primary mt-2" 
          dangerouslySetInnerHTML={{ __html: comment.content }} 
        />
        
        <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
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