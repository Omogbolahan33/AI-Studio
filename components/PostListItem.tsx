
import React from 'react';
import type { Post } from '../types';
import { HandThumbUpIcon, HandThumbDownIcon, ChatBubbleBottomCenterTextIcon } from '../types';

interface PostListItemProps {
  post: Post;
  categoryName: string;
  onSelect: () => void;
}

const Stat: React.FC<{ icon: React.ReactNode, value: number, label: string }> = ({ icon, value, label }) => (
  <div className="flex items-center space-x-1 text-text-secondary" title={label}>
    {icon}
    <span className="text-xs font-medium">{value}</span>
  </div>
);

export const PostListItem: React.FC<PostListItemProps> = ({ post, categoryName, onSelect }) => {
  return (
    <div 
        className="bg-surface rounded-lg shadow p-5 cursor-pointer hover:shadow-lg transition-shadow duration-200"
        onClick={onSelect}
    >
      <div className="flex justify-between items-start">
        <div>
          <span className={`text-xs font-semibold inline-block py-1 px-2.5 uppercase rounded-full ${post.isAdvert ? 'text-green-600 bg-green-200' : 'text-indigo-600 bg-indigo-200'}`}>
            {categoryName}
          </span>
          <h3 className="text-xl font-bold text-text-primary mt-2">{post.title}</h3>
        </div>
        {post.isAdvert && post.price && (
            <div className="text-2xl font-bold text-secondary">
                ${post.price.toLocaleString()}
            </div>
        )}
      </div>
      <p className="text-sm text-text-secondary mt-2">
        Posted by <span className="font-semibold">{post.author}</span> - {post.timestamp}
      </p>
      <div className="mt-4 flex items-center justify-end space-x-4">
          <Stat icon={<ChatBubbleBottomCenterTextIcon className="w-4 h-4" />} value={post.comments.length} label="Comments" />
          <Stat icon={<HandThumbUpIcon className="w-4 h-4 text-green-500" />} value={post.likes} label="Likes" />
          <Stat icon={<HandThumbDownIcon className="w-4 h-4 text-red-500" />} value={post.dislikes} label="Dislikes" />
      </div>
    </div>
  );
};
