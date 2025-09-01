
import React, { useState, useMemo } from 'react';
import type { Post, Category, User } from '../types';
import { PostListItem } from './PostListItem';
import { PostDetailView } from './PostDetailView';
import { CreatePostModal } from './CreatePostModal';

interface ForumPageProps {
  posts: Post[];
  categories: Category[];
  users: User[];
  currentUser: User;
  onInitiatePurchase: (post: Post) => void;
  onStartChat: (post: Post) => void;
  onCreatePost: (postData: { title: string; content: string; isAdvert: boolean; price?: number, categoryId: string, mediaUrl?: string, mediaType?: 'image' | 'video' }) => void;
  onEditPost: (postId: string, postData: { title: string; content: string; isAdvert: boolean; price?: number, categoryId: string, mediaUrl?: string, mediaType?: 'image' | 'video' }) => void;
  onDeletePost: (postId: string) => void;
  onLike: (postId: string) => void;
  onDislike: (postId: string) => void;
  onAddComment: (postId: string, commentData: { content: string; mediaUrl?: string; mediaType?: 'image' | 'video'; }) => void;
  onEditComment: (postId: string, commentId: string, newContent: string) => void;
  onDeleteComment: (postId: string, commentId: string) => void;
  onViewProfile: (user: User) => void;
}

const TopPostsSection: React.FC<{
  title: string;
  posts: Post[];
  categories: Category[];
  users: User[];
  currentUser: User;
  onSelectPost: (post: Post) => void;
  onViewProfile: (user: User) => void;
  onLike: (postId: string) => void;
  onDislike: (postId: string) => void;
}> = ({ title, posts, categories, users, currentUser, onSelectPost, onViewProfile, onLike, onDislike }) => {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const getCategoryName = (categoryId: string) => categories.find(c => c.id === categoryId)?.name || 'Unknown';

  const engagementScore = (post: Post) => post.comments.length + post.likedBy.length;

  const filteredAndSortedPosts = useMemo(() => {
    return posts
      .filter(p => !activeFilter || p.categoryId === activeFilter)
      .sort((a, b) => engagementScore(b) - engagementScore(a))
      .slice(0, 10);
  }, [posts, activeFilter]);
  
  return (
    <div>
      <h2 className="text-2xl font-bold text-text-primary mb-4 border-b pb-2">{title}</h2>
      <div className="flex flex-wrap gap-2 mb-4">
          <button 
            onClick={() => setActiveFilter(null)}
            className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${!activeFilter ? 'bg-primary text-white' : 'bg-gray-200 text-text-secondary hover:bg-gray-300'}`}
          >
            All
          </button>
        {categories.map(cat => (
          <button 
            key={cat.id}
            onClick={() => setActiveFilter(cat.id)}
            className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${activeFilter === cat.id ? 'bg-primary text-white' : 'bg-gray-200 text-text-secondary hover:bg-gray-300'}`}
          >
            {cat.name}
          </button>
        ))}
      </div>
      <div className="space-y-4">
        {filteredAndSortedPosts.length > 0 ? (
          filteredAndSortedPosts.map(post => (
            <PostListItem 
              key={post.id} 
              post={post}
              categoryName={getCategoryName(post.categoryId)}
              onSelect={() => onSelectPost(post)}
              users={users}
              currentUser={currentUser}
              onViewProfile={onViewProfile}
              onLike={onLike}
              onDislike={onDislike}
            />
          ))
        ) : (
          <p className="text-center text-text-secondary py-8">No posts found for this filter.</p>
        )}
      </div>
    </div>
  );
};


export const ForumPage: React.FC<ForumPageProps> = ({ posts, categories, users, currentUser, onInitiatePurchase, onStartChat, onCreatePost, onEditPost, onDeletePost, onLike, onDislike, onAddComment, onEditComment, onDeleteComment, onViewProfile }) => {
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [postToEdit, setPostToEdit] = useState<Post | null>(null);
  
  const selectedPost = useMemo(() => posts.find(p => p.id === selectedPostId), [selectedPostId, posts]);

  const handleSelectPost = (post: Post) => {
    setSelectedPostId(post.id);
  };

  const handleBackToList = () => {
    setSelectedPostId(null);
  };

  const handleOpenEditModal = (post: Post) => {
    setPostToEdit(post);
    setIsCreateModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
    setPostToEdit(null);
  };

  const isBanned = useMemo(() => {
    if (!currentUser.banExpiresAt) return false;
    return new Date(currentUser.banExpiresAt) > new Date();
  }, [currentUser.banExpiresAt]);
  
  if (selectedPost) {
    return (
      <PostDetailView 
        key={selectedPost.id}
        post={selectedPost}
        currentUser={currentUser}
        users={users}
        onBack={handleBackToList}
        onInitiatePurchase={onInitiatePurchase}
        onStartChat={onStartChat}
        onEditPost={handleOpenEditModal}
        onDeletePost={onDeletePost}
        onLike={onLike}
        onDislike={onDislike}
        onAddComment={onAddComment}
        onEditComment={onEditComment}
        onDeleteComment={onDeleteComment}
        onViewProfile={onViewProfile}
      />
    );
  }

  const discussionPosts = posts.filter(p => !p.isAdvert);
  const advertPosts = posts.filter(p => p.isAdvert);
  const discussionCategories = categories.filter(c => c.type === 'discussion');
  const advertCategories = categories.filter(c => c.type === 'advert');

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-text-primary">Community Forum</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          disabled={isBanned}
          title={isBanned ? `You are banned from posting until ${new Date(currentUser.banExpiresAt!).toLocaleDateString()}` : 'Create a new post'}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors w-full sm:w-auto disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Create New Post
        </button>
      </div>

      <div className="space-y-8">
        <TopPostsSection 
            title="Top 10 Engaged Discussions"
            posts={discussionPosts}
            categories={discussionCategories}
            users={users}
            currentUser={currentUser}
            onSelectPost={handleSelectPost}
            onViewProfile={onViewProfile}
            onLike={onLike}
            onDislike={onDislike}
        />
        <TopPostsSection 
            title="Top 10 Engaged Adverts"
            posts={advertPosts}
            categories={advertCategories}
            users={users}
            currentUser={currentUser}
            onSelectPost={handleSelectPost}
            onViewProfile={onViewProfile}
            onLike={onLike}
            onDislike={onDislike}
        />
      </div>

      {isCreateModalOpen && (
        <CreatePostModal
          categories={categories}
          existingPost={postToEdit}
          onClose={handleCloseModal}
          onSubmit={(postData) => {
            if(postToEdit) {
                onEditPost(postToEdit.id, postData);
            } else {
                onCreatePost(postData);
            }
            handleCloseModal();
          }}
        />
      )}
    </div>
  );
};