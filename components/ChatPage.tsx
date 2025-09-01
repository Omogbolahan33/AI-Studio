
import React, { useState, useEffect, useRef, useMemo } from 'react';
import type { Chat, Transaction } from '../types';
import { ClockIcon, ChevronLeftIcon } from '../types';


interface ChatPageProps {
    chats: Chat[];
    activeChatId: string | null;
    onSelectChat: (chatId: string) => void;
    onSendMessage: (chatId: string, message: string) => void;
    allTransactions: Transaction[];
    onSelectTransaction: (transaction: Transaction) => void;
}

const ChatListItem: React.FC<{ chat: Chat; isActive: boolean; onSelect: () => void }> = ({ chat, isActive, onSelect }) => (
    <button onClick={onSelect} className={`w-full text-left p-3 rounded-lg transition-colors ${isActive ? 'bg-primary-light' : 'hover:bg-gray-100'}`}>
        <div className="font-bold text-text-primary">{chat.seller}</div>
        <div className="text-sm text-text-secondary truncate">{chat.postTitle || 'Direct Message'}</div>
        <div className="text-xs text-text-secondary mt-1 flex justify-between">
            <span className="truncate max-w-[80%]">{chat.lastMessage}</span>
            <span>{chat.lastMessageTimestamp}</span>
        </div>
    </button>
);

