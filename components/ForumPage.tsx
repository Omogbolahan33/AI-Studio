

import React, { useState, useMemo, useEffect, useRef } from 'react';
import type { Post, Category, User, PostCondition, Transaction } from '../types';
import { PostListItem } from './PostListItem';
import { PostDetailView } from './PostDetailView';
import { CreatePostModal } from './CreatePostModal';
import { PlusIcon, FireIcon, TrophyIcon, FilterIcon } from '../types';

interface ForumPageProps {
  posts: Post[];
  transactions: Transaction[];
  categories: Category[];
  users: User[];
  currentUser: User;
  onInitiatePurchase: (post: Post) => void;
  onStartChat: (post: Post) => void;
  onCreatePost: (postData: { title: string; content: string; isAdvert: boolean; price?: number, categoryId: string, mediaUrl?: string, mediaType?: 'image' | 'video', brand?: string, condition?: PostCondition }) => void;
  onEditPost: (postId: string, postData: { title: string; content: string; isAdvert: boolean; price?: number, categoryId: string, mediaUrl?: string, mediaType?: 'image' | 'video', brand?: string, condition?: PostCondition }) => void;
  onDeletePost: (postId: string) => void;
  onLike: (postId: string) => void;
  onDislike: (postId: string) => void;
  onAddComment: (postId: string, commentData: { content: string; mediaUrl?: string; mediaType?: 'image' | 'video'; }, parentId: string | null) => void;
  onEditComment: (postId: string, commentId: string, newContent: string) => void;
  onDeleteComment: (postId: string, commentId: string) => void;
  onViewProfile: (user: User) => void;
  onTogglePinPost: (postId: string) => void;
  selectedPostId: string | null;
  onSelectPost: (post: Post) => void;
  onClearSelectedPost: () => void;
  onFlagPost: (postId: string) => void;
  onFlagComment: (postId: string, commentId: string) => void;
  onResolvePostFlag: (postId: string) => void;
  onResolveCommentFlag: (postId: string, commentId: string) => void;
  onTogglePostCommentRestriction: (postId: string) => void;
  onLikeComment: (postId: string, commentId: string) => void;
  onDislikeComment: (postId: string, commentId: string) => void;
// Fix: Add onToggleSoldStatus to ForumPageProps
  onToggleSoldStatus: (postId: string) => void;
}

