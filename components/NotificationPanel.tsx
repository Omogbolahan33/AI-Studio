
import React from 'react';
import type { Notification, Chat } from '../types';
import { HandThumbUpIcon, ChatBubbleBottomCenterTextIcon, UserPlusIcon, CogIcon, EnvelopeIcon } from '../types';

type PanelItem = Notification | Chat;

interface NotificationPanelProps {
  type: 'notification' | 'message';
  items: PanelItem[];
  onClose: () => void;
  onMarkAsRead?: (id: string) => void;
  onNavigate?: () => void;
}

const getIcon = (item: PanelItem) => {
    if ('type' in item) { // It's a Notification
        switch (item.type) {
            case 'like': return <HandThumbUpIcon className="w-5 h-5 text-blue-500" />;
            case 'comment': return <ChatBubbleBottomCenterTextIcon className="w-5 h-5 text-green-500" />;
            case 'follow': return <UserPlusIcon className="w-5 h-5 text-purple-500" />;
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


export const NotificationPanel: React.FC<NotificationPanelProps> = ({ type, items, onClose, onMarkAsRead, onNavigate }) => {
    const handleItemClick = (item: PanelItem) => {
        if ('read' in item && onMarkAsRead) { // Notification
            onMarkAsRead(item.id);
        }
        if (onNavigate) {
            onNavigate();
        }
        onClose();
    };

    return (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-20 ring-1 ring-black ring-opacity-5">
            <div className="p-4 border-b">
                <h3 className="text-lg font-semibold text-text-primary">{type === 'notification' ? 'Notifications' : 'Messages'}</h3>
            </div>
            <div className="max-h-96 overflow-y-auto">
                {items.length === 0 ? (
                    <p className="text-sm text-center text-text-secondary py-8">No new {type}s.</p>
                ) : (
                    <ul className="divide-y">
                        {items.map(item => (
                            <li key={item.id}>
                                <button onClick={() => handleItemClick(item)} className={`w-full text-left p-4 hover:bg-gray-50 flex items-start space-x-3 ${'read' in item && !item.read ? 'bg-primary-light' : ''}`}>
                                    <div className="flex-shrink-0 pt-1">{getIcon(item)}</div>
                                    <div>
                                        <p className="text-sm text-text-primary">{getContent(item)}</p>
                                        <p className="text-xs text-text-secondary mt-1">
                                            {'timestamp' in item ? item.timestamp : item.lastMessageTimestamp}
                                        </p>
                                    </div>
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            {onNavigate && (
                 <div className="p-2 border-t text-center">
                    <button onClick={onNavigate} className="text-sm font-semibold text-primary hover:underline">
                        View all {type}s
                    </button>
                </div>
            )}
        </div>
    );
};