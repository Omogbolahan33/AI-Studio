
import React, { useState, useMemo } from 'react';
import type { Post, Category, User } from '../types';
import { PostListItem } from './PostListItem';
import { PostDetailView } from './PostDetailView';
import { CreatePostModal } from './CreatePostModal';

interface ForumPageProps {
  posts: Post[];
  categories: Category[];
  currentUser: User;
  onInitiatePurchase: (post: Post) => void;
  onStartChat: (post: Post) => void;
  onCreatePost: (postData: { title: string; content: string; isAdvert: boolean; price?: number, categoryId: string }) => void;
  onLike: (postId: string) => void;
  onDislike: (postId: string) => void;
}

const TopPostsSection: React.FC<{
  title: string;
  posts: Post[];
  categories: Category[];
  onSelectPost: (post: Post) => void;
}> = ({ title, posts, categories, onSelectPost }) => {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const getCategoryName = (categoryId: string) => categories.find(c => c.id === categoryId)?.name || 'Unknown';

  const engagementScore = (post: Post) => post.comments.length + post.likes;

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
            />
          ))
        ) : (
          <p className="text-center text-text-secondary py-8">No posts found for this filter.</p>
        )}
      </div>
    </div>
  );
};


export const ForumPage: React.FC<ForumPageProps> = ({ posts, categories, currentUser, onInitiatePurchase, onStartChat, onCreatePost, onLike, onDislike }) => {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleSelectPost = (post: Post) => {
    setSelectedPost(post);
  };

  const handleBackToList = () => {
    setSelectedPost(null);
  };
  
  if (selectedPost) {
    return (
      <PostDetailView 
        post={selectedPost}
        currentUser={currentUser}
        onBack={handleBackToList}
        onInitiatePurchase={onInitiatePurchase}
        onStartChat={onStartChat}
        onLike={onLike}
        onDislike={onDislike}
      />
    );
  }

  const discussionPosts = posts.filter(p => !p.isAdvert);
  const advertPosts = posts.filter(p => p.isAdvert);
  const discussionCategories = categories.filter(c => c.type === 'discussion');
  const advertCategories = categories.filter(c => c.type === 'advert');

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-text-primary">Community Forum</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
        >
          Create New Post
        </button>
      </div>

      <div className="space-y-8">
        <TopPostsSection 
            title="Top 10 Engaged Discussions"
            posts={discussionPosts}
            categories={discussionCategories}
            onSelectPost={handleSelectPost}
        />
        <TopPostsSection 
            title="Top 10 Engaged Adverts"
            posts={advertPosts}
            categories={advertCategories}
            onSelectPost={handleSelectPost}
        />
      </div>

      {isCreateModalOpen && (
        <CreatePostModal
          categories={categories}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={(postData) => {
            onCreatePost(postData);
            setIsCreateModalOpen(false);
          }}
        />
      )}
    </div>
  );
};