export const ForumPage: React.FC<ForumPageProps> = ({ posts, transactions, categories, users, currentUser, onInitiatePurchase, onStartChat, onCreatePost, onEditPost, onDeletePost, onLike, onDislike, onAddComment, onEditComment, onDeleteComment, onViewProfile, onTogglePinPost, selectedPostId, onSelectPost, onClearSelectedPost, onFlagPost, onFlagComment, onResolvePostFlag, onResolveCommentFlag, onTogglePostCommentRestriction, onLikeComment, onDislikeComment }) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [postToEdit, setPostToEdit] = useState<Post | null>(null);
  const [showFab, setShowFab] = useState(false);
  const topActionRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<'discussions' | 'adverts'>('discussions');
  const [sortMode, setSortMode] = useState<'top' | 'trending'>('top');
  const [advertSort, setAdvertSort] = useState('newest');
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);
  const [filters, setFilters] = useState({
      minPrice: '',
      maxPrice: '',
      condition: '',
      brand: '',
  });

  const selectedPost = useMemo(() => posts.find(p => p.id === selectedPostId), [selectedPostId, posts]);
  const getCategoryName = (categoryId: string) => categories.find(c => c.id === categoryId)?.name || 'Unknown';

  const engagementScore = (post: Post) => post.comments.length + post.likedBy.length;
  
  const activeFilterCount = useMemo(() => {
    return Object.values(filters).filter(value => value !== '').length;
  }, [filters]);


  const displayedPosts = useMemo(() => {
    let filtered = posts.filter(p => {
        if (viewMode === 'discussions') return !p.isAdvert;
        if (viewMode === 'adverts') return p.isAdvert;
        return false;
    });

    if (viewMode === 'adverts') {
        filtered = filtered.filter(post => {
            const { minPrice, maxPrice, condition, brand } = filters;
            if (minPrice && post.price && post.price < parseFloat(minPrice)) return false;
            if (maxPrice && post.price && post.price > parseFloat(maxPrice)) return false;
            if (condition && post.condition !== condition) return false;
            if (brand && post.brand && !post.brand.toLowerCase().includes(brand.toLowerCase())) return false;
            return true;
        });
        
        return [...filtered].sort((a, b) => {
            switch (advertSort) {
                case 'price_asc':
                    return (a.price || 0) - (b.price || 0);
                case 'price_desc':
                    return (b.price || 0) - (a.price || 0);
                case 'oldest':
                    return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
                case 'newest':
                default:
                    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
            }
        });
    }

    if (sortMode === 'trending') {
        return filtered.sort((a, b) => new Date(b.lastActivityTimestamp).getTime() - new Date(a.lastActivityTimestamp).getTime());
    } else { // 'top'
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
        
        const validPinnedPosts = filtered
            .filter(p => p.pinnedAt && p.pinnedAt > twentyFourHoursAgo)
            .sort((a, b) => new Date(b.pinnedAt!).getTime() - new Date(a.pinnedAt!).getTime()); // LIFO

        const unpinnedPosts = filtered
            .filter(p => !p.pinnedAt || p.pinnedAt <= twentyFourHoursAgo)
            .sort((a, b) => engagementScore(b) - engagementScore(a));

        return [...validPinnedPosts, ...unpinnedPosts];
    }
  }, [posts, viewMode, sortMode, filters, advertSort]);

  useEffect(() => {
    const scrollContainer = document.querySelector('main');
    const header = document.querySelector('header');
    if (!scrollContainer || !header) return;

    const handleScroll = () => {
      if (topActionRef.current) {
        const topActionBarRect = topActionRef.current.getBoundingClientRect();
        const headerRect = header.getBoundingClientRect();
        
        // Show the FAB if the bottom of the action bar is at or above the bottom of the header
        if (topActionBarRect.bottom < headerRect.bottom) {
          setShowFab(true);
        } else {
          setShowFab(false);
        }
      }
    };
    scrollContainer.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check on mount
    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, []);

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
    const isSold = transactions.some(t => t.postId === selectedPost.id && t.status === 'Completed');
    return (
      <PostDetailView 
        key={selectedPost.id}
        post={selectedPost}
        isSold={isSold}
        currentUser={currentUser}
        users={users}
        onBack={onClearSelectedPost}
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
        onTogglePinPost={onTogglePinPost}
        onFlagPost={onFlagPost}
        onFlagComment={onFlagComment}
        onResolvePostFlag={onResolvePostFlag}
        onResolveCommentFlag={onResolveCommentFlag}
        onTogglePostCommentRestriction={onTogglePostCommentRestriction}
        onLikeComment={onLikeComment}
        onDislikeComment={onDislikeComment}
      />
    );
  }

  return (
    <div>
      <div ref={topActionRef} className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-text-primary dark:text-dark-text-primary">Community Forum</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          disabled={isBanned}
          title={isBanned ? `You are banned from posting until ${new Date(currentUser.banExpiresAt!).toLocaleDateString()}` : 'Create a new post'}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors w-full sm:w-auto disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Create New Post
        </button>
      </div>
      
      {/* Main View Toggles */}
      <div className="flex border-b dark:border-gray-700 mb-4">
        <button
          onClick={() => setViewMode('discussions')}
          className={`px-4 py-2 text-lg font-semibold transition-colors ${viewMode === 'discussions' ? 'border-b-2 border-primary text-primary' : 'text-text-secondary hover:text-text-primary'}`}
        >
          Discussions
        </button>
        <button
          onClick={() => setViewMode('adverts')}
          className={`px-4 py-2 text-lg font-semibold transition-colors ${viewMode === 'adverts' ? 'border-b-2 border-primary text-primary' : 'text-text-secondary hover:text-text-primary'}`}
        >
          Adverts
        </button>
      </div>

      {/* Sort Mode Toggles & Filter button */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-6">
         {viewMode === 'discussions' && (
             <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-text-secondary">Show:</span>
                <button
                onClick={() => setSortMode('top')}
                className={`flex items-center justify-center px-3 py-1 text-sm font-medium rounded-full transition-colors ${sortMode === 'top' ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700 text-text-secondary dark:text-dark-text-secondary hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                >
                <TrophyIcon className="w-4 h-4 mr-1.5" />
                Top Engaged
                </button>
                <button
                onClick={() => setSortMode('trending')}
                className={`flex items-center justify-center px-3 py-1 text-sm font-medium rounded-full transition-colors ${sortMode === 'trending' ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-700 text-text-secondary dark:text-dark-text-secondary hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                >
                <FireIcon className="w-4 h-4 mr-1.5" />
                Trending
                </button>
            </div>
         )}
         {viewMode === 'adverts' && (
            <div className="flex items-center gap-x-4 gap-y-2 flex-wrap">
                <button
                    onClick={() => setIsFilterPanelOpen(prev => !prev)}
                    className="relative flex items-center justify-center px-3 py-1 text-sm font-medium rounded-full transition-colors bg-gray-200 dark:bg-gray-700 text-text-secondary dark:text-dark-text-secondary hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                    <FilterIcon className="w-4 h-4 mr-1.5" />
                    Filters
                    {activeFilterCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-white">
                            {activeFilterCount}
                        </span>
                    )}
                </button>
                <div className="flex items-center space-x-2">
                    <label htmlFor="advert-sort" className="text-sm font-medium text-text-secondary">Sort by:</label>
                    <select
                        id="advert-sort"
                        value={advertSort}
                        onChange={e => setAdvertSort(e.target.value)}
                        className="p-2 border border-gray-300 dark:border-gray-600 bg-surface dark:bg-gray-700 rounded-md focus:ring-primary focus:border-primary text-sm"
                    >
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="price_asc">Price: Low to High</option>
                        <option value="price_desc">Price: High to Low</option>
                    </select>
                </div>
            </div>
        )}
      </div>
      
      {/* Filter Panel */}
        {isFilterPanelOpen && viewMode === 'adverts' && (
            <div className="bg-gray-50 dark:bg-dark-surface p-4 rounded-lg mb-6 space-y-4 border dark:border-gray-700">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-text-secondary">Price Range (₦)</label>
                        <div className="flex items-center space-x-2 mt-1">
                            <input type="number" placeholder="Min" value={filters.minPrice} onChange={e => setFilters(f => ({ ...f, minPrice: e.target.value }))} className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-surface dark:bg-dark-surface rounded-md focus:ring-primary focus:border-primary" />
                            <span className="text-text-secondary">-</span>
                            <input type="number" placeholder="Max" value={filters.maxPrice} onChange={e => setFilters(f => ({ ...f, maxPrice: e.target.value }))} className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-surface dark:bg-dark-surface rounded-md focus:ring-primary focus:border-primary" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-secondary">Condition</label>
                        <select value={filters.condition} onChange={e => setFilters(f => ({ ...f, condition: e.target.value }))} className="w-full mt-1 p-2 border border-gray-300 dark:border-gray-600 bg-surface dark:bg-dark-surface rounded-md focus:ring-primary focus:border-primary">
                            <option value="">All</option>
                            <option value="New">New</option>
                            <option value="Used - Like New">Used - Like New</option>
                            <option value="Used - Good">Used - Good</option>
                            <option value="Used - Fair">Used - Fair</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-secondary">Brand</label>
                        <input type="text" placeholder="e.g., Apple, Nike" value={filters.brand} onChange={e => setFilters(f => ({ ...f, brand: e.target.value }))} className="w-full mt-1 p-2 border border-gray-300 dark:border-gray-600 bg-surface dark:bg-dark-surface rounded-md focus:ring-primary focus:border-primary" />
                    </div>
                </div>
                <div className="flex justify-end pt-2">
                    <button
                        onClick={() => setFilters({ minPrice: '', maxPrice: '', condition: '', brand: '' })}
                        className="px-4 py-2 text-sm font-semibold rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                        Clear Filters
                    </button>
                </div>
            </div>
        )}

      {/* Posts List */}
      <div className="space-y-4">
        {displayedPosts.length > 0 ? (
          displayedPosts.map(post => {
            const isSold = transactions.some(t => t.postId === post.id && t.status === 'Completed');
            return (
              <PostListItem
                key={post.id}
                post={post}
                isSold={isSold}
                categoryName={getCategoryName(post.categoryId)}
                onSelect={() => onSelectPost(post)}
                users={users}
                currentUser={currentUser}
                onViewProfile={onViewProfile}
                onLike={onLike}
                onDislike={onDislike}
                onTogglePinPost={onTogglePinPost}
                onFlagPost={onFlagPost}
              />
            );
          })
        ) : (
          <p className="text-center text-text-secondary py-16">
            No {viewMode} found. Try creating one or clearing your filters!
          </p>
        )}
      </div>
      
      <button
          onClick={() => setIsCreateModalOpen(true)}
          disabled={isBanned}
          title={isBanned ? `You are banned from posting until ${new Date(currentUser.banExpiresAt!).toLocaleDateString()}` : 'Create a new post'}
          className={`fixed bottom-4 right-4 md:bottom-6 md:right-6 bg-secondary text-white rounded-full p-3 md:p-4 shadow-lg hover:opacity-90 transition-all duration-300 transform hover:scale-110 disabled:bg-gray-400 disabled:cursor-not-allowed ${showFab ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
      >
         <PlusIcon className="w-6 h-6 md:w-8 md:h-8" />
      </button>

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