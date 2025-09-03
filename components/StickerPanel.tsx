import React, { useState } from 'react';

interface StickerPanelProps {
    allStickers: string[];
    savedStickers: string[];
    onSelectSticker: (stickerUrl: string) => void;
    onClose: () => void;
}

export const StickerPanel: React.FC<StickerPanelProps> = ({ allStickers, savedStickers, onSelectSticker, onClose }) => {
    const [activeTab, setActiveTab] = useState<'all' | 'saved'>('all');

    const displayedStickers = activeTab === 'all' ? allStickers : savedStickers;

    return (
        <div className="absolute bottom-full mb-2 w-72 h-80 bg-white dark:bg-dark-surface rounded-lg shadow-lg border dark:border-gray-700 flex flex-col overflow-hidden">
            <div className="flex border-b dark:border-gray-700 flex-shrink-0">
                <button
                    onClick={() => setActiveTab('all')}
                    className={`flex-1 py-2 text-sm font-semibold ${activeTab === 'all' ? 'text-primary border-b-2 border-primary' : 'text-text-secondary'}`}
                >
                    All
                </button>
                <button
                    onClick={() => setActiveTab('saved')}
                    className={`flex-1 py-2 text-sm font-semibold ${activeTab === 'saved' ? 'text-primary border-b-2 border-primary' : 'text-text-secondary'}`}
                >
                    Saved
                </button>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
                {displayedStickers.length > 0 ? (
                    <div className="grid grid-cols-4 gap-2">
                        {displayedStickers.map(url => (
                            <button key={url} onClick={() => onSelectSticker(url)} className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 aspect-square">
                                <img src={url} alt="sticker" className="w-full h-full object-contain" />
                            </button>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-sm text-text-secondary p-8">You have no saved stickers yet. Save stickers you receive to see them here.</p>
                )}
            </div>
        </div>
    );
};
