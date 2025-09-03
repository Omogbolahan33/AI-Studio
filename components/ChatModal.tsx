import React, { useState, useEffect, useRef, useMemo } from 'react';
import type { Chat, User, Post, Message } from '../types';
import { UserCircleIcon, ChevronLeftIcon, PhoneIcon } from '../types';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';

interface ChatModalProps {
    chat: Chat;
    currentUser: User;
    users: User[];
    posts: Post[];
    onSendMessage: (chatId: string, message: Omit<Message, 'id' | 'sender' | 'timestamp'>) => void;
    onClose: () => void;
    onViewProfile: (user: User) => void;
    onSelectPost: (post: Post) => void;
    onBack?: () => void;
    onInitiateCall: (user: User) => void;
    allStickers: string[];
    onSaveSticker: (stickerUrl: string) => void;
    onForwardMessage: (message: Message) => void;
}

export const ChatModal: React.FC<ChatModalProps> = (props) => {
    const { chat, currentUser, users, posts, onSendMessage, onClose, onViewProfile, onSelectPost, onBack, onInitiateCall, allStickers, onSaveSticker, onForwardMessage } = props;
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [replyingTo, setReplyingTo] = useState<Message | null>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [chat.messages]);
    
    const handleSendMessage = (messageContent: Omit<Message, 'id' | 'sender' | 'timestamp' | 'replyTo'>) => {
        let contentWithReply: Omit<Message, 'id' | 'sender' | 'timestamp'> = { ...messageContent };
        if (replyingTo) {
            contentWithReply.replyTo = {
                id: replyingTo.id,
                sender: replyingTo.sender,
                contentPreview: replyingTo.text ? replyingTo.text.substring(0, 50) + '...' : (replyingTo.stickerUrl ? 'Sticker' : 'Voice Note')
            };
        }
        onSendMessage(chat.id, contentWithReply);
        setReplyingTo(null);
    };

    const { otherUser, post } = useMemo(() => {
        if (!chat) return { otherUser: undefined, post: undefined };
        
        const otherUserName = chat.buyer === currentUser.name ? chat.seller : chat.buyer;
        const user = users.find(u => u.name === otherUserName);
        const p = chat.postId ? posts.find(p => p.id === chat.postId) : undefined;

        return { otherUser: user, post: p };
    }, [chat, currentUser, users, posts]);

    const canCall = useMemo(() => {
        if (!otherUser) return false;
        const otherUserFull = users.find(u => u.id === otherUser.id);
        if (!otherUserFull) return false;
        return currentUser.followingIds.includes(otherUser.id) || otherUserFull.followingIds.includes(currentUser.id);
    }, [currentUser, otherUser, users]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-surface dark:bg-dark-surface rounded-lg shadow-xl w-full max-w-lg h-[70vh] flex flex-col">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between flex-shrink-0">
                    <div className="flex items-center space-x-2 overflow-hidden">
                        {onBack && (
                            <button onClick={onBack} title="Back to Transaction Details" className="p-1 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700">
                                <ChevronLeftIcon className="w-6 h-6" />
                            </button>
                        )}
                         <button onClick={() => otherUser && onViewProfile(otherUser)} className="flex-shrink-0 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                            {otherUser?.avatarUrl ? (
                                <img src={otherUser.avatarUrl} alt={otherUser.name} className="w-10 h-10 rounded-full object-cover"/>
                            ) : (
                                <UserCircleIcon className="w-10 h-10 text-gray-400" />
                            )}
                        </button>
                        <div className="overflow-hidden">
                             <button onClick={() => otherUser && onViewProfile(otherUser)} className="font-bold text-lg text-text-primary dark:text-dark-text-primary hover:underline truncate block text-left">
                                {otherUser?.name || 'Unknown User'}
                            </button>
                            {post ? (
                                <button onClick={() => onSelectPost(post)} className="text-sm text-primary dark:text-indigo-400 hover:underline truncate block text-left" title={post.title}>
                                    {post.title}
                                </button>
                            ) : chat.transactionId ? (
                                <p className="text-sm text-text-secondary dark:text-dark-text-secondary truncate" title={chat.postTitle}>
                                    Re: {chat.postTitle}
                                </p>
                            ) : (
                                <p className="text-sm text-text-secondary dark:text-dark-text-secondary text-left">Direct Message</p>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button 
                            onClick={() => otherUser && onInitiateCall(otherUser)} 
                            disabled={!canCall} 
                            title={canCall ? `Call ${otherUser?.name}` : "At least one of you must follow the other to start a call"}
                            className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <PhoneIcon className="w-6 h-6" />
                        </button>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50 dark:bg-dark-background">
                    {chat.messages.map((msg) => (
                         <ChatMessage 
                            key={msg.id}
                            message={msg}
                            currentUser={currentUser}
                            onReply={() => setReplyingTo(msg)}
                            onForward={() => onForwardMessage(msg)}
                            onSaveSticker={onSaveSticker}
                        />
                    ))}
                    <div ref={messagesEndRef} />
                </div>
                 <ChatInput 
                    onSubmit={handleSendMessage}
                    replyingTo={replyingTo}
                    onClearReply={() => setReplyingTo(null)}
                    allStickers={allStickers}
                    savedStickers={currentUser.savedStickers || []}
                />
            </div>
        </div>
    );
};