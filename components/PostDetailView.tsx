
import React from 'react';
import type { Post, User } from '../types';
import { HandThumbUpIcon, HandThumbDownIcon } from '../types';


interface PostDetailViewProps {
  post: Post;
  currentUser: User;
  onBack: () => void;
  onInitiatePurchase: (post: Post) => void;
  onStartChat: (post: Post) => void;
  onLike: (postId: string) => void;
  onDislike: (postId: string) => void;
}

export const PostDetailView: React.FC<PostDetailViewProps> = ({ post, currentUser, onBack, onInitiatePurchase, onStartChat, onLike, onDislike }) => {
  const isAuthor = currentUser.name === post.author;
  
  return (
    <div>
        <button onClick={onBack} className="mb-6 text-primary font-semibold hover:underline">
            &larr; Back to Forum
        </button>

        <div className="bg-surface rounded-lg shadow p-6">
            <div className="flex flex-col md:flex-row justify-between items-start mb-4">
                 <div className="mb-4 md:mb-0">
                    <h1 className="text-3xl font-bold text-text-primary">{post.title}</h1>
                    <p className="text-sm text-text-secondary mt-1">
                        By <span className="font-semibold">{post.author}</span> at {post.timestamp}
                    </p>
                 </div>
                 {post.isAdvert && post.price && (
                    <div className="text-right flex-shrink-0">
                        <p className="text-3xl font-bold text-secondary">${post.price.toLocaleString()}</p>
                        <p className="text-sm text-text-secondary">via Secure Escrow</p>
                    </div>
                )}
            </div>

            <p className="text-text-primary leading-relaxed my-6 whitespace-pre-wrap">{post.content}</p>
            
            <div className="flex items-center space-x-4 my-6">
                <button
                    onClick={() => onLike(post.id)}
                    disabled={isAuthor}
                    className="flex items-center space-x-2 px-3 py-1.5 bg-gray-100 rounded-full hover:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title={isAuthor ? "You can't vote on your own post" : "Like"}
                >
                    <HandThumbUpIcon className="w-5 h-5 text-green-500"/>
                    <span className="font-semibold text-sm text-gray-700">{post.likes}</span>
                </button>
                 <button
                    onClick={() => onDislike(post.id)}
                    disabled={isAuthor}
                    className="flex items-center space-x-2 px-3 py-1.5 bg-gray-100 rounded-full hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title={isAuthor ? "You can't vote on your own post" : "Dislike"}
                >
                    <HandThumbDownIcon className="w-5 h-5 text-red-500"/>
                     <span className="font-semibold text-sm text-gray-700">{post.dislikes}</span>
                </button>
            </div>

            {post.isAdvert && (
                <div className="text-center my-8 flex flex-col md:flex-row justify-center items-center gap-4">
                    <button 
                        onClick={() => onStartChat(post)}
                        disabled={isAuthor}
                        className="w-full md:w-auto px-8 py-3 bg-primary text-white font-bold rounded-lg shadow-lg hover:bg-primary-hover transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                        title={isAuthor ? "You can't message yourself" : "Message Seller"}
                    >
                        Message Seller
                    </button>
                    <button 
                        onClick={() => onInitiatePurchase(post)}
                        disabled={isAuthor}
                        className="w-full md:w-auto px-8 py-3 bg-secondary text-white font-bold rounded-lg shadow-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                        title={isAuthor ? "You can't buy your own item" : "Buy Now with Escrow"}
                    >
                        Buy Now with Escrow
                    </button>
                </div>
            )}

            <hr className="my-6"/>

            <h2 className="text-xl font-bold text-text-primary mb-4">Comments ({post.comments.length})</h2>
            <div className="space-y-4">
                {post.comments.map(comment => (
                    <div key={comment.id} className="bg-gray-100 p-4 rounded-lg">
                        <p className="text-text-primary text-sm">{comment.content}</p>
                        <p className="text-xs text-text-secondary mt-2 text-right">
                            - <span className="font-semibold">{comment.author}</span>, {comment.timestamp}
                        </p>
                    </div>
                ))}
                {post.comments.length === 0 && (
                    <p className="text-sm text-text-secondary text-center py-4">No comments yet.</p>
                )}
            </div>
        </div>
    </div>
  );
};
