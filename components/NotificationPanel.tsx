import React from 'react';
import type { Notification, Chat } from '../types';
import { HandThumbUpIcon, ChatBubbleBottomCenterTextIcon, UserPlusIcon, CogIcon, EnvelopeIcon, DocumentReportIcon } from '../types';

type PanelItem = Notification | Chat;

interface NotificationPanelProps {
  type: 'notification' | 'message';
  items: PanelItem[];
  onClose: () => void;
  onItemClick: (item: PanelItem) => void;
  onNavigate?: () => void;
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

const getIcon = (item: PanelItem) => {
    if ('type' in item) { // It's a Notification
        switch (item.type) {
            case 'like': return <HandThumbUpIcon className="w-5 h-5 text-blue-500" />;
            case 'comment': return <ChatBubbleBottomCenterTextIcon className="w-5 h-5 text-green-500" />;
            case 'follow': return <UserPlusIcon className="w-5 h-5 text-purple-500" />;
            case 'post': return <DocumentReportIcon className="w-5 h-5 text-indigo-500" />;
            case 'system': return <CogIcon className="w-5 h-5 text-gray-500" />;
        }
    }
    return <EnvelopeIcon className="w-5 h-5 text-gray-500" />; // It's a Chat/Message
};

const getContent = (item: PanelItem) => {
    if ('content' in item) { // Notification
        return item.content;
    }
    // Chat/Message
    return `New message from ${item.seller}: "${item.lastMessage}"`;
}


export const NotificationPanel: React.FC<NotificationPanelProps> = ({ type, items, onClose, onItemClick, onNavigate }) => {
    const handleItemClick = (item: PanelItem) => {
        onItemClick(item);
        onClose();
    };

    return (
        <div className="absolute top-full right-4 md:right-0 mt-2 w-[calc(100vw-2rem)] max-w-sm bg-white dark:bg-gray-800 rounded-md shadow-lg z-20 ring-1 ring-black ring-opacity-5">
            <div className="p-4 border-b dark:border-gray-700">
                <h3 className="text-lg font-semibold text-text-primary dark:text-dark-text-primary">{type === 'notification' ? 'Notifications' : 'Messages'}</h3>
            </div>
            <div className="max-h-96 overflow-y-auto">
                {items.length === 0 ? (
                    <p className="text-sm text-center text-text-secondary dark:text-dark-text-secondary py-8">No new {type}s.</p>
                ) : (
                    <ul className="divide-y dark:divide-gray-700">
                        {items.map(item => (
                            <li key={item.id}>
                                <button onClick={() => handleItemClick(item)} className={`w-full text-left p-4 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-start space-x-3 ${'read' in item && !item.read ? 'bg-primary-light dark:bg-opacity-10' : ''}`}>
                                    <div className="flex-shrink-0 pt-1">{getIcon(item)}</div>
                                    <div>
                                        <p className="text-sm text-text-primary dark:text-dark-text-primary">{getContent(item)}</p>
                                        <p className="text-xs text-text-secondary dark:text-dark-text-secondary mt-1">
                                            {timeAgo('timestamp' in item ? item.timestamp : item.lastMessageTimestamp)}
                                        </p>
                                    </div>
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            {onNavigate && (
                <div className="p-2 bg-gray-50 dark:bg-gray-900 text-center">
                    <button onClick={onNavigate} className="text-sm font-semibold text-primary hover:underline">
                        View All {type === 'notification' ? 'Notifications' : 'Messages'}
                    </button>
                </div>
            )}
        </div>
    );
};