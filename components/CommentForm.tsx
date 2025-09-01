
import React, { useState, useRef, useEffect } from 'react';
import type { User } from '../types';
import { PaperClipIcon, FaceSmileIcon, PaintBrushIcon, BoldIcon, ItalicIcon, Bars3BottomLeftIcon, UserCircleIcon } from '../types';

interface CommentFormProps {
  currentUser: User;
  onSubmit: (commentData: { content: string; mediaUrl?: string; mediaType?: 'image' | 'video'; }) => void;
  initialContent?: string;
  isEditMode?: boolean;
}

const EMOJIS = ['😀', '😂', '😍', '🤔', '👍', '❤️', '🔥', '🎉', '👋', '🙏'];

const ToolbarButton: React.FC<{ onClick: (e: React.MouseEvent) => void; title: string; children: React.ReactNode }> = ({ onClick, title, children }) => (
    <button type="button" onClick={onClick} title={title} className="p-2 rounded-md text-gray-500 hover:bg-gray-200 hover:text-gray-800 transition-colors">
        {children}
    </button>
);

export const CommentForm: React.FC<CommentFormProps> = ({ currentUser, onSubmit, initialContent = '', isEditMode = false }) => {
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreviewUrl, setMediaPreviewUrl] = useState<string | null>(null);
  const [isEmojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const colorInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editorRef.current && initialContent) {
      editorRef.current.innerHTML = initialContent;
    }
  }, [initialContent]);
  
  const handleFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMediaFile(file);
      setMediaPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveMedia = () => {
    setMediaFile(null);
    if(mediaPreviewUrl) URL.revokeObjectURL(mediaPreviewUrl);
    setMediaPreviewUrl(null);
    if(fileInputRef.current) fileInputRef.current.value = "";
  };
  
  const insertEmoji = (emoji: string) => {
      editorRef.current?.focus();
      handleFormat('insertText', emoji);
      setEmojiPickerOpen(false);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const content = editorRef.current?.innerHTML || '';
    if (!content.trim() && !mediaFile) {
      alert('Comment cannot be empty.');
      return;
    }
    
    const finalizeSubmit = (mediaUrl?: string, mediaType?: 'image' | 'video') => {
        onSubmit({ content, mediaUrl, mediaType });
        if(editorRef.current && !isEditMode) editorRef.current.innerHTML = '';
        if(!isEditMode) handleRemoveMedia();
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
        finalizeSubmit();
    }
  };

  return (
    <div className="flex items-start space-x-4">
      <div className="flex-shrink-0">
         {currentUser.avatarUrl ? (
            <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-10 h-10 rounded-full" />
        ) : (
            <UserCircleIcon className="w-10 h-10 text-gray-400" />
        )}
      </div>
      <form onSubmit={handleSubmit} className="flex-1">
        <div className="border border-gray-300 rounded-lg">
          <div 
            ref={editorRef}
            contentEditable
            className="w-full p-3 min-h-[100px] text-text-primary focus:outline-none"
          />
          {mediaPreviewUrl && (
            <div className="p-3">
              <div className="relative inline-block">
                {mediaFile?.type.startsWith('image/') ? (
                    <img src={mediaPreviewUrl} alt="Preview" className="w-auto rounded-lg max-h-40 object-contain" />
                ) : (
                    <video src={mediaPreviewUrl} controls className="w-auto rounded-lg max-h-40 object-contain" />
                )}
                <button
                  type="button"
                  onClick={handleRemoveMedia}
                  className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-75"
                  title="Remove media"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}
          <div className="border-t border-gray-200 p-2 flex justify-between items-center relative">
            <div className="flex items-center space-x-1">
                <ToolbarButton onClick={() => handleFormat('bold')} title="Bold"><BoldIcon className="w-5 h-5" /></ToolbarButton>
                <ToolbarButton onClick={() => handleFormat('italic')} title="Italic"><ItalicIcon className="w-5 h-5" /></ToolbarButton>
                <ToolbarButton onClick={() => handleFormat('justifyLeft')} title="Justify Left"><Bars3BottomLeftIcon className="w-5 h-5" /></ToolbarButton>
                <ToolbarButton onClick={() => colorInputRef.current?.click()} title="Text Color">
                    <PaintBrushIcon className="w-5 h-5" />
                    <input ref={colorInputRef} type="color" className="w-0 h-0 opacity-0 absolute" onChange={e => handleFormat('foreColor', e.target.value)} />
                </ToolbarButton>
                {!isEditMode && <>
                  <ToolbarButton onClick={() => fileInputRef.current?.click()} title="Attach Media"><PaperClipIcon className="w-5 h-5" /></ToolbarButton>
                  <input ref={fileInputRef} type="file" hidden accept="image/*,video/*" onChange={handleFileChange} />
                </>}
                <ToolbarButton onClick={() => setEmojiPickerOpen(prev => !prev)} title="Add Emoji"><FaceSmileIcon className="w-5 h-5" /></ToolbarButton>
                
                {isEmojiPickerOpen && (
                    <div className="absolute bottom-12 left-0 bg-white shadow-lg rounded-lg p-2 grid grid-cols-5 gap-1 border z-10">
                        {EMOJIS.map(emoji => (
                            <button type="button" key={emoji} onClick={() => insertEmoji(emoji)} className="text-xl p-1 rounded-md hover:bg-gray-100">{emoji}</button>
                        ))}
                    </div>
                )}
            </div>
            <button type="submit" className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-hover transition-colors">
              {isEditMode ? 'Save' : 'Comment'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};