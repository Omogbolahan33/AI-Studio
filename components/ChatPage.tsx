import React, { useState, useEffect, useRef, useMemo } from 'react';
import type { Chat, Transaction, User, Post, Message } from '../types';
import { ClockIcon, ChevronLeftIcon, UserCircleIcon, PhoneIcon, ChevronRightIcon } from '../types';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';

interface ChatPageProps {
    chats: Chat[];
    activeChatId: string | null;
    onSelectChat: (chatId: string) => void;
    onSendMessage: (chatId: string, message: Omit<Message, 'id' | 'sender' | 'timestamp'>) => void;
    currentUser: User;
    users: User[];
    posts: Post[];
    transactions: Transaction[];
    onSelectTransaction: (transaction: Transaction) => void;
    onViewProfile: (user: User) => void;
    onSelectPost: (post: Post) => void;
    onInitiateCall: (user: User) => void;
    allStickers: string[];
    onSaveSticker: (stickerUrl: string) => void;
    onForwardMessage: (message: Message) => void;
}

const timeAgo = (isoDate: string): string => {
    if (!isoDate) return '';
    const date = new Date(isoDate);
    const now = new Date();
    const seconds = Math.round((now.getTime() - date.getTime()) / 1000);

    if (seconds < 5) return "Just now";
    
    const intervals = [
        { label: 'year', seconds: 31536000 },
        { label: 'month', seconds: 2592000 },
        { label: 'day', seconds: 86400 },
        { label: 'hour', seconds: 3600 },
        { label: 'minute', seconds: 60 }
    ];

    for (const interval of intervals) {
        const count = Math.floor(seconds / interval.seconds);
        if (count >= 1) {
            return `${count} ${interval.label}${count !== 1 ? 's' : ''} ago`;
        }
    }
    return "Just now";
};


const ChatListItem: React.FC<{ 
    chat: Chat; 
    isActive: boolean; 
    onSelect: () => void;
    otherUser?: User;
    onViewProfile: (user: User) => void;
}> = ({ chat, isActive, onSelect, otherUser, onViewProfile }) => {
    
    const handleProfileClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent the chat from being selected
        if (otherUser) {
            onViewProfile(otherUser);
        }
    };

    return (
        <div onClick={onSelect} role="button" tabIndex={0} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect()} className={`w-full text-left p-3 rounded-lg transition-colors flex space-x-3 items-center cursor-pointer ${isActive ? 'bg-primary-light dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-600'}`}>
            <button onClick={handleProfileClick} className="flex-shrink-0 rounded-full focus:outline-none focus:ring-2 focus:ring-primary">
                {otherUser?.avatarUrl ? (
                    <img src={otherUser.avatarUrl} alt={otherUser.name} className="w-12 h-12 rounded-full object-cover"/>
                ) : (
                    <UserCircleIcon className="w-12 h-12 text-gray-400" />
                )}
            </button>
            <div className="flex-1 overflow-hidden">
                <div className="flex justify-between items-baseline">
                    <button onClick={handleProfileClick} className="font-bold text-text-primary dark:text-dark-text-primary hover:underline truncate">{otherUser?.name || 'Unknown User'}</button>
                    <span className="text-xs text-text-secondary dark:text-dark-text-secondary flex-shrink-0 ml-2">{timeAgo(chat.lastMessageTimestamp)}</span>
                </div>
                <div className="text-sm text-text-secondary dark:text-dark-text-secondary truncate">{chat.postTitle || chat.transactionId ? `Re: ${chat.postTitle}` : 'Direct Message'}</div>
                <div className="text-xs text-text-secondary dark:text-dark-text-secondary mt-1 truncate max-w-[95%]">
                    {chat.lastMessage}
                </div>
            </div>
        </div>
    );
};

