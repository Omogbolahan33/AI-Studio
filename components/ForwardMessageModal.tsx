import React, { useState, useMemo } from 'react';
import type { Message, Chat, User } from '../types';
import { UserCircleIcon } from '../types';

interface ForwardMessageModalProps {
  messageToForward: Message;
  userChats: Chat[];
  currentUser: User;
  users: User[];
  onClose: () => void;
  onConfirm: (targetChatIds: string[]) => void;
}

export const ForwardMessageModal: React.FC<ForwardMessageModalProps> = ({ messageToForward, userChats, currentUser, users, onClose, onConfirm }) => {
  const [selectedChatIds, setSelectedChatIds] = useState<string[]>([]);

  const handleToggleChat = (chatId: string) => {
    setSelectedChatIds(prev =>
      prev.includes(chatId) ? prev.filter(id => id !== chatId) : [...prev, chatId]
    );
  };

  const handleSubmit = () => {
    if (selectedChatIds.length > 0) {
      onConfirm(selectedChatIds);
    }
  };

  const getOtherUser = (chat: Chat) => {
      const otherUserName = chat.buyer === currentUser.name ? chat.seller : chat.buyer;
      return users.find(u => u.name === otherUserName);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[101] flex justify-center items-center p-4">
      <div className="bg-surface dark:bg-dark-surface rounded-lg shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
        <div className="p-6 border-b dark:border-gray-700">
          <h2 className="text-xl font-bold text-text-primary dark:text-dark-text-primary">Forward Message</h2>
        </div>
        
        <div className="p-4 overflow-y-auto space-y-4">
            <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <p className="text-sm font-semibold mb-1">Message to forward:</p>
                <div className="text-xs text-text-secondary dark:text-dark-text-secondary italic">
                    {messageToForward.text && `"${messageToForward.text}"`}
                    {messageToForward.stickerUrl && "[Sticker]"}
                    {messageToForward.voiceNote && `[Voice Note (${messageToForward.voiceNote.duration}s)]`}
                </div>
            </div>

            <h3 className="text-md font-semibold text-text-primary dark:text-dark-text-primary">Select Chats:</h3>
            <ul className="space-y-2 max-h-60 overflow-y-auto">
                {userChats.map(chat => {
                    const otherUser = getOtherUser(chat);
                    return (
                        <li key={chat.id}>
                            <label className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                                <input
                                    type="checkbox