
import React, { useState, useEffect, useRef } from 'react';
import type { Chat } from '../types';

interface ChatPageProps {
    chats: Chat[];
    activeChatId: string | null;
    onSelectChat: (chatId: string) => void;
    onSendMessage: (chatId: string, message: string) => void;
}

const ChatListItem: React.FC<{ chat: Chat; isActive: boolean; onSelect: () => void }> = ({ chat, isActive, onSelect }) => (
    <button onClick={onSelect} className={`w-full text-left p-3 rounded-lg transition-colors ${isActive ? 'bg-primary-light' : 'hover:bg-gray-100'}`}>
        <div className="font-bold text-text-primary">{chat.seller}</div>
        <div className="text-sm text-text-secondary truncate">{chat.postTitle}</div>
        <div className="text-xs text-text-secondary mt-1 flex justify-between">
            <span className="truncate max-w-[80%]">{chat.lastMessage}</span>
            <span>{chat.lastMessageTimestamp}</span>
        </div>
    </button>
);

export const ChatPage: React.FC<ChatPageProps> = ({ chats, activeChatId, onSelectChat, onSendMessage }) => {
    const [message, setMessage] = useState('');
    const activeChat = chats.find(c => c.id === activeChatId);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [activeChat?.messages]);
    
    useEffect(() => {
      // If there's no active chat, select the first one if available
      if (!activeChatId && chats.length > 0) {
        onSelectChat(chats[0].id);
      }
    }, [activeChatId, chats, onSelectChat]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim() && activeChatId) {
            onSendMessage(activeChatId, message.trim());
            setMessage('');
        }
    };
    
    return (
        <div className="flex h-full bg-surface">
            <div className="w-1/3 border-r border-gray-200 flex flex-col">
                <div className="p-4 border-b border-gray-200">
                    <h1 className="text-xl font-bold text-text-primary">My Chats</h1>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                    {chats.map(chat => (
                        <ChatListItem key={chat.id} chat={chat} isActive={chat.id === activeChatId} onSelect={() => onSelectChat(chat.id)} />
                    ))}
                </div>
            </div>
            <div className="w-2/3 flex flex-col h-full">
                {activeChat ? (
                    <>
                        <div className="p-4 border-b border-gray-200">
                            <h2 className="font-bold text-lg text-text-primary">{activeChat.seller}</h2>
                            <p className="text-sm text-text-secondary">{activeChat.postTitle}</p>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {activeChat.messages.map((msg, index) => (
                                <div key={index} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`p-3 rounded-lg max-w-md ${msg.sender === 'me' ? 'bg-primary text-white' : 'bg-gray-200 text-text-primary'}`}>
                                        <p className="text-sm">{msg.text}</p>
                                        <span className={`text-xs mt-1 block text-right ${msg.sender === 'me' ? 'text-indigo-200' : 'text-text-secondary'}`}>{msg.timestamp}</span>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                        <div className="p-4 border-t border-gray-200 bg-white">
                            <form onSubmit={handleSubmit} className="flex items-center space-x-2">
                                <input
                                    type="text"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Type your message..."
                                    className="flex-1 px-4 py-2 border rounded-full bg-gray-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                                <button type="submit" className="p-2 bg-primary text-white rounded-full hover:bg-primary-hover transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                                      <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086L2.279 16.76a.75.75 0 00.95.826l16-5.333a.75.75 0 000-1.418l-16-5.333z" />
                                    </svg>
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center">
                        <p className="text-text-secondary">Select a chat to start messaging.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
