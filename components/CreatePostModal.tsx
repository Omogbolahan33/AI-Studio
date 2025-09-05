import React, { useState, useMemo, useEffect, useRef } from 'react';
import type { Category, Post, PostCondition } from '../types';
import { BoldIcon, ItalicIcon, Bars3BottomLeftIcon, Bars3BottomRightIcon, Bars4Icon, ListBulletIcon, ListNumberedIcon, SparklesIcon } from '../types';
import { generateDescriptionFromMedia } from '../services/geminiService';

interface CreatePostModalProps {
  categories: Category[];
  existingPost?: Post | null;
  onClose: () => void;
  onSubmit: (postData: { title: string; content: string; isAdvert: boolean; price?: number, categoryId: string, mediaUrl?: string, mediaType?: 'image' | 'video', brand?: string, condition?: PostCondition }) => void;
}

const ToolbarButton: React.FC<{ onClick: (e: React.MouseEvent) => void; title: string; children: React.ReactNode }> = ({ onClick, title, children }) => (
    <button type="button" onClick={onClick} title={title} className="p-2 rounded-md text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition-colors">
        {children}
    </button>
);


export const CreatePostModal: React.FC<CreatePostModalProps> = ({ categories, existingPost, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [isAdvert, setIsAdvert] = useState(false);
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreviewUrl, setMediaPreviewUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [brand, setBrand] = useState('');
  const [condition, setCondition] = useState<PostCondition>('New');
  const editorRef = useRef<HTMLDivElement>(null);

  const isEditMode = !!existingPost;
  const TITLE_LIMIT = 40;

  useEffect(() => {
    if (isEditMode) {
      setTitle(existingPost.title);
      if(editorRef.current) editorRef.current.innerHTML = existingPost.content;
      setIsAdvert(existingPost.isAdvert);
      setPrice(existingPost.price?.toString() || '');
      setCategoryId(existingPost.categoryId);
      setMediaPreviewUrl(existingPost.mediaUrl || null);
      setBrand(existingPost.brand || '');
      setCondition(existingPost.condition || 'New');
    }
  }, [existingPost, isEditMode]);

  const availableCategories = useMemo(() => {
    const type = isAdvert ? 'advert' : 'discussion';
    return categories.filter(c => c.type === type);
  }, [isAdvert, categories]);

  useEffect(() => {
    if (!isEditMode && availableCategories.length > 0) {
      setCategoryId(availableCategories[0].id);
    } else if (isEditMode) {
        setCategoryId(existingPost!.categoryId);
    }
  }, [isAdvert, isEditMode, availableCategories, existingPost]);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = (reader.result as string).split(',')[1];
        resolve(result);
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMediaFile(file);
      setMediaPreviewUrl(URL.createObjectURL(file));

      if (isAdvert) {
        setIsGenerating(true);
        if (editorRef.current) {
          editorRef.current.innerHTML = '<p><em>Generating description...</em></p>';
        }

        try {
          const base64Data = await fileToBase64(file);
          const selectedCategory = categories.find(c => c.id === categoryId);
          const description = await generateDescriptionFromMedia(file.type, base64Data, selectedCategory?.name);
          if (description && editorRef.current) {
            editorRef.current.innerHTML = description.replace(/\n/g, '<br />');
          } else if (editorRef.current) {
              editorRef.current.innerHTML = '<p><em>Could not generate a description. Please write one manually.</em></p>';
          }
        } catch (error) {
          console.error("Error in AI generation flow:", error);
          if (editorRef.current) {
              editorRef.current.innerHTML = '<p><em>An error occurred. Please write a description manually.</em></p>';
          }
        } finally {
          setIsGenerating(false);
        }
      }
    }
  };
  
  const handleRemoveMedia = () => {
    setMediaFile(null);
    if(mediaPreviewUrl && mediaPreviewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(mediaPreviewUrl);
    }
    setMediaPreviewUrl(null);
  };

  const handleFormat = (command: string) => {
    document.execCommand(command, false);
    editorRef.current?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const content = editorRef.current?.innerHTML || '';
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
          brand: isAdvert ? brand : undefined,
          condition: isAdvert ? condition : undefined,
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
      <div className="bg-surface dark:bg-dark-surface rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-text-primary dark:text-dark-text-primary">{isEditMode ? 'Edit Post' : 'Create a New Post'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          <div className="p-6 space-y-4 overflow-y-auto">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary">Title</label>
              <div className="relative">
                <input id="title" type="text" value={title} maxLength={TITLE_LIMIT} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-surface dark:bg-dark-surface dark:text-dark-text-primary" required />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-text-secondary">{title.length}/{TITLE_LIMIT}</span>
              </div>
            </div>
            
            <div>
              <div className="flex items-center space-x-3">
                <input id="isAdvert" type="checkbox" checked={isAdvert} onChange={(e) => setIsAdvert(e.target.checked)} className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary" />
                <label htmlFor="isAdvert" className="text-sm font-medium text-text-primary dark:text-dark-text-primary">This is an advertisement</label>
              </div>
            </div>
             <div>
              <label htmlFor="category" className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary">Category</label>
              <select id="category" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-surface dark:bg-dark-surface rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:text-dark-text-primary" required>
                <option value="" disabled>Select a category...</option>
                {availableCategories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {isAdvert && (
              <>
                <div>
                    <label htmlFor="price" className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary">Price (₦)</label>
                    <input id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-surface dark:bg-dark-surface dark:text-dark-text-primary" placeholder="e.g., 50.00" min="0.01" step="0.01" required={isAdvert} />
                </div>
                <div>
                  <label htmlFor="brand" className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary">Brand (Optional)</label>
                  <input id="brand" type="text" value={brand} onChange={(e) => setBrand(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-surface dark:bg-dark-surface dark:text-dark-text-primary" placeholder="e.g., Apple, Nike" />
                </div>
                <div>
                  <label htmlFor="condition" className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary">Condition</label>
                  <select id="condition" value={condition} onChange={(e) => setCondition(e.target.value as PostCondition)} className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-surface dark:bg-dark-surface rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:text-dark-text-primary">
                    <option value="New">New</option>
                    <option value="Used - Like New">Used - Like New</option>
                    <option value="Used - Good">Used - Good</option>
                    <option value="Used - Fair">Used - Fair</option>
                  </select>
                </div>
              </>
            )}

            {isAdvert ? (
                <div className="p-4 bg-primary-light rounded-lg space-y-3 border-l-4 border-primary">
                    <div className="flex items-center space-x-2">
                        <SparklesIcon className="w-6 h-6 text-primary"/>
                        <label htmlFor="media-ai" className="block text-sm font-medium text-primary font-semibold">
                            Generate Description with AI
                        </label>
                    </div>
                    <p className="text-xs text-primary-dark">Upload or take a photo/video and our AI will write a description for you.</p>
                    <input 
                      id="media-ai"
                      type="file" 
                      accept="image/*,video/*" 
                      capture="environment" 
                      onChange={handleFileChange} 
                      className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-hover" 
                    />
                </div>
            ) : (
                 <div>
                    <label htmlFor="media-manual" className="block text-sm font-medium text-text-secondary">Upload Image/Video (Optional)</label>
                    <input id="media-manual" type="file" accept="image/*,video/*" onChange={handleFileChange} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-light file:text-primary hover:file:bg-indigo-200" />
                </div>
            )}

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
            
            <div>
                <label htmlFor="content" className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary">Content</label>
                <div className="mt-1 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm relative bg-surface dark:bg-dark-surface">
                    <div className="flex items-center space-x-1 border-b p-2 bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
                        <ToolbarButton onClick={() => handleFormat('bold')} title="Bold"><BoldIcon className="w-5 h-5" /></ToolbarButton>
                        <ToolbarButton onClick={() => handleFormat('italic')} title="Italic"><ItalicIcon className="w-5 h-5" /></ToolbarButton>
                        <ToolbarButton onClick={() => handleFormat('justifyLeft')} title="Align Left"><Bars3BottomLeftIcon className="w-5 h-5" /></ToolbarButton>
                        <ToolbarButton onClick={() => handleFormat('justifyCenter')} title="Align Center"><Bars4Icon className="w-5 h-5" /></ToolbarButton>
                        <ToolbarButton onClick={() => handleFormat('justifyRight')} title="Align Right"><Bars3BottomRightIcon className="w-5 h-5" /></ToolbarButton>
                        <ToolbarButton onClick={() => handleFormat('insertUnorderedList')} title="Bulleted List"><ListBulletIcon className="w-5 h-5" /></ToolbarButton>
                        <ToolbarButton onClick={() => handleFormat('insertOrderedList')} title="Numbered List"><ListNumberedIcon className="w-5 h-5" /></ToolbarButton>
                    </div>
                    {isGenerating && (
                        <div className="absolute inset-0 bg-white bg-opacity-75 flex flex-col items-center justify-center z-10 rounded-md">
                            <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <p className="mt-2 text-sm font-semibold text-primary">Generating description...</p>
                        </div>
                    )}
                    <div
                        ref={editorRef}
                        id="content"
                        contentEditable={!isGenerating}
                        className={`w-full p-3 min-h-[150px] text-text-primary dark:text-dark-text-primary focus:outline-none ${isGenerating ? 'blur-sm' : ''}`}
                    />
                </div>
            </div>
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