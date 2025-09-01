
import React, { useState, useMemo, useEffect } from 'react';
import type { Category, Post } from '../types';
import { BoldIcon, ItalicIcon, Bars3BottomLeftIcon, Bars3BottomRightIcon, Bars4Icon } from '../types';

interface CreatePostModalProps {
  categories: Category[];
  existingPost?: Post | null;
  onClose: () => void;
  onSubmit: (postData: { title: string; content: string; isAdvert: boolean; price?: number, categoryId: string, mediaUrl?: string, mediaType?: 'image' | 'video' }) => void;
}

const ToolbarButton: React.FC<{ onClick: (e: React.MouseEvent) => void; title: string; children: React.ReactNode }> = ({ onClick, title, children }) => (
    <button type="button" onClick={onClick} title={title} className="p-2 rounded-md text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition-colors">
        {children}
    </button>
);


export const CreatePostModal: React.FC<CreatePostModalProps> = ({ categories, existingPost, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isAdvert, setIsAdvert] = useState(false);
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreviewUrl, setMediaPreviewUrl] = useState<string | null>(null);
  
  const isEditMode = !!existingPost;

  useEffect(() => {
    if (isEditMode) {
      setTitle(existingPost.title);
      setContent(existingPost.content);
      setIsAdvert(existingPost.isAdvert);
      setPrice(existingPost.price?.toString() || '');
      setCategoryId(existingPost.categoryId);
      setMediaPreviewUrl(existingPost.mediaUrl || null);
    }
  }, [existingPost, isEditMode]);

  const availableCategories = useMemo(() => {
    const type = isAdvert ? 'advert' : 'discussion';
    return categories.filter(c => c.type === type);
  }, [isAdvert, categories]);

  useEffect(() => {
    if (!isEditMode) {
      setCategoryId('');
    }
  }, [isAdvert, isEditMode]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMediaFile(file);
      setMediaPreviewUrl(URL.createObjectURL(file));
    }
  };
  
  const handleRemoveMedia = () => {
    setMediaFile(null);
    if(mediaPreviewUrl && mediaPreviewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(mediaPreviewUrl);
    }
    setMediaPreviewUrl(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !categoryId) {
      alert('Title, content, and category are required.');
      return;
    }
    if (isAdvert && (!price || parseFloat(price) <= 0)) {
        alert('A valid price is required for an advertisement.');
        return;
    }
    
    const finalizeSubmit = (mediaUrl?: string, mediaType?: 'image' | 'video') => {
        onSubmit({
          title,
          content,
          isAdvert,
          price: isAdvert ? parseFloat(price) : undefined,
          categoryId,
          mediaUrl,
          mediaType,
        });
    }

    if(mediaFile) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const dataUrl = event.target?.result as string;
            const mediaType = mediaFile.type.startsWith('image/') ? 'image' : 'video';
            finalizeSubmit(dataUrl, mediaType);
        };
        reader.readAsDataURL(mediaFile);
    } else {
        const existingMediaUrl = isEditMode ? existingPost.mediaUrl : undefined;
        const existingMediaType = isEditMode ? existingPost.mediaType : undefined;
        finalizeSubmit(mediaPreviewUrl || undefined, mediaPreviewUrl ? existingMediaType : undefined);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-surface rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-text-primary">{isEditMode ? 'Edit Post' : 'Create a New Post'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          <div className="p-6 space-y-4 overflow-y-auto">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-text-secondary">Title</label>
              <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" required />
            </div>
            
            <div>
              <label htmlFor="media" className="block text-sm font-medium text-text-secondary">Upload Image/Video (Optional)</label>
              <input id="media" type="file" accept="image/*,video/*" onChange={handleFileChange} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-light file:text-primary hover:file:bg-indigo-200" />
            </div>
            {mediaPreviewUrl && (
              <div className="relative">
                { (mediaFile?.type.startsWith('image/') || (!mediaFile && existingPost?.mediaType === 'image')) ? (
                    <img src={mediaPreviewUrl} alt="Preview" className="w-full rounded-lg max-h-60 object-contain" />
                ) : (
                    <video src={mediaPreviewUrl} controls className="w-full rounded-lg max-h-60 object-contain" />
                )}
                <button type="button" onClick={handleRemoveMedia} className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1.5 hover:bg-opacity-75" title="Remove media">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            )}
            
             <div className="flex items-center space-x-3">
              <input id="isAdvert" type="checkbox" checked={isAdvert} onChange={(e) => setIsAdvert(e.target.checked)} className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary" />
              <label htmlFor="isAdvert" className="text-sm font-medium text-text-primary">This is an advertisement</label>
            </div>
             <div>
              <label htmlFor="category" className="block text-sm font-medium text-text-secondary">Category</label>
              <select id="category" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" required>
                <option value="" disabled>Select a category...</option>
                {availableCategories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-text-secondary">Content</label>
              <textarea id="content" rows={5} value={content} onChange={(e) => setContent(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" required />
            </div>
            {isAdvert && (
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-text-secondary">Price ($)</label>
                <input id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" placeholder="e.g., 50.00" min="0.01" step="0.01" required={isAdvert} />
              </div>
            )}
          </div>
          <div className="p-6 border-t bg-gray-50 flex justify-end space-x-3 mt-auto">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-text-secondary rounded-lg hover:bg-gray-300 transition-colors">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors">{isEditMode ? 'Save Changes' : 'Create Post'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};