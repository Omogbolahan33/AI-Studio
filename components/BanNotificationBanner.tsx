
import React from 'react';
import type { User } from '../types';

interface BanNotificationBannerProps {
  user: User;
}

export const BanNotificationBanner: React.FC<BanNotificationBannerProps> = ({ user }) => {
  if (!user.banExpiresAt || new Date(user.banExpiresAt) <= new Date()) {
    return null;
  }

  const expiryDate = new Date(user.banExpiresAt).toLocaleString();

  return (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 w-full" role="alert">
      <p className="font-bold">Posting Restriction</p>
      <p>Your ability to create new posts is temporarily restricted due to: "{user.banReason || 'a violation of community guidelines'}".</p>
      <p>This restriction will be lifted on {expiryDate}.</p>
    </div>
  );
};