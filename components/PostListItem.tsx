
import React from 'react';
import type { Post, User } from '../types';
import { HandThumbUpIcon, HandThumbDownIcon, ChatBubbleBottomCenterTextIcon, UserCircleIcon } from '../types';

interface PostListItemProps {
  post: Post;
  categoryName: string;
  users: User[];
  currentUser: User;
  onSelect: () => void;
  onViewProfile: (user: User) => void;
  onLike: (postId: string) => void;
  onDislike: (postId: string) => void;
}

const ActionButton: React.FC<{
    icon: React.ReactNode;
    label: string;
    count: number;
    onClick: (e: React.MouseEvent) => void;
    isActive?: boolean;
    disabled?: boolean;
}> = ({ icon, label, count, onClick, isActive, disabled }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        title={label}
        className={`flex items-center space-x-2 text-sm font-medium rounded-full px-3 py-1 transition-colors ${
            isActive ? 'bg-primary-light text-primary' : 'text-text-secondary hover:bg-gray-100'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
        {icon}
        <span>{count}</span>
    </button>
);


export const PostListItem: React.FC<PostListItemProps> = ({ post, categoryName, users, currentUser, onSelect, onViewProfile, onLike, onDislike }) => {
  const author = users.find(u => u.name === post.author);
  const isAuthor = currentUser.name === post.author;
  const hasLiked = post.likedBy.includes(currentUser.id);
  const hasDisliked = post.dislikedBy.includes(currentUser.id);
  
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

  return (
    <div 
        className="bg-surface rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden flex flex-col"
    >
        <div className="p-4">
            <div className="flex items-center mb-3">
            <button onClick={handleAuthorClick} className="flex items-center text-left rounded-full focus:outline-none focus:ring-2 focus:ring-primary">
                {author?.avatarUrl ? (
                <img src={author.avatarUrl} alt={author.name} className="w-10 h-10 rounded-full mr-3" />
                ) : (
                <UserCircleIcon className="w-10 h-10 text-gray-400 mr-3" />
                )}
                <div>
                <p className="font-bold text-text-primary hover:underline">{post.author}</p>
                <p className="text-xs text-text-secondary">{post.timestamp}</p>
                </div>
            </button>
            </div>
            
            <div onClick={onSelect} className="cursor-pointer">
                <h3 className="text-xl font-bold text-text-primary mb-2 hover:text-primary transition-colors">{post.title}</h3>
                <span className={`text-xs font-semibold inline-block py-1 px-2.5 uppercase rounded-full mb-3 ${post.isAdvert ? 'text-green-600 bg-green-200' : 'text-indigo-600 bg-indigo-200'}`}>
                    {categoryName}
                </span>
            </div>
        </div>
      
        {post.mediaUrl && (
            <div onClick={onSelect} className="bg-gray-100 cursor-pointer h-64 w-full overflow-hidden">
                {post.mediaType === 'image' ? (
                    <img src={post.mediaUrl} alt={post.title} className="w-full h-full object-cover" />
                ) : (
                    <video src={post.mediaUrl} controls className="w-full h-full object-cover" />
                )}
            </div>
        )}

        <div className="p-4 flex-grow flex flex-col">
            <div onClick={onSelect} className="cursor-pointer flex-grow">
                <p className="text-sm text-text-secondary mt-2 line-clamp-2">
                    {stripHtml(post.content)}
                </p>

                {post.isAdvert && post.price && (
                    <div className="text-2xl font-bold text-secondary text-right mt-4">
                        ${post.price.toLocaleString()}
                    </div>
                )}
            </div>
      
            <div className="mt-4 flex items-center justify-end space-x-2 border-t pt-2">
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
            </div>
        </div>
    </div>
  );
};