const TransactionHistoryPane: React.FC<{ 
    transactions: Transaction[], 
    onSelectTransaction: (t: Transaction) => void,
    isCollapsed: boolean,
    onToggle: () => void,
}> = ({ transactions, onSelectTransaction, isCollapsed, onToggle }) => (
    <div className={`transition-all duration-300 ${isCollapsed ? 'w-12' : 'w-full md:w-1/3 md:max-w-xs'}`}>
        <div className="w-full flex flex-col h-full bg-gray-50 border-l border-gray-200">
            <div className="p-2 md:p-4 border-b border-gray-200 flex items-center justify-between">
                {!isCollapsed && <h2 className="font-bold text-md md:text-lg text-text-primary">History</h2>}
                <button onClick={onToggle} className="p-2 rounded-full hover:bg-gray-200" title={isCollapsed ? "Show History" : "Hide History"}>
                    <ChevronLeftIcon className={`w-5 h-5 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} />
                </button>
            </div>
             {!isCollapsed && (
                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                    {transactions.length > 0 ? transactions.map(t => (
                        <button key={t.id} onClick={() => onSelectTransaction(t)} className="w-full text-left p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                            <p className="font-semibold text-sm text-text-primary truncate">{t.item}</p>
                            <div className="text-xs text-text-secondary mt-1 flex justify-between">
                                <span>{t.id}</span>
                                <span className="font-medium">${t.amount.toFixed(2)}</span>
                            </div>
                        </button>
                    )) : (
                        <p className="text-sm text-center text-text-secondary p-4">No transactions with this user.</p>
                    )}
                </div>
             )}
        </div>
    </div>
);

const ConversationView: React.FC<{ chat: Chat; onSendMessage: (chatId: string, message: string) => void; onBack?: () => void; onToggleHistory?: () => void }> = ({ chat, onSendMessage, onBack, onToggleHistory }) => {
    const [message, setMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [chat.messages]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim() && chat.id) {
            onSendMessage(chat.id, message.trim());
            setMessage('');
        }
    };
    
    return (
        <div className="w-full flex flex-col h-full bg-white">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    {onBack && (
                        <button onClick={onBack} className="md:hidden p-2 rounded-full hover:bg-gray-100">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                            </svg>
                        </button>
                    )}
                    <div>
                        <h2 className="font-bold text-lg text-text-primary">{chat.seller}</h2>
                        <p className="text-sm text-text-secondary truncate">{chat.postTitle || 'Direct Message'}</p>
                    </div>
                </div>
                {onToggleHistory && (
                     <button onClick={onToggleHistory} className="md:hidden p-2 rounded-full hover:bg-gray-100">
                        <ClockIcon className="w-6 h-6 text-gray-500" />
                    </button>
                )}
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {chat.messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`p-3 rounded-lg max-w-md shadow-sm ${msg.sender === 'me' ? 'bg-primary text-white' : 'bg-white text-text-primary'}`}>
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
        </div>
    );
};

export const ChatPage: React.FC<ChatPageProps> = ({ chats, activeChatId, onSelectChat, onSendMessage, allTransactions, onSelectTransaction }) => {
    const [selectedChatIdForMobile, setSelectedChatIdForMobile] = useState<string | null>(null);
    const [showHistoryMobile, setShowHistoryMobile] = useState(false);
    const [isHistoryCollapsed, setIsHistoryCollapsed] = useState(false);
    
    const activeChat = chats.find(c => c.id === activeChatId);
    
    useEffect(() => {
      if (!activeChatId && chats.length > 0) {
        onSelectChat(chats[0].id);
      }
    }, [activeChatId, chats, onSelectChat]);

    const relevantTransactions = useMemo(() => {
        if (!activeChat) return [];
        return allTransactions.filter(t => 
            (t.buyer === activeChat.buyer && t.seller === activeChat.seller) ||
            (t.buyer === activeChat.seller && t.seller === activeChat.buyer)
        ).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [activeChat, allTransactions]);
    
    const handleSelectChatForMobile = (chatId: string) => {
        onSelectChat(chatId);
        setSelectedChatIdForMobile(chatId);
        setShowHistoryMobile(false); // Reset history view on new chat select
    };

    return (
        <div className="flex h-full bg-surface overflow-hidden">
            {/* Mobile View */}
            <div className="md:hidden w-full h-full">
                {!selectedChatIdForMobile ? (
                    <div className="w-full border-r border-gray-200 flex flex-col h-full">
                         <div className="p-4 border-b border-gray-200">
                            <h1 className="text-xl font-bold text-text-primary">My Chats</h1>
                        </div>
                        <div className="flex-1 overflow-y-auto p-2 space-y-2">
                            {chats.map(chat => (
                                <ChatListItem key={chat.id} chat={chat} isActive={chat.id === activeChatId} onSelect={() => handleSelectChatForMobile(chat.id)} />
                            ))}
                        </div>
                    </div>
                ) : (
                    activeChat && (
                        showHistoryMobile 
                        ? <TransactionHistoryPane transactions={relevantTransactions} onSelectTransaction={onSelectTransaction} isCollapsed={false} onToggle={() => setShowHistoryMobile(false)} />
                        : <ConversationView chat={activeChat} onSendMessage={onSendMessage} onBack={() => setSelectedChatIdForMobile(null)} onToggleHistory={() => setShowHistoryMobile(prev => !prev)} />
                    )
                )}
            </div>

            {/* Desktop View */}
            <div className="hidden md:flex w-1/3 border-r border-gray-200 flex-col">
                <div className="p-4 border-b border-gray-200">
                    <h1 className="text-xl font-bold text-text-primary">My Chats</h1>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                    {chats.map(chat => (
                        <ChatListItem key={chat.id} chat={chat} isActive={chat.id === activeChatId} onSelect={() => onSelectChat(chat.id)} />
                    ))}
                </div>
            </div>
            <div className="hidden md:flex flex-1 h-full">
                {activeChat ? (
                    <div className="flex flex-1">
                        <div className="flex-1 flex flex-col">
                            <ConversationView chat={activeChat} onSendMessage={onSendMessage} />
                        </div>
                        <TransactionHistoryPane 
                            transactions={relevantTransactions} 
                            onSelectTransaction={onSelectTransaction}
                            isCollapsed={isHistoryCollapsed}
                            onToggle={() => setIsHistoryCollapsed(prev => !prev)}
                        />
                    </div>
                ) : (
                    <div className="flex-1 flex items-center justify-center">
                        <p className="text-text-secondary">Select a chat to start messaging.</p>
                    </div>
                )}
            </div>
        </div>
    );
};