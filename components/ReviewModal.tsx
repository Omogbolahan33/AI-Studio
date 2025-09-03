import React, { useState } from 'react';
import type { User } from '../types';
import { StarRating } from './StarRating';

interface ReviewModalProps {
  userToReview: User;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ userToReview, onClose, onSubmit }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            alert('Please select a star rating.');
            return;
        }
        onSubmit(rating, comment);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-surface dark:bg-dark-surface rounded-lg shadow-xl w-full max-w-md">
                <div className="p-6 border-b dark:border-gray-700">
                    <h2 className="text-xl font-bold text-text-primary dark:text-dark-text-primary">Rate {userToReview.name}</h2>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary mb-2">Your Rating</label>
                            <div className="flex justify-center">
                                <StarRating rating={rating} onRate={setRating} interactive size="lg" />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="comment" className="block text-sm font-medium text-text-secondary dark:text-dark-text-secondary">
                                Review (Optional)
                            </label>
                            <textarea
                                id="comment"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-surface dark:bg-gray-700 text-text-primary dark:text-dark-text-primary"
                                rows={4}
                                placeholder={`Share your experience with ${userToReview.name}...`}
                            />
                        </div>
                    </div>
                    <div className="p-6 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-text-secondary rounded-lg hover:bg-gray-300 transition-colors">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors">Submit Review</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
