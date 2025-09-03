import React from 'react';
import type { Review, User } from '../types';
import { StarRating } from './StarRating';
import { UserCircleIcon, CheckBadgeIcon } from '../types';
import { VerificationBadge } from './VerificationBadge';

interface ReviewsListProps {
  reviews: Review[];
  users: User[];
}

const timeAgo = (isoDate: string): string => {
    if (!isoDate) return '';
    const date = new Date(isoDate);
    const now = new Date();
    const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
    const intervals = [ { label: 'year', seconds: 31536000 }, { label: 'month', seconds: 2592000 }, { label: 'day', seconds: 86400 }, { label: 'hour', seconds: 3600 }, { label: 'minute', seconds: 60 } ];
    for (const interval of intervals) {
        const count = Math.floor(seconds / interval.seconds);
        if (count >= 1) return `${count} ${interval.label}${count !== 1 ? 's' : ''} ago`;
    }
    return "Just now";
};

export const ReviewsList: React.FC<ReviewsListProps> = ({ reviews, users }) => {
    if (reviews.length === 0) {
        return <p className="text-center text-text-secondary dark:text-dark-text-secondary py-8">This user has no reviews yet.</p>;
    }
    
    return (
        <div className="space-y-4">
            {reviews.map(review => {
                const reviewer = users.find(u => u.id === review.reviewerId);
                return (
                    <div key={review.id} className="bg-surface dark:bg-dark-surface p-4 rounded-lg shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-3">
                                {reviewer?.avatarUrl ? (
                                    <img src={reviewer.avatarUrl} alt={reviewer.name} className="w-10 h-10 rounded-full object-cover" />
                                ) : (
                                    <UserCircleIcon className="w-10 h-10 text-gray-400" />
                                )}
                                <div>
                                    <div className="flex items-center gap-1.5">
                                        <p className="font-bold text-text-primary dark:text-dark-text-primary">{reviewer?.name || 'Unknown User'}</p>
                                        {reviewer?.isVerified && <VerificationBadge />}
                                    </div>
                                    <p className="text-xs text-text-secondary dark:text-dark-text-secondary">{timeAgo(review.timestamp)}</p>
                                </div>
                            </div>
                            <StarRating rating={review.rating} />
                        </div>
                        {review.isVerifiedPurchase && (
                            <div className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300 px-2 py-1 rounded-full">
                                <CheckBadgeIcon className="w-4 h-4" />
                                <span>Verified Purchase</span>
                            </div>
                        )}
                        {review.comment && <p className="text-text-secondary dark:text-dark-text-secondary mt-2 text-sm italic">"{review.comment}"</p>}
                    </div>
                );
            })}
        </div>
    );
};