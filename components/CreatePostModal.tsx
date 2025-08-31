
import React, { useState, useMemo } from 'react';
import type { Category } from '../types';

interface CreatePostModalProps {
  categories: Category[];
  onClose: () => void;
  onSubmit: (postData: { title: string; content: string; isAdvert: boolean; price?: number, categoryId: string }) => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({ categories, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isAdvert, setIsAdvert] = useState(false);
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');

  const availableCategories = useMemo(() => {
    const type = isAdvert ? 'advert' : 'discussion';
    return categories.filter(c => c.type === type);
  }, [isAdvert, categories]);

  // Effect to reset category if type changes
  React.useEffect(() => {
    setCategoryId('');
  }, [isAdvert]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert('Title and content are required.');
      return;
    }
    if (!categoryId) {
        alert('Please select a category.');
        return;
    }
    if (isAdvert && (!price || parseFloat(price) <= 0)) {
        alert('A valid price is required for an advertisement.');
        return;
    }

    onSubmit({
      title,
      content,
      isAdvert,
      price: isAdvert ? parseFloat(price) : undefined,
      categoryId,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-surface rounded-lg shadow-xl w-full max-w-lg">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-text-primary">Create a New Post</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-text-secondary">Title</label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                required
              />
            </div>
             <div className="flex items-center space-x-3">
              <input
                id="isAdvert"
                type="checkbox"
                checked={isAdvert}
                onChange={(e) => setIsAdvert(e.target.checked)}
                className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <label htmlFor="isAdvert" className="text-sm font-medium text-text-primary">This is an advertisement</label>
            </div>
             <div>
              <label htmlFor="category" className="block text-sm font-medium text-text-secondary">Category</label>
              <select
                id="category"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                required
              >
                <option value="" disabled>Select a category...</option>
                {availableCategories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-text-secondary">Content</label>
              <textarea
                id="content"
                rows={5}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                required
              />
            </div>
            {isAdvert && (
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-text-secondary">Price ($)</label>
                <input
                  id="price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="e.g., 50.00"
                  min="0.01"
                  step="0.01"
                  required
                />
              </div>
            )}
          </div>
          <div className="p-6 border-t bg-gray-50 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-text-secondary rounded-lg hover:bg-gray-300 transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors">
              Create Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
