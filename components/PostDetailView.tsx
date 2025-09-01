
import React from 'react';
import type { Post, User } from '../types';
import { HandThumbUpIcon, HandThumbDownIcon, UserCircleIcon, PencilIcon, TrashIcon } from '../types';
import { CommentForm } from './CommentForm';
import { CommentItem } from './CommentItem';


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
  onAddComment: (postId: string, commentData: { content: string; mediaUrl?: string; mediaType?: 'image' | 'video'; }) => void;
  onEditComment: (postId: string, commentId: string, newContent: string) => void;
  onDeleteComment: (postId: string, commentId: string) => void;
  onViewProfile: (user: User) => void;
}

export const PostDetailView: React.FC<PostDetailViewProps> = ({ post, currentUser, users, onBack, onInitiatePurchase, onStartChat, onEditPost, onDeletePost, onLike, onDislike, onAddComment, onEditComment, onDeleteComment, onViewProfile }) => {
  const isAuthor = currentUser.name === post.author;
  const author = users.find(u => u.name === post.author);
  const hasLiked = post.likedBy.includes(currentUser.id);
  const hasDisliked = post.dislikedBy.includes(currentUser.id);
  const isAdmin = currentUser.role === 'Admin';
  
  return (
    <div>
        <button onClick={onBack} className="mb-6 text-primary font-semibold hover:underline">
            &larr; Back to Posts
        </button>

        <div className="bg-surface rounded-lg shadow-lg overflow-hidden">
            
            {post.mediaUrl && (
                <div className="bg-black flex justify-center">
                {post.mediaType === 'image' ? (
                    <img src={post.mediaUrl} alt={post.title} className="w-full h-auto max-h-[70vh] object-contain" />
                ) : (
                    <video src={post.mediaUrl} controls className="w-full h-auto max-h-[70vh] object-contain" />
                )}
                </div>
            )}
            
            <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                    <button onClick={() => author && onViewProfile(author)} className="flex items-center text-left rounded-full focus:outline-none focus:ring-2 focus:ring-primary">
                        {author?.avatarUrl ? (
                            <img src={author.avatarUrl} alt={author.name} className="w-12 h-12 rounded-full mr-4" />
                        ) : (
                            <UserCircleIcon className="w-12 h-12 text-gray-400 mr-4" />
                        )}
                        <div>
                            <p className="font-bold text-text-primary text-lg hover:underline">{post.author}</p>
                            <p className="text-sm text-text-secondary">{post.timestamp}</p>
                        </div>
                    </button>
                    <div className="flex items-center space-x-2">
                        {isAuthor && (
                            <button onClick={() => onEditPost(post)} title="Edit Post" className="p-2 text-gray-500 rounded-full hover:bg-gray-200 hover:text-primary transition-colors">
                                <PencilIcon className="w-5 h-5" />
                            </button>
                        )}
                        {isAdmin && (
                            <button onClick={() => onDeletePost(post.id)} title="Admin: Delete Post" className="p-2 text-gray-500 rounded-full hover:bg-red-100 hover:text-red-600 transition-colors">
                                <TrashIcon className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start my-4">
                    <div className="mb-4 md:mb-0">
                        <h1 className="text-2xl md:text-3xl font-bold text-text-primary">{post.title}</h1>
                    </div>
                    {post.isAdvert && post.price && (
                        <div className="text-right flex-shrink-0 w-full md:w-auto">
                            <p className="text-2xl md:text-3xl font-bold text-secondary">${post.price.toLocaleString()}</p>
                            <p className="text-sm text-text-secondary">via Secure Escrow</p>
                        </div>
                    )}
                </div>

                <div className="prose max-w-none text-text-primary my-6" dangerouslySetInnerHTML={{__html: post.content.replace(/\n/g, '<br />')}} />

                <div className="flex items-center space-x-4 my-6">
                    <button
                        onClick={() => onLike(post.id)}
                        disabled={isAuthor}
                        className={`flex items-center space-x-2 px-3 py-1.5 rounded-full transition-colors ${
                            hasLiked ? 'bg-green-100' : 'bg-gray-100 hover:bg-green-100'
                        } ${isAuthor ? 'opacity-50 cursor-not-allowed' : ''}`}
                        title={isAuthor ? "You can't vote on your own post" : "Like"}
                    >
                        <HandThumbUpIcon className={`w-5 h-5 ${hasLiked ? 'text-green-600' : 'text-gray-500'}`}/>
                        <span className={`font-semibold text-sm ${hasLiked ? 'text-green-700' : 'text-gray-700'}`}>{post.likedBy.length}</span>
                    </button>
                    <button
                        onClick={() => onDislike(post.id)}
                        disabled={isAuthor}
                        className={`flex items-center space-x-2 px-3 py-1.5 rounded-full transition-colors ${
                            hasDisliked ? 'bg-red-100' : 'bg-gray-100 hover:bg-red-100'
                        } ${isAuthor ? 'opacity-50 cursor-not-allowed' : ''}`}
                        title={isAuthor ? "You can't vote on your own post" : "Dislike"}
                    >
                        <HandThumbDownIcon className={`w-5 h-5 ${hasDisliked ? 'text-red-600' : 'text-gray-500'}`}/>
                        <span className={`font-semibold text-sm ${hasDisliked ? 'text-red-700' : 'text-gray-700'}`}>{post.dislikedBy.length}</span>
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
                
                <div className="space-y-4 mb-6">
                    {post.comments.map(comment => {
                        const commentAuthor = users.find(u => u.name === comment.author);
                        return <CommentItem 
                                    key={comment.id} 
                                    comment={comment} 
                                    author={commentAuthor} 
                                    onViewProfile={onViewProfile}
                                    currentUser={currentUser}
                                    onEdit={(newContent) => onEditComment(post.id, comment.id, newContent)}
                                    onDelete={() => onDeleteComment(post.id, comment.id)}
                                />
                    })}
                    {post.comments.length === 0 && (
                        <p className="text-sm text-text-secondary text-center py-4">No comments yet. Be the first to reply!</p>
                    )}
                </div>
                 <div className="mt-6">
                    <CommentForm
                        currentUser={currentUser}
                        onSubmit={(commentData) => onAddComment(post.id, commentData)}
                    />
                </div>
            </div>
        </div>
    </div>
  );
};