const ConversationView: React.FC<{ 
    chat: Chat; 
    currentUser: User;
    users: User[];
    onSendMessage: (chatId: string, message: Omit<Message, 'id' | 'sender' | 'timestamp'>) => void;
    onBack?: () => void; 
    otherUser?: User;
    post?: Post;
    onViewProfile: (user: User) => void;
    onSelectPost: (post: Post) => void;
    onInitiateCall: (user: User) => void;
    allStickers: string[];
    onSaveSticker: (stickerUrl: string) => void;
    onForwardMessage: (message: Message) => void;
}> = ({ chat, currentUser, users, onSendMessage, onBack, otherUser, post, onViewProfile, onSelectPost, onInitiateCall, allStickers, onSaveSticker, onForwardMessage }) => {
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
    
    const canCall = useMemo(() => {
        if (!otherUser) return false;
        const otherUserFull = users.find(u => u.id === otherUser.id);
        if (!otherUserFull) return false;
        return currentUser.followingIds.includes(otherUser.id) || otherUserFull.followingIds.includes(currentUser.id);
    }, [currentUser, otherUser, users]);

    return (
        <div className="w-full flex flex-col h-full bg-white dark:bg-dark-surface">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <div className="flex items-center space-x-3 overflow-hidden">
                    {onBack && (
                        <button onClick={onBack} className="md:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
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
    );
};

export const ChatPage: React.FC<ChatPageProps> = (props) => {
    const { chats, activeChatId, onSelectChat, currentUser, users, posts, onViewProfile, transactions, onSelectTransaction } = props;
    const [selectedChatIdForMobile, setSelectedChatIdForMobile] = useState<string | null>(null);
    const [isTxPaneOpen, setIsTxPaneOpen] = useState(true);
    
    const activeChat = chats.find(c => c.id === activeChatId);
    
    useEffect(() => {
      if (!activeChatId && chats.length > 0) {
        onSelectChat(chats[0].id);
      }
    }, [activeChatId, chats, onSelectChat]);
    
    const { otherUser, post } = useMemo(() => {
        if (!activeChat) return { otherUser: undefined, post: undefined };
        
        const otherUserName = activeChat.buyer === currentUser.name ? activeChat.seller : activeChat.buyer;
        const user = users.find(u => u.name === otherUserName);
        const p = activeChat.postId ? posts.find(p => p.id === activeChat.postId) : undefined;

        return { otherUser: user, post: p };
    }, [activeChat, currentUser, users, posts]);

    const sharedTransactions = useMemo(() => {
        if (!activeChat || !otherUser) return [];
        return transactions.filter(t => 
            (t.buyer === currentUser.name && t.seller === otherUser.name) ||
            (t.seller === currentUser.name && t.buyer === otherUser.name)
        );
    }, [activeChat, otherUser, currentUser.name, transactions]);

    const handleSelectChatForMobile = (chatId: string) => {
        onSelectChat(chatId);
        setSelectedChatIdForMobile(chatId);
    };

    return (
        <div className="flex h-full bg-surface dark:bg-dark-surface overflow-hidden">
            {/* Mobile View */}
            <div className="md:hidden w-full h-full">
                {!selectedChatIdForMobile ? (
                    <div className="w-full border-r border-gray-200 dark:border-gray-700 flex flex-col h-full">
                         <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                            <h1 className="text-xl font-bold text-text-primary dark:text-dark-text-primary">My Chats</h1>
                        </div>
                        <div className="flex-1 overflow-y-auto p-2 space-y-2">
                            {chats.map(chat => {
                                const otherUserName = chat.buyer === currentUser.name ? chat.seller : chat.buyer;
                                const otherUserObj = users.find(u => u.name === otherUserName);
                                return (
                                    <ChatListItem 
                                      key={chat.id} 
                                      chat={chat} 
                                      isActive={chat.id === activeChatId} 
                                      onSelect={() => handleSelectChatForMobile(chat.id)}
                                      otherUser={otherUserObj}
                                      onViewProfile={onViewProfile}
                                    />
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    activeChat && (
                        <ConversationView 
                              chat={activeChat}
                              currentUser={currentUser}
                              users={users}
                              onSendMessage={props.onSendMessage}
                              onBack={() => setSelectedChatIdForMobile(null)}
                              otherUser={otherUser}
                              post={post}
                              onViewProfile={onViewProfile}
                              onSelectPost={props.onSelectPost}
                              onInitiateCall={props.onInitiateCall}
                              allStickers={props.allStickers}
                              onSaveSticker={props.onSaveSticker}
                              onForwardMessage={props.onForwardMessage}
                           />
                    )
                )}
            </div>

            {/* Desktop View */}
            <div className="hidden md:flex w-1/3 border-r border-gray-200 dark:border-gray-700 flex-col">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <h1 className="text-xl font-bold text-text-primary dark:text-dark-text-primary">My Chats</h1>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                    {chats.map(chat => {
                        const otherUserName = chat.buyer === currentUser.name ? chat.seller : chat.buyer;
                        const otherUserObj = users.find(u => u.name === otherUserName);
                        return (
                             <ChatListItem 
                                key={chat.id} 
                                chat={chat} 
                                isActive={chat.id === activeChatId} 
                                onSelect={() => onSelectChat(chat.id)}
                                otherUser={otherUserObj}
                                onViewProfile={onViewProfile}
                            />
                        );
                    })}
                </div>
            </div>
            <div className="hidden md:flex flex-1 h-full">
                {activeChat ? (
                    <div className="flex flex-1 overflow-hidden">
                        <div className="flex-1 flex flex-col">
                            <ConversationView 
                                chat={activeChat}
                                currentUser={currentUser}
                                users={users}
                                onSendMessage={props.onSendMessage}
                                otherUser={otherUser}
                                post={post}
                                onViewProfile={onViewProfile}
                                onSelectPost={props.onSelectPost}
                                onInitiateCall={props.onInitiateCall}
                                allStickers={props.allStickers}
                                onSaveSticker={props.onSaveSticker}
                                onForwardMessage={props.onForwardMessage}
                            />
                        </div>
                        {sharedTransactions.length > 0 && (
                            <div className={`flex-shrink-0 border-l border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-dark-surface/50 transition-all duration-300 ease-in-out ${isTxPaneOpen ? 'w-80' : 'w-12'}`}>
                                <div className="h-full flex flex-col">
                                    <div className="p-2 border-b dark:border-gray-700 flex items-center justify-between">
                                        {isTxPaneOpen && <h3 className="font-bold text-text-primary dark:text-dark-text-primary text-sm px-2">Shared Transactions</h3>}
                                        <button onClick={() => setIsTxPaneOpen(!isTxPaneOpen)} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
                                            {isTxPaneOpen ? <ChevronRightIcon className="w-5 h-5" /> : <ChevronLeftIcon className="w-5 h-5" />}
                                        </button>
                                    </div>
                                    {isTxPaneOpen && (
                                        <div className="flex-1 overflow-y-auto p-2 space-y-2">
                                            {sharedTransactions.map(tx => (
                                                <button key={tx.id} onClick={() => onSelectTransaction(tx)} className="w-full text-left p-2 rounded-lg bg-white dark:bg-dark-surface hover:bg-gray-100 dark:hover:bg-gray-600">
                                                    <div className="flex justify-between items-center text-xs font-bold">
                                                        <span className="text-primary">{tx.id}</span>
                                                        <span>{tx.status}</span>
                                                    </div>
                                                    <p className="text-sm font-semibold truncate">{tx.item}</p>
                                                    <p className="text-xs text-right text-text-secondary">₦{tx.amount.toLocaleString()}</p>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex-1 flex items-center justify-center">
                        <p className="text-text-secondary dark:text-dark-text-secondary">Select a chat to start messaging.</p>
                    </div>
                )}
            </div>
        </div>
    );
};