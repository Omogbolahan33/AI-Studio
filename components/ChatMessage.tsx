import React, { useState } from 'react';
import type { Message, User } from '../types';
import { ArrowUturnLeftIcon, ShareIcon, BookmarkSquareIcon } from '../types';
import { VoiceNotePlayer } from './VoiceNotePlayer';

interface ChatMessageProps {
  message: Message;
  currentUser: User;
  onReply: () => void;
  onForward: () => void;
  onSaveSticker: (stickerUrl: string) => void;
}

const timeAgo = (isoDate: string): string => {
    if (!isoDate) return '';
    const date = new Date(isoDate);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, currentUser, onReply, onForward, onSaveSticker }) => {
  const isMyMessage = message.sender === currentUser.name;
  const [showActions, setShowActions] = useState(false);

  const canSaveSticker = !!message.stickerUrl && !isMyMessage && !(currentUser.savedStickers || []).includes(message.stickerUrl);

  const bubbleClasses = isMyMessage 
    ? 'bg-primary text-white rounded-l-xl rounded-br-xl' 
    : 'bg-white dark:bg-dark-surface text-text-primary dark:text-dark-text-primary rounded-r-xl rounded-bl-xl';
  
  const containerClasses = isMyMessage ? 'justify-end' : 'justify-start';

  const ActionButton: React.FC<{ onClick: () => void; icon: React.ReactNode; title: string; }> = ({ onClick, icon, title }) => (
    <button onClick={onClick} title={title} className="p-1 rounded-full text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500">
      {icon}
    </button>
  );

  return (
    <div 
        className={`flex items-end gap-2 group ${containerClasses}`}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
    >
        {isMyMessage && (
            <div className={`flex items-center gap-1 transition-opacity duration-200 ${showActions ? 'opacity-100' : 'opacity-0'}`}>
                <ActionButton onClick={onReply} icon={<ArrowUturnLeftIcon className="w-4 h-4"/>} title="Reply" />
                <ActionButton onClick={onForward} icon={<ShareIcon className="w-4 h-4"/>} title="Forward" />
            </div>
        )}

        <div className={`p-2.5 max-w-md ${bubbleClasses}`}>
            {message.isForwarded && (
                <p className="text-xs italic opacity-80 mb-1">Forwarded</p>
            )}

            {message.replyTo && (
                <div className="border-l-2 border-white/50 pl-2 mb-2">
                    <p className="text-xs font-semibold opacity-90">{message.replyTo.sender}</p>
                    <p className="text-xs opacity-80 truncate">{message.replyTo.contentPreview}</p>
                </div>
            )}

            {message.text && <p className="text-sm whitespace-pre-wrap">{message.text}</p>}
            {message.stickerUrl && (
                <img src={message.stickerUrl} alt="sticker" className="w-32 h-32 object-contain" />
            )}
            {message.voiceNote && (
                <VoiceNotePlayer audioUrl={message.voiceNote.audioUrl} duration={message.voiceNote.duration} />
            )}

            <span className="text-xs mt-1.5 block text-right opacity-70">{timeAgo(message.timestamp)}</span>
        </div>

        {!isMyMessage && (
             <div className={`flex items-center gap-1 transition-opacity duration-200 ${showActions ? 'opacity-100' : 'opacity-0'}`}>
                {canSaveSticker && (
                    <ActionButton onClick={() => onSaveSticker(message.stickerUrl!)} icon={<BookmarkSquareIcon className="w-4 h-4"/>} title="Save Sticker" />
                )}
                <ActionButton onClick={onReply} icon={<ArrowUturnLeftIcon className="w-4 h-4"/>} title="Reply" />
                <ActionButton onClick={onForward} icon={<ShareIcon className="w-4 h-4"/>} title="Forward" />
            </div>
        )}
    </div>
  );
};
