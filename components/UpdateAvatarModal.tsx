import React, { useState, useRef } from 'react';
import { SparklesIcon, PhotoIcon } from '../types';
import { generateAvatar } from '../services/geminiService';

interface UpdateAvatarModalProps {
  onClose: () => void;
  onSave: (avatarUrl: string) => void;
}

const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
    <button
        onClick={onClick}
        className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 font-semibold text-sm transition-colors ${
            active ? 'border-b-2 border-primary text-primary' : 'text-text-secondary hover:text-text-primary'
        }`}
    >
        {children}
    </button>
);

const LoadingSpinner: React.FC = () => (
  <div className="flex flex-col items-center justify-center space-y-2">
    <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <p className="text-sm font-semibold text-primary">Generating your avatars...</p>
  </div>
);


export const UpdateAvatarModal: React.FC<UpdateAvatarModalProps> = ({ onClose, onSave }) => {
    const [activeTab, setActiveTab] = useState<'upload' | 'generate'>('upload');
    const [preview, setPreview] = useState<string | null>(null);
    const [prompt, setPrompt] = useState('a majestic lion with a crown');
    const [generatedAvatars, setGeneratedAvatars] = useState<string[]>([]);
    const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setPreview(result);
                setSelectedAvatar(result);
                setGeneratedAvatars([]);
                setError(null);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleGenerate = async () => {
        if (!prompt.trim()) return;
        setIsLoading(true);
        setError(null);
        setGeneratedAvatars([]);
        setSelectedAvatar(null);
        setPreview(null);
        try {
            const avatars = await generateAvatar(prompt);
            if (avatars) {
                setGeneratedAvatars(avatars);
            } else {
                setError('Could not generate avatars. Please try again.');
            }
        } catch (err) {
            setError('An error occurred during generation.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = () => {
        if (selectedAvatar) {
            onSave(selectedAvatar);
        }
    };
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-surface dark:bg-dark-surface rounded-lg shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
                <div className="p-6 border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold text-text-primary dark:text-dark-text-primary">Update Profile Picture</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                <div className="border-b flex">
                    <TabButton active={activeTab === 'upload'} onClick={() => setActiveTab('upload')}>
                        <PhotoIcon className="w-5 h-5" />
                        <span>Upload Photo</span>
                    </TabButton>
                    <TabButton active={activeTab === 'generate'} onClick={() => setActiveTab('generate')}>
                        <SparklesIcon className="w-5 h-5" />
                        <span>Generate with AI</span>
                    </TabButton>
                </div>

                <div className="p-6 overflow-y-auto flex-1 min-h-[250px]">
                    {activeTab === 'upload' && (
                        <div className="flex flex-col items-center justify-center space-y-4">
                            <div className="w-40 h-40 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-dashed">
                                {preview ? (
                                    <img src={preview} alt="Avatar preview" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-sm text-text-secondary text-center">Image Preview</span>
                                )}
                            </div>
                             <button type="button" onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors">
                                Choose Image
                            </button>
                            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                        </div>
                    )}
                    {activeTab === 'generate' && (
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="prompt" className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary">Describe your avatar</label>
                                <input id="prompt" type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-surface dark:bg-dark-surface dark:text-dark-text-primary rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
                            </div>
                            <button onClick={handleGenerate} disabled={isLoading} className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-secondary text-white rounded-lg hover:opacity-90 transition-colors disabled:bg-gray-400">
                                <SparklesIcon className="w-5 h-5" />
                                <span>{isLoading ? 'Generating...' : 'Generate'}</span>
                            </button>
                            {isLoading && <div className="flex justify-center py-4"><LoadingSpinner/></div>}
                            {error && <p className="text-sm text-center text-red-500">{error}</p>}
                            {generatedAvatars.length > 0 && (
                                <div className="grid grid-cols-2 gap-4 mt-4">
                                    {generatedAvatars.map((src, index) => (
                                        <button key={index} onClick={() => setSelectedAvatar(src)} className={`rounded-lg overflow-hidden border-4 transition-colors ${selectedAvatar === src ? 'border-primary' : 'border-transparent'}`}>
                                            <img src={src} alt={`Generated avatar ${index + 1}`} className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="p-6 border-t bg-gray-50 flex justify-end space-x-3">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-text-secondary rounded-lg hover:bg-gray-300 transition-colors">Cancel</button>
                    <button type="button" onClick={handleSave} disabled={!selectedAvatar || isLoading} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors disabled:bg-gray-400">Save Changes</button>
                </div>
            </div>
        </div>
    );